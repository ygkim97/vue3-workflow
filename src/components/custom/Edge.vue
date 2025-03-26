<template>
  <component
    :is="edgeComponents[props.edgeType] || BezierEdge"
    :id="id"
    :style="[props.defaultEdgeStyle, isSelected ? props.selectEdgeStyle : {}]"
    :class="[props.defaultEdgeClass, isSelected ? props.selectEdgeClass : {}]"
    :source-x="props.sourceX"
    :source-y="props.sourceY"
    :target-x="props.targetX"
    :target-y="props.targetY"
    :source-position="props.sourcePosition"
    :target-position="props.targetPosition"
  />
</template>

<script lang="ts" setup>
import { type Component, computed, onMounted, watch, nextTick } from "vue";
import { SmoothStepEdge, StepEdge, BezierEdge, StraightEdge, useVueFlow } from "@vue-flow/core";
import type { Position } from "@vue-flow/core";

const { findEdge } = useVueFlow();

const edgeComponents: Record<string, Component> = {
  default: BezierEdge,
  step: StepEdge,
  smoothStep: SmoothStepEdge,
  straight: StraightEdge
};

const props = defineProps({
  id: {
    type: String
  },
  edgeType: {
    type: String,
    default: "default"
  },
  sourceX: {
    type: Number
  },
  sourceY: {
    type: Number
  },
  targetX: {
    type: Number
  },
  targetY: {
    type: Number
  },
  sourcePosition: {
    type: String as () => Position
  },
  targetPosition: {
    type: String as () => Position
  },
  defaultEdgeStyle: {
    type: Object,
    default: () => {}
  },
  defaultEdgeClass: {
    type: String,
    default: ""
  },
  selectEdgeStyle: {
    type: Object,
    default: () => {}
  },
  selectEdgeClass: {
    type: String,
    default: ""
  },
  markerType: {
    type: Object,
    default: () => {}
  }
});

const edgeData = computed(() => {
  return findEdge(props.id);
});

const isSelected = computed(() => {
  return edgeData.value?.selected ?? false;
});

watch(
  () => isSelected.value,
  () => {
    nextTick(() => {
      setMarkerColor();
    });
  }
);

const setMarkerColor = () => {
  let strokeColor = "";

  const el = document.querySelector(`[data-id="${props.id}"] .vue-flow__edge-path`);
  if (el) {
    const styles = window.getComputedStyle(el);
    strokeColor = styles.stroke;
  }

  if (edgeData.value) {
    if (props.markerType?.markerStart) {
      edgeData.value.markerStart = { type: props.markerType.markerStart, color: strokeColor };
    }
    if (props.markerType?.markerEnd) {
      edgeData.value.markerEnd = { type: props.markerType.markerEnd, color: strokeColor };
    }
  }
};

onMounted(() => {
  setMarkerColor();
});
</script>

<style></style>
