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
  <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" />
  <div>{{ nodeLabel }}</div>
  <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" />
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import type { PropType } from "vue";
import type { CustomNode, CustomEdge } from "../../types/vueFlowCore.ts";
import SvgICon from "../common/svgICon.vue";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import useFlowCommon from "../../composables/useFlowCommon.ts";
import { v4 as uuidv4 } from "uuid";

const { findNode, getNodes, getEdges, updateNodeData } = useVueFlow();
const { addNode, deleteElements, findAvailablePosition, transformNodeData, transformEdgeData, getPathByNodeId } =
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

const selectedNode = findNode(props.id);

const nodeLabel = computed(() => {
  return props.data?.[props.nodeLabelKey];
});

const nodeType = computed(() => {
  return props.data?.[props.nodeTypeKey];
});

const createNode = () => {
  if (!selectedNode) return;

  const node = {
    id: uuidv4(),
    type: "custom",
    position: findAvailablePosition(selectedNode.position),
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
  if (!selectedNode) return;

  emit("editNode", transformNodeData(selectedNode) as CustomNode);
};

const copyNode = () => {
  if (!selectedNode) return;

  const node = {
    ...selectedNode,
    id: uuidv4(),
    position: findAvailablePosition(selectedNode.position),
    selected: false
  };
  addNode(node);
  emit("copyNode", transformNodeData(node) as CustomNode);
};

const execute = () => {
  if (!selectedNode) return;

  const transformNodes = transformNodeData(getNodes.value) as CustomNode[];
  const params = {
    nodes: transformNodes,
    edges: transformEdgeData(getEdges.value) as CustomEdge[],
    pathNodes: getPathByNodeId(selectedNode.id)
  };
  emit("execute", params);
};

onMounted(() => {
  // NOTE: default label, type 설정
  if (!props.data[props.nodeLabelKey]) {
    updateNodeData(props.id, { [props.nodeLabelKey]: "Node" });
  }
  if (!props.data[props.nodeTypeKey]) {
    updateNodeData(props.id, { [props.nodeTypeKey]: "default" });
  }
});
</script>

<style>
/* custom node default style */
.vue-flow__node {
  padding: 10px;
  border-radius: 3px;
  width: 150px;
  font-size: 12px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  color: var(--vf-node-text);
  background-color: var(--vf-node-bg);
  border-color: var(--vf-node-color);
}

.vue-flow__node.selected {
  background-color: #444c56;
  color: #ffffff;
  border-color: #636e7b;
}

/* TODO: nodeToolbar 기본 style 적용 */
.vue-flow__node-toolbar {
  display: grid;
  grid-auto-flow: column; /* 가로 방향으로 아이템 나열 */
  grid-auto-columns: 1fr; /* 모든 칸 동일 너비 */
  justify-items: center; /* 각 셀 내부 가운데 정렬 */
  align-items: center;
  gap: 0.5rem;
  background-color: whitesmoke;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.vue-flow__node-toolbar button {
  width: 30px;
  height: 30px;
  background: whitesmoke;
  color: black;
  border: 1px solid lightgray;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.vue-flow__node-toolbar button:hover {
  background: lightgray;
}

.vue-flow__node-toolbar button svg,
.vue-flow__node-toolbar button img {
  width: 15px;
  height: 15px;
  fill: black;
}
</style>
