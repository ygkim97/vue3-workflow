<template>
  <NodeToolbar
    :is-visible="props.useNodeToolbar ? undefined : false"
    :position="props.nodeToolbarPosition"
    :offset="props.nodeToolbarOffset"
  >
    <template v-for="item in toolbarItemList">
      <button v-if="item.isVisible" :key="item.id" type="button" @click="toolbarItemClick(id)">
        <SvgICon :name="item.iconName"></SvgICon>
      </button>
    </template>
  </NodeToolbar>
  <!-- TODO: 선택 노드 스타일 적용 -->
  <div :class="`vue-flow__node-${nodeType}`" :style="props.defaultNodeStyle">
    <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" :style="props.defaultHandleStyle" />
    <div>{{ nodeLabel }}</div>
    <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" :style="props.defaultHandleStyle" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import SvgICon from "../common/svgICon.vue";

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
  useNodeToolbar: {
    type: Boolean,
    default: true
  },
  nodeToolbarPosition: {
    type: String as PropType<Position>,
    default: "bottom"
  },
  nodeToolbarOffset: {
    type: Number,
    default: 10
  },
  nodeToolbarShowAdd: {
    type: Boolean,
    default: true
  },
  nodeToolbarShowDelete: {
    type: Boolean,
    default: true
  },
  nodeToolbarShowEdit: {
    type: Boolean,
    default: true
  },
  nodeToolbarShowCopy: {
    type: Boolean,
    default: true
  },
  nodeToolbarShowExecution: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: "toolbarItemClick", item: object): void;
}>();

const nodeLabel = computed(() => {
  return props.data?.[props.nodeLabelKey];
});
const nodeType = ref(props.data?.[props.nodeTypeKey] || "default");

const toolbarItemList = [
  { id: "add", iconName: "plus", isVisible: props.nodeToolbarShowAdd },
  { id: "delete", iconName: "trash", isVisible: props.nodeToolbarShowDelete },
  { id: "edit", iconName: "pen-to-square", isVisible: props.nodeToolbarShowEdit },
  { id: "copy", iconName: "copy", isVisible: props.nodeToolbarShowCopy },
  { id: "execution", iconName: "play", isVisible: props.nodeToolbarShowExecution }
];

// TODO: 노드 추가, 삭제, 수정 기능 추가
const toolbarItemClick = (id: string) => {
  emit("toolbarItemClick", { id });
};
</script>

<style>
/* TODO: nodeToolbar 기본 style 적용 */
.vue-flow__node-toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: whitesmoke;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.vue-flow__node-toolbar button {
  background: whitesmoke;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
}

.vue-flow__node-toolbar button:hover {
  background: lightgray;
}

.vue-flow__node-toolbar button svg {
  width: 30px;
  height: 30px;
  fill: black;
}
</style>
