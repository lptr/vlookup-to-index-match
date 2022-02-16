<script setup lang="ts">
import { ref, watch } from "vue";

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
