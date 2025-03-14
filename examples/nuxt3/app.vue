<template>
  <div class="work-flow">
    <header>Nuxt - Work Flow Test</header>
    <VueFlowCore
      id="nuxtVueFlow"
      :nodes="nodes"
      :edges="edges"
      bg-color="#edf2f7"
      :showBgPattern="true"
      :bg-pattern-gap="20"
      :bg-pattern-size="2"
      bg-pattern-color="gray"
      :min-zoom="0"
      :max-zoom="20"
      :snap-grid="[200, 200]"
      :use-mini-map="true"
      mini-map-position="top-left"
      mini-map-node-color="darkgray"
      mini-map-node-stroke-color="navy"
      mini-map-node-class-name="map-class"
      :mini-map-node-border-radius="15"
      :mini-map-node-stroke-width="5"
      mini-map-mask-color="lightgray"
      :mini-map-pannable="true"
      :mini-map-zoomable="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { MarkerType } from "@vue-flow/core";
import MiniMap from "../../src/components/custom/MiniMap.vue";

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
