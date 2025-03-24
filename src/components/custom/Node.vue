<template>
  <NodeToolbar
    :is-visible="props.useNodeToolbar ? undefined : false"
    :position="props.nodeToolbarPosition"
    :offset="props.nodeToolbarOffset"
  >
    <template v-for="item in toolbarItemList">
      <button v-if="item.isVisible" :key="item.id" type="button" @click="toolbarItemClick(item.id)">
        <SvgICon :name="item.iconName"></SvgICon>
      </button>
    </template>
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
import type { Node } from "@vue-flow/core";
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
  (e: "toolbarItemClick", item: object): void;
}>();

const nodeStyle = computed(() => {
  const node = findNode(props.id);
  return {
    ...props.defaultNodeStyle,
    ...(node && node.selected ? props.selectNodeStyle : {})
  };
});

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

const toolbarItemClick = (id: string) => {
  // TODO: NodeToolbar 이벤트 전달방식 고려
  const selectedNode: Node | undefined = findNode(props.id);
  if (!selectedNode) return;

  let params: any = {};

  if (id === "add") {
    params = {
      id: uuidv4(),
      type: "custom",
      position: findAvailablePosition(selectedNode.position),
      data: { [props.nodeLabelKey]: "Node" }
    };
    addNode(params);
  } else if (id === "delete") {
    params = deleteElements();
    if (!params) return;
  } else if (id === "edit") {
    params = selectedNode;
  } else if (id === "copy") {
    params = {
      ...selectedNode,
      id: uuidv4(),
      position: findAvailablePosition(selectedNode.position),
      selected: false
    };
    addNode(params);
  } else if (id === "execution") {
    // TODO: nodePath 데이터 전달
    params = { nodes: getNodes.value, edges: getEdges.value };
  }
  emit("toolbarItemClick", { id, params });
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
