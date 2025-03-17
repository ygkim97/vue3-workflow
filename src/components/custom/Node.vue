<template>
  <!-- TODO: 선택 노드 스타일 적용 -->
  <div :class="`vue-flow__node-${nodeType}`" :style="defaultNodeStyle">
    <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" :style="defaultHandleStyle" />
    <div>{{ nodeLabel }}</div>
    <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" :style="defaultHandleStyle" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: () => {}
  },
  nodeLabelKey: {
    type: String,
    default: "label"
  },
  nodeTypeKey: {
    type: String,
    default: "type"
  },
  defaultNodeStyle: {
    type: Object,
    default: () => {}
  },
  defaultHandleStyle: {
    type: Object,
    default: () => {}
  },
  customNodeProps: {
    type: Object
  }
});

const nodeLabel = computed(() => {
  return props.data?.[props.nodeLabelKey];
});
const nodeType = ref(props.data?.[props.nodeTypeKey] || "default");
</script>
