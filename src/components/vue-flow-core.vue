<template>
  <VueFlow :id="id" :nodes="props.nodes" :edges="props.edges"> </VueFlow>
</template>

<script lang="ts" setup>
import { VueFlow } from "@vue-flow/core";
import type { PropType } from "vue";
import type { Node, Edge } from "@vue-flow/core";
import GraphData1 from "../graph-data/graph-data-1.json";

const props = defineProps({
  id: {
    type: String,
    default: "vueFlowCore"
  },
  nodes: {
    type: Array as PropType<Node[]>,
    default: () => {
      // TODO: 개발하기 위해 default 데이터 설정, 개발 완료 후 삭제
      return GraphData1.nodes;
    }
  },
  edges: {
    type: Array as PropType<Edge[]>,
    default: () => {
      // TODO: 개발하기 위해 default 데이터 설정, 개발 완료 후 삭제
      return GraphData1.edges;
    }
  }
});
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

html,
body,
#app {
  margin: 0;
  height: 100%;
}
</style>
