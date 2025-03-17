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
    <MiniMap
      :use-mini-map="props.useMiniMap"
      :mini-map-position="props.miniMapPosition"
      :mini-map-node-color="props.miniMapNodeColor"
      :mini-map-node-stroke-color="props.miniMapNodeStrokeColor"
      :mini-map-node-class-name="props.miniMapNodeClassName"
      :mini-map-node-border-radius="props.miniMapNodeBorderRadius"
      :mini-map-node-stroke-width="props.miniMapNodeStrokeWidth"
      :mini-map-mask-color="props.miniMapMaskColor"
      :mini-map-pannable="props.miniMapPannable"
      :mini-map-zoomable="props.miniMapZoomable"
    />
    <!-- TODO: Control 추가 기능 구현 -->
    <Controls
      :use-control="props.useControl"
      :control-position="props.controlPosition"
      :show-zoom="props.showZoom"
      :show-fit-view="props.showFitView"
      :show-interactive="props.showInteractive"
      :show-undo="props.showUndo"
      :show-redo="props.showRedo"
      :show-screen-shot="props.showScreenShot"
      :show-theme="props.showTheme"
      :show-save="props.showSave"
      @undo="$emit('undo', $event)"
      @redo="$emit('redo', $event)"
      @screenShot="$emit('screenShot')"
      @save="$emit('save', $event)"
      @switchTheme="$emit('switchTheme', $event)"
    ></Controls>
  </VueFlow>
</template>

<script lang="ts" setup>
import { type PanelPositionType, VueFlow } from "@vue-flow/core";
import type { PropType } from "vue";
import type { Node, Edge } from "@vue-flow/core";
import GraphData1 from "../graph-data/graph-data-1.json";

import Background from "./custom/background.vue";
import MiniMap from "./custom/MiniMap.vue";
import Controls from "./custom/Controls.vue";

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
  },
  useMiniMap: {
    type: Boolean,
    default: true
  },
  miniMapPosition: {
    type: String as PropType<PanelPositionType>,
    default: "bottom-right"
  },
  miniMapNodeColor: {
    type: String,
    default: "#fff"
  },
  miniMapNodeStrokeColor: {
    type: String,
    default: "#555"
  },
  miniMapNodeClassName: {
    type: String
  },
  miniMapNodeBorderRadius: {
    type: Number,
    default: 5
  },
  miniMapNodeStrokeWidth: {
    type: Number,
    default: 2
  },
  miniMapMaskColor: {
    type: String,
    default: "rgb(240, 242, 243, 0.7)"
  },
  miniMapPannable: {
    type: Boolean,
    default: true
  },
  miniMapZoomable: {
    type: Boolean,
    default: true
  },
  useControl: {
    type: Boolean,
    default: true
  },
  controlPosition: {
    type: String as PropType<PanelPositionType>,
    default: "top-right"
  },
  showZoom: {
    type: Boolean,
    default: true
  },
  showFitView: {
    type: Boolean,
    default: true
  },
  showInteractive: {
    type: Boolean,
    default: true
  },
  showUndo: {
    type: Boolean,
    default: true
  },
  showRedo: {
    type: Boolean,
    default: true
  },
  showScreenShot: {
    type: Boolean,
    default: true
  },
  showTheme: {
    type: Boolean,
    default: true
  },
  showSave: {
    type: Boolean,
    default: true
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
