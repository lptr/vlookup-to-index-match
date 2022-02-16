<script setup lang="ts">
import VlookupConverter from './components/VlookupConverter.vue'
</script>

<template>
  <main>
    <VlookupConverter />
  </main>
</template>

<style>
@import './assets/base.css';

main {
  padding: 1rem;

  font-weight: normal;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
</style>
