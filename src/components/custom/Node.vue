<template>
  <NodeToolbar
    :is-visible="props.useNodeToolbar ? undefined : false"
    :position="props.nodeToolbarPosition"
    :offset="props.nodeToolbarOffset"
  >
    <button v-if="props.nodeToolbarShowAdd" type="button" @click="createNode">
      <SvgICon name="plus"></SvgICon>
    </button>
    <button v-if="props.nodeToolbarShowDelete" type="button" @click="deleteNode">
      <SvgICon name="trash"></SvgICon>
    </button>
    <button v-if="props.nodeToolbarShowEdit" type="button" @click="editNode">
      <SvgICon name="pen-to-square"></SvgICon>
    </button>
    <button v-if="props.nodeToolbarShowCopy" type="button" @click="copyNode">
      <SvgICon name="copy"></SvgICon></button
    ><button v-if="props.nodeToolbarShowExecution" type="button" @click="execute">
      <SvgICon name="play"></SvgICon>
    </button>
  </NodeToolbar>
  <div
    :style="[props.defaultNodeStyle, isSelected ? props.selectNodeStyle : {}]"
    :class="[`vue-flow__node-${nodeType}`, props.defaultNodeClass, isSelected ? props.selectNodeClass : '']"
  >
    <Handle
      v-if="nodeType !== 'input'"
      type="target"
      :position="Position.Left"
      :style="props.defaultHandleStyle"
      :class="defaultHandleClass"
    />
    <div>{{ nodeLabel }}</div>
    <Handle
      v-if="nodeType !== 'output'"
      type="source"
      :position="Position.Right"
      :style="props.defaultHandleStyle"
      :class="defaultHandleClass"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from "vue";
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import SvgICon from "../common/svgICon.vue";
import { v4 as uuidv4 } from "uuid";
import useFlowCommon from "../../composables/useFlowCommon.ts";
import type { CustomNode, CustomEdge } from "../../types/vueFlowCore.ts";

const { findNode, getNodes, getEdges } = useVueFlow();
const { addNode, deleteElements, findAvailablePosition, transformNodeData, transformEdgeData, getPathByNode } =
  useFlowCommon();

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
  defaultNodeClass: {
    type: String,
    default: ""
  },
  selectNodeStyle: {
    type: Object,
    default: () => {}
  },
  selectNodeClass: {
    type: String,
    default: ""
  },
  defaultHandleStyle: {
    type: Object,
    default: () => {}
  },
  defaultHandleClass: {
    type: String,
    default: ""
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
  (e: "addNode", item: CustomNode): void;
  (e: "deleteNode", item: { nodeIds: string[]; edgeIds: string[] }): void;
  (e: "editNode", item: CustomNode): void;
  (e: "copyNode", item: CustomNode): void;
  (e: "execute", item: { nodes: CustomNode[]; edges: CustomEdge[]; pathNodes: CustomNode[][] }): void;
}>();

const isSelected = computed(() => {
  const node = findNode(props.id);
  return node?.selected ?? false;
});

const selectedNode = computed(() => {
  return findNode(props.id);
});

const nodeLabel = computed(() => {
  return props.data?.[props.nodeLabelKey];
});

const nodeType = ref(props.data?.[props.nodeTypeKey] || "default");

const createNode = () => {
  if (!selectedNode.value) return;

  const node = {
    id: uuidv4(),
    type: "custom",
    position: findAvailablePosition(selectedNode.value.position),
    data: { [props.nodeLabelKey]: "Node" }
  };
  addNode(node);
  emit("addNode", node);
};

const deleteNode = () => {
  const deleteIds = deleteElements();
  if (!deleteIds) return;
  emit("deleteNode", deleteIds);
};

const editNode = () => {
  if (!selectedNode.value) return;

  const node = selectedNode.value;
  emit("editNode", transformNodeData(node) as CustomNode);
};

const copyNode = () => {
  if (!selectedNode.value) return;

  const node = {
    ...selectedNode.value,
    id: uuidv4(),
    position: findAvailablePosition(selectedNode.value.position),
    selected: false
  };
  addNode(node);
  emit("copyNode", transformNodeData(node) as CustomNode);
};

const execute = () => {
  if (!selectedNode.value) return;

  const transformNodes = transformNodeData(getNodes.value) as CustomNode[];
  const params = {
    nodes: transformNodes,
    edges: transformEdgeData(getEdges.value) as CustomEdge[],
    pathNodes: getPathByNode(selectedNode.value)
  };
  emit("execute", params);
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

.vue-flow__node-toolbar button svg,
.vue-flow__node-toolbar button img {
  width: 30px;
  height: 30px;
  fill: black;
}
</style>
