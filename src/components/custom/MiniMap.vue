<template>
  <MiniMap
    v-if="props.useMiniMap"
    :position="miniMapPosition"
    :node-color="miniMapNodeColor"
    :node-stroke-color="miniMapNodeStrokeColor"
    :node-class-name="miniMapNodeClassName"
    :node-border-radius="miniMapNodeBorderRadius"
    :node-stroke-width="miniMapNodeStrokeWidth"
    :mask-color="miniMapMaskColor"
    :pannable="miniMapPannable"
    :zoomable="miniMapZoomable"
  ></MiniMap>
</template>
<script setup lang="ts">
import { MiniMap } from "@vue-flow/minimap";
import type { PropType } from "vue";
import type { PanelPositionType } from "@vue-flow/core";

const props = defineProps({
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
  }
});
</script>

<style>
@import "@vue-flow/minimap/dist/style.css";
</style>
