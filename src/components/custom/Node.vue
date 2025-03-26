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
  <div :class="`vue-flow__node-${nodeType}`" :style="nodeStyle">
    <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" :style="props.defaultHandleStyle" />
    <div>{{ nodeLabel }}</div>
    <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" :style="props.defaultHandleStyle" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from "vue";
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import SvgICon from "../common/svgICon.vue";
import { v4 as uuidv4 } from "uuid";
import useFlowCommon from "../../composables/useFlowCommon.ts";

const { findNode, getNodes, getEdges } = useVueFlow();
const { addNode, deleteElements, findAvailablePosition } = useFlowCommon();

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
  selectNodeStyle: {
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
  (e: "addNode", item: object): void;
  (e: "deleteNode", item: object): void;
  (e: "editNode", item: object): void;
  (e: "copyNode", item: object): void;
  (e: "execute", item: object): void;
}>();

const nodeStyle = computed(() => {
  const node = findNode(props.id);
  return {
    ...props.defaultNodeStyle,
    ...(node && node.selected ? props.selectNodeStyle : {})
  };
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

  const params = {
    id: uuidv4(),
    type: "custom",
    position: findAvailablePosition(selectedNode.value.position),
    data: { [props.nodeLabelKey]: "Node" }
  };
  addNode(params);
  emit("addNode", params);
};

const deleteNode = () => {
  const params = deleteElements();
  if (!params) return;
  emit("deleteNode", params);
};

const editNode = () => {
  if (!selectedNode.value) return;

  const params = selectedNode.value;
  emit("editNode", params);
};

const copyNode = () => {
  if (!selectedNode.value) return;

  const params = {
    ...selectedNode.value,
    id: uuidv4(),
    position: findAvailablePosition(selectedNode.value.position),
    selected: false
  };
  addNode(params);
  emit("copyNode", params);
};

const execute = () => {
  // TODO: nodePath 데이터 전달
  const params = { nodes: getNodes.value, edges: getEdges.value };
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
