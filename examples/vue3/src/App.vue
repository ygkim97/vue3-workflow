<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="vue3-work-flow">
    <header>Vue3 - Work Flow Test</header>

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
  grid-template-rows: 50px auto;
}

header {
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  padding: 20px;
}
</style>
