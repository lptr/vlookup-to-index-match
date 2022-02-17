<script setup lang="ts">
import { ref, watch } from "vue";
import { Grammars, IToken, Parser } from "ebnf";
import formulaGrammar from "./Formula.bnf?raw";

const argumentSeparator = ";";

console.log(formulaGrammar);

const RULES = Grammars.Custom.getRules(formulaGrammar).concat(
  Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${argumentSeparator}"
`)
);
console.log(RULES);
const parser = new Parser(RULES, {});

function unpackTo(ast: IToken, type: string): IToken {
  if (ast.type === type) {
    return ast;
  }
  if (ast.children.length === 1) {
    return unpackTo(ast.children[0], type);
  }
  throw new Error(`Expected ${type} got: ${ast.type}`);
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
    ast.children[1].children.length === 4
  ) {
    const args = ast.children[1].children;
    console.log("Found VLOOKUP", args);
    const key = args[0];
    const reference = unpackTo(args[1], "Reference");
    const offset = asNumber(args[2]);
    const sorted = asBoolean(args[3]);

    const keyRange = columnAt(reference, 0);
    const valueRange = columnAt(reference, offset - 1);
    const matchSort = sorted ? "" : `${argumentSeparator} 0`;
    const transformedKey = callback(key);

    return `INDEX(${valueRange}${argumentSeparator} MATCH(${transformedKey}${argumentSeparator} ${keyRange}${matchSort}))`;
  } else {
    return callback(ast);
  }
}

const formula = ref("");
const transformed = ref("");
const unparsed = ref("");

watch(formula, (formula) => {
  console.log(formula);
  const ast = parser.getAST(formula);
  console.log(ast);
  if (ast === null) {
    transformed.value = "Failed to parse";
    unparsed.value = formula;
  } else {
    try {
      transformed.value = transform(ast, transformVlookup);
      unparsed.value = ast.rest;
    } catch (e: any) {
      console.error(e);
      transformed.value = "Failed to transform";
      unparsed.value = e;
    }
  }
  console.log("Transformed:", transformed.value);
});

formula.value = "=VLOOKUP(F2;tech!B:F;5;FALSE)";
</script>

<template>
  <h3>Original formula:</h3>
  <textarea class="input" v-model="formula" />
  <h3>Transformed formula:</h3>
  <pre>{{ transformed }}<span class="unparsed">{{ unparsed }}</span></pre>
</template>

<style scoped>
textarea.input {
  font-family: monospace;
  width: 40rem;
  height: 10rem;
}
.unparsed {
  color: red;
}
</style>
