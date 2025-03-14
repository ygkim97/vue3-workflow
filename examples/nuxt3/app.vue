<template>
  <div class="work-flow">
    <header>Nuxt - Work Flow Test</header>
    <VueFlowCore id="nuxtVueFlow" :nodes="nodes" :edges="edges" />
  </div>
</template>

<script lang="ts" setup>
import { MarkerType } from "@vue-flow/core";

const nodes = ref([
  {
    id: "test1",
    type: "input",
    position: { x: 100, y: 100 },
    data: { label: "Start" }
  },
  {
    id: "test2",
    type: "default",
    position: { x: 400, y: 100 },
    data: { label: "Process" }
  }
]);
const edges = ref([
  {
    id: "e1-2",
    type: "step",
    source: "test1",
    target: "test2",
    markerEnd: MarkerType.ArrowClosed
  }
]);
</script>

<style>
html,
body,
#__nuxt {
  margin: 0;
  height: 100%;
}

.work-flow {
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
