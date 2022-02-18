<script setup lang="ts">
import VlookupConverter from "./components/VlookupConverter.vue";
import { pageview } from "vue-gtag";

pageview({ page_path: "/" });
</script>

<template>
  <main>
    <h1>Transform VLOOKUP to INDEX/MATCH!</h1>
    <p>
      The <code>VLOOKUP</code> formula in Excel and Google Sheets is
      inefficient, and is prone to break when the target range is restructured.
      The solution is to use <code>INDEX</code> and <code>MATCH</code>! However,
      transforming existing formulae is non-trivial and easy to mess up.
    </p>
    <p>
      Hence this conveter tool! Take your existing formula, pop it into the box
      below, and it will convert all your existing
      <code>VLOOKUP</code> calls to <code>INDEX-MATCH</code>!
    </p>
    <VlookupConverter />
  </main>
</template>

<style>
@import "./assets/base.css";

h1 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 1em;
}

main {
  padding: 2rem;

  font-weight: normal;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
</style>
