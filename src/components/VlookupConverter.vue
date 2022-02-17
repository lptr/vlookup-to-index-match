<script setup lang="ts">
import { ref, watch } from "vue";
import { Grammars, Parser } from "ebnf";
import formulaGrammar from "./Formula.bnf?raw";

console.log(formulaGrammar);

const RULES = Grammars.Custom.getRules(formulaGrammar);
console.log(RULES);
const parser = new Parser(RULES, {});

const ast = parser.getAST("VLOOKUP(F2;tech!B:F;5;FALSE)");
console.log(ast);
// console.log(parser.getAST("-122 + 2"));

const text = ref("=VLOOKUP(F2;tech!B:F;5;FALSE)");
watch(text, (text) => {
  console.log(text);
});
</script>

<template>
  <label>VLOOKUP:</label>
  <p>Message is: {{ text }}</p>
  <input v-model="text" />
</template>

<style scoped>
input {
  font-family: monospace;
}
</style>
