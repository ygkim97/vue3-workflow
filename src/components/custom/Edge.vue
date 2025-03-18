<template>
  <component
    :is="edgeComponents[props.edgeType] || BezierEdge"
    :id="id"
    :style="defaultEdgeStyle"
    :source-x="props.sourceX"
    :source-y="props.sourceY"
    :target-x="props.targetX"
    :target-y="props.targetY"
    :source-position="props.sourcePosition"
    :target-position="props.targetPosition"
  />
</template>

export default { inheritAttrs: false };

<script lang="ts" setup>
import type { Component } from "vue";
import { SmoothStepEdge, StepEdge, BezierEdge, StraightEdge } from "@vue-flow/core";
import type { Position } from "@vue-flow/core";

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
  }
});

const edgeComponents: Record<string, Component> = {
  default: BezierEdge,
  step: StepEdge,
  smoothStep: SmoothStepEdge,
  straight: StraightEdge
};
</script>
