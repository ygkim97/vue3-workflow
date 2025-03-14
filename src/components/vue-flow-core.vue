<template>
  <VueFlow
    :id="props.id"
    :nodes="props.nodes"
    :edges="props.edges"
    :fit-view-on-init="true"
    :min-zoom="props.minZoom"
    :max-zoom="props.maxZoom"
    :snap-to-grid="true"
    :snap-grid="props.snapGrid as [number, number]"
    :connection-line-options="{}"
    :default-edge-options="{}"
  >
    <Background
      :bg-color="props.bgColor"
      :show-bg-pattern="props.showBgPattern"
      :bg-pattern-gap="props.bgPatternGap"
      :bg-pattern-size="props.bgPatternSize"
      :bg-pattern-color="props.bgPatternColor"
    />
  </VueFlow>
</template>

<script lang="ts" setup>
import { VueFlow } from "@vue-flow/core";
import type { PropType } from "vue";
import type { Node, Edge } from "@vue-flow/core";
import GraphData1 from "../graph-data/graph-data-1.json";

import Background from "./custom/background.vue";

const props = defineProps({
  id: {
    type: String,
    default: "vueFlowCore"
  },
  nodes: {
    type: Array as PropType<Node[]>,
    default: () => GraphData1.nodes // TODO: 개발하기 위해 default 데이터 설정, 개발 완료 후 삭제
  },
  edges: {
    type: Array as PropType<Edge[]>,
    default: () => GraphData1.edges // TODO: 개발하기 위해 default 데이터 설정, 개발 완료 후 삭제
  },
  minZoom: {
    type: Number,
    default: 0.5
  },
  maxZoom: {
    type: Number,
    default: 2
  },
  snapGrid: {
    type: Array as PropType<number[]>,
    default: () => [15, 15],
    validator(value: number[]) {
      if (value.length !== 2) {
        console.warn("snapGrid 는 반드시 두 개의 숫자를 포함해야 합니다.");
        return false;
      }
      return true;
    }
  },
  showBgPattern: {
    type: Boolean,
    default: true
  },
  bgPatternGap: {
    type: Number,
    default: 10
  },
  bgColor: {
    type: String,
    default: "#fff"
  },
  bgPatternSize: {
    type: Number,
    default: 0.4
  },
  bgPatternColor: {
    type: String,
    default: "#81818a"
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
