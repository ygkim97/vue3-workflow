<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="vue3-work-flow">
    <RouterView />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  height: 100%;
}

.vue3-work-flow {
  display: grid;
  height: 100%;
}
</style>
