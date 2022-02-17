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

function getTerminalType(ast: IToken): string | null {
  switch (ast.children.length) {
    case 0:
      return ast.type;
    case 1:
      return getTerminalType(ast.children[0]);
    default:
      return null;
  }
}

function transform(ast: IToken): string {
  switch (ast.type) {
    case "FunctionCall":
      if (
        ast.children[0].text === "VLOOKUP" &&
        ast.children[1].children.length === 4
      ) {
        const args = ast.children[1].children;
        console.log("Found VLOOKUP", args);
        const key = args[0];
        const range = args[1];
        const offset = args[2];
        const isSorted = args[3];

        const keyRange = range.text;
        const valueRange = range.text;

        const sortedType = getTerminalType(isSorted);
        if (sortedType !== "Boolean") {
          throw `sorted must be a boolean, not ${sortedType}`;
        }
        const matchSort = isSorted.text === "TRUE" ? 1 : 0;
        return `INDEX(${valueRange}${argumentSeparator} MATCH(${transform(
          key
        )}${argumentSeparator} ${keyRange}${argumentSeparator} ${matchSort})`;
      } else {
        return ast.children.map(transform).join("");
      }
    default: {
      let result = ast.text;
      const offset = ast.start;
      ast.children.reverse().forEach((child) => {
        result =
          result.slice(0, child.start - offset) +
          transform(child) +
          result.slice(child.end - offset);
      });
      return result;
    }
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
    transformed.value = transform(ast);
    unparsed.value = ast.rest;
  }
  console.log("Transformed:", transformed.value);
});

formula.value = "=VLOOKUP(F2;tech!B:F;5;FALSE)";
</script>

<template>
  <p>VLOOKUP:</p>
  <textarea class="input" v-model="formula" />
  <p>Transformed:</p>
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
