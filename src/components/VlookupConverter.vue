<script setup lang="ts">
import { ref, watch } from "vue";
import { Grammars, IToken, Parser } from "ebnf";
import formulaGrammar from "./Formula.bnf?raw";

const argumentSeparator = ref("");
const errors = ref<unknown[]>();

console.log(formulaGrammar);

let parser: Parser;

function unpackTo(ast: IToken, type: string): IToken {
  if (ast.type === type) {
    return ast;
  }
  if (ast.children.length === 1) {
    return unpackTo(ast.children[0], type);
  }
  throw new Error(`Expected ${type} got ${ast.type}: ${ast.text}`);
}

function asNumber(ast: IToken): number {
  return parseFloat(unpackTo(ast, "Number").text);
}

function asBoolean(ast: IToken): boolean {
  return unpackTo(ast, "Boolean").text.toUpperCase() === "TRUE";
}

function transform(
  ast: IToken,
  transformer: (ast: IToken, callback: (ast: IToken) => string) => string
): string {
  return transformer(ast, (ast) => {
    let result = ast.text;
    const offset = ast.start;
    ast.children
      .slice()
      .reverse()
      .forEach((child) => {
        result =
          result.slice(0, child.start - offset) +
          transform(child, transformer) +
          result.slice(child.end - offset);
      });
    return result;
  });
}

function incrementColumn(value: string): string {
  let carry = 1;
  let res = "";

  for (let i = value.length - 1; i >= 0; i--) {
    let char = value.toUpperCase().charCodeAt(i);

    char += carry;

    if (char > 90) {
      char = 65;
      carry = 1;
    } else {
      carry = 0;
    }

    res = String.fromCharCode(char) + res;

    if (!carry) {
      res = value.substring(0, i) + res;
      break;
    }
  }

  if (carry) {
    res = "A" + res;
  }

  return res;
}

function columnAt(ast: IToken, offset: number): string {
  return transform(ast, (ast, callback) => {
    if (ast.type === "Range") {
      const start = ast.children[0];
      const end = ast.children[1];
      let column = "UNKNOWN";
      const startResult = transform(start, (ast, callback) => {
        if (ast.type === "ColumnAddress") {
          column = ast.text;
          for (let i = 0; i < offset; i++) {
            column = incrementColumn(column);
          }
          return column;
        } else {
          return callback(ast);
        }
      });
      const endResult = transform(end, (ast, callback) => {
        if (ast.type === "ColumnAddress") {
          return column;
        } else {
          return callback(ast);
        }
      });
      return `${startResult}:${endResult}`;
    }
    return callback(ast);
  });
}

function transformVlookup(
  ast: IToken,
  callback: (ast: IToken) => string
): string {
  if (
    ast.type == "FunctionCall" &&
    ast.children[0].text.toUpperCase() === "VLOOKUP" &&
    ast.children[1].children.length >= 3 &&
    ast.children[1].children.length <= 4
  ) {
    const args = ast.children[1].children;
    console.log("Found VLOOKUP", args);
    const key = args[0];
    const reference = unpackTo(args[1], "Reference");
    const offset = asNumber(args[2]);
    const sorted =
      args.length === 3
        ? true
        : args[3].type == "EmptyArgument"
        ? false
        : asBoolean(args[3]);

    const keyRange = columnAt(reference, 0);
    const valueRange = columnAt(reference, offset - 1);
    const matchSort = sorted ? "" : `${argumentSeparator.value} 0`;
    const transformedKey = callback(key);

    return `INDEX(${valueRange}${argumentSeparator.value} MATCH(${transformedKey}${argumentSeparator.value} ${keyRange}${matchSort}))`;
  } else {
    return callback(ast);
  }
}

const formula = ref("");
const transformed = ref("");
const unparsed = ref("");
watch(argumentSeparator, (argumentSeparator) => {
  const RULES = Grammars.Custom.getRules(formulaGrammar).concat(
    Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${argumentSeparator}"
`)
  );
  console.log(RULES);
  parser = new Parser(RULES, {});
  formula.value = `=VLOOKUP(F2${argumentSeparator}tech!B:F${argumentSeparator}5${argumentSeparator}FALSE)`;
});

watch(formula, (formula) => {
  console.log(formula);
  const ast = parser.getAST(formula);
  console.log(ast);
  let errorsEncountered: unknown[] = [];
  if (ast === null) {
    transformed.value = "";
    unparsed.value = formula;
    errorsEncountered.push("Failed to parse");
  } else {
    try {
      transformed.value = transform(ast, transformVlookup);
      unparsed.value = ast.rest;
      errorsEncountered = errorsEncountered.concat(ast.errors);
    } catch (e) {
      transformed.value = "";
      unparsed.value = formula;
      console.error(e);

      let error: string;
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = `${e}`;
      }
      errorsEncountered.push(error);
    }
  }
  console.log("Transformed:", transformed.value);
  console.log("Errors", errorsEncountered);
  errors.value = errorsEncountered;
});

argumentSeparator.value = ";";
</script>

<template>
  <h3>Original formula:</h3>
  <textarea class="input" v-model="formula" />
  <div>
    <select v-model="argumentSeparator">
      <option value=",">Use <code>,</code> as argument separator</option>
      <option value=";">Use <code>;</code> as argument separator</option>
    </select>
  </div>
  <h3>Transformed formula:</h3>
  <div class="result">
    {{ transformed }}<span class="unparsed">{{ unparsed }}</span>
  </div>
  <div class="errors" v-if="errors?.length">
    <ul>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </div>
</template>

<style scoped>
.result,
textarea.input {
  font-family: monospace;
  width: 40rem;
  height: 10rem;
  display: inline-block;
  white-space: pre-wrap;
  border: 1px solid;
}
.errors,
.unparsed {
  color: red;
}
</style>
