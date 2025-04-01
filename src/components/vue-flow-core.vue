<template>
  <!-- ISSUE: selection-key-code / 문서에서는 KeyCode 입력이 가능하다고 되어 있으나, 실제로는 boolean 또는 null만 입력할 수 있다는 경고 발생, vue-flow git 이슈확인필요 -->
  <VueFlow
    :tabindex="0"
    :nodes="props.nodes"
    :edges="props.edges"
    :fit-view-on-init="true"
    :min-zoom="props.minZoom < 1 ? 1 : props.minZoom"
    :max-zoom="props.maxZoom > 10 ? 10 : props.maxZoom"
    :snap-to-grid="true"
    :snap-grid="props.snapGrid as [number, number]"
    :connection-line-options="{}"
    :delete-key-code="null"
    selection-key-code="Control"
    multi-selection-key-code="Control"
    @connect="onConnect"
    @nodes-change="onNodesChange"
    @nodeDragStop="onNodeDragStop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @node-click="onNodeClick"
    @edge-click="onEdgeClick"
    @keyup="onKeyup"
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
    <Controls
      :use-control="props.useControl"
      :control-position="props.controlPosition"
      :control-show-zoom="props.controlShowZoom"
      :control-show-fit-view="props.controlShowFitView"
      :control-show-interactive="props.controlShowInteractive"
      :control-show-undo-redo="props.controlShowUndoRedo"
      :control-show-screen-shot="props.controlShowScreenShot"
      :control-show-theme="props.controlShowTheme"
      :control-show-save="props.controlShowSave"
      :control-show-execution="props.controlShowExecution"
      @save="$emit('save', $event)"
      @executeAll="$emit('executeAll', $event)"
      @switchTheme="$emit('switchTheme', $event)"
    >
    </Controls>

    <template #node-custom="customNodeProps">
      <CustomNode
        :id="customNodeProps.id"
        :data="customNodeProps.data"
        :node-label-key="props.nodeLabelKey"
        :node-type-key="props.nodeTypeKey"
        :use-node-toolbar="props.useNodeToolbar"
        :node-toolbar-position="props.nodeToolbarPosition"
        :node-toolbar-offset="props.nodeToolbarOffset"
        :node-toolbar-show-add="props.nodeToolbarShowAdd"
        :node-toolbar-show-delete="props.nodeToolbarShowDelete"
        :node-toolbar-show-edit="props.nodeToolbarShowEdit"
        :node-toolbar-show-copy="props.nodeToolbarShowCopy"
        :node-toolbar-show-execution="props.nodeToolbarShowExecution"
        @addNode="$emit('addNode', $event)"
        @deleteNode="$emit('deleteNode', $event)"
        @editNode="$emit('editNode', $event)"
        @copyNode="$emit('copyNode', $event)"
        @execute="$emit('execute', $event)"
      >
      </CustomNode>
    </template>

    <template #edge-custom="customEdgeProps">
      <!-- NOTE: v-bind 해줘야 edge marker 동적 변경 가능, 다른 방법이 있다면 변경 -->
      <CustomEdge
        v-bind="customEdgeProps"
        :id="customEdgeProps.id"
        :source-x="customEdgeProps.sourceX"
        :source-y="customEdgeProps.sourceY"
        :target-x="customEdgeProps.targetX"
        :target-y="customEdgeProps.targetY"
        :source-position="customEdgeProps.sourcePosition"
        :target-position="customEdgeProps.targetPosition"
        :label="customEdgeProps.label"
        :labelBgBorderRadius="customEdgeProps.labelBgBorderRadius"
        :labelBgPadding="customEdgeProps.labelBgPadding"
        :labelBgStyle="customEdgeProps.labelBgStyle"
        :labelStyle="customEdgeProps.labelStyle"
        :edge-type="props.edgeType"
        :marker-type="props.markerType"
      ></CustomEdge>
    </template>
  </VueFlow>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { Position, VueFlow, useVueFlow } from "@vue-flow/core";
import type { PropType } from "vue";
import type { Node, Edge, PanelPositionType, GraphEdge } from "@vue-flow/core";
import type { CustomNode as CustomNodeType, CustomEdge as CustomEdgeType } from "../types/vueFlowCore.ts";
import GraphData1 from "../graph-data/graph-data-1.json";
import { v4 as uuidv4 } from "uuid";
import useFlowCommon from "../composables/useFlowCommon.ts";
import useDragAndDrop from "../composables/useDragAndDrop.ts";

import Background from "./custom/background.vue";
import MiniMap from "./custom/MiniMap.vue";
import Controls from "./custom/Controls.vue";
import CustomNode from "./custom/Node.vue";
import CustomEdge from "./custom/Edge.vue";

const { findNode, findEdge, getSelectedNodes, getSelectedEdges } = useVueFlow();
const {
  setSnapGrid,
  initHistoryStack,
  deleteElements,
  onNodesChange,
  onNodeDragStop,
  addEdge,
  updateNodeData,
  updateEdgeData,
  transformNodeData,
  transformEdgeData
} = useFlowCommon();
const { onDragStart, onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();

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
    default: 1
  },
  maxZoom: {
    type: Number,
    default: 5
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
  controlShowZoom: {
    type: Boolean,
    default: true
  },
  controlShowFitView: {
    type: Boolean,
    default: true
  },
  controlShowInteractive: {
    type: Boolean,
    default: true
  },
  controlShowUndoRedo: {
    type: Boolean,
    default: true
  },
  controlShowScreenShot: {
    type: Boolean,
    default: true
  },
  controlShowTheme: {
    type: Boolean,
    default: true
  },
  controlShowSave: {
    type: Boolean,
    default: true
  },
  controlShowExecution: {
    type: Boolean,
    default: true
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
  },
  edgeType: {
    type: String,
    default: "default"
  },
  markerType: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits<{
  (e: "save", item: { nodes: CustomNodeType[]; edges: CustomEdgeType[] }): void;
  (e: "executeAll", item: { nodes: CustomNodeType[]; edges: CustomEdgeType[]; pathNodes: CustomNodeType[][] }): void;
  (e: "switchTheme", item: { theme: string }): void;
  (e: "addNode", item: CustomNodeType): void;
  (e: "deleteNode", item: { nodeIds: string[]; edgeIds: string[] }): void;
  (e: "editNode", item: CustomNodeType): void;
  (e: "copyNode", item: CustomNodeType): void;
  (e: "execute", item: { nodes: CustomNodeType[]; edges: CustomEdgeType[]; pathNodes: CustomNodeType[][] }): void;
  (e: "deleteFlow", item: { nodeIds: string[]; edgeIds: string[] }): void;
  (e: "draggingOver", item: boolean): void;
  (e: "nodeClick", item: CustomNodeType): void;
  (e: "edgeClick", item: CustomEdgeType): void;
  (e: "selectFlow", item: { nodes: CustomNodeType[]; edges: CustomEdgeType[] }): void;
}>();

setSnapGrid(props.snapGrid as [number, number]);
watch(
  () => props.snapGrid,
  (value) => {
    setSnapGrid(value as [number, number]);
  }
);

watch(isDragOver, (value) => {
  emit("draggingOver", value);
});

const onNodeClick = ({ node }: { node: Node }) => {
  emit("nodeClick", transformNodeData(node) as CustomNodeType);
};

const onEdgeClick = ({ edge }: { edge: GraphEdge }) => {
  emit("edgeClick", transformEdgeData(edge) as CustomEdgeType);
};

const onConnect = (edge: any) => {
  addEdge({ id: uuidv4(), type: "custom", source: edge.source, target: edge.target });
};

const onDelete = () => {
  const deletedElements = deleteElements();
  if (deletedElements) {
    emit("deleteFlow", deletedElements);
  }
};

const changeNode = (node: Node) => {
  updateNodeData(node);
};

const changeEdge = (edge: GraphEdge) => {
  updateEdgeData(edge);
};

const onKeyup = (event: any) => {
  if (event.key === "Control") {
    const selectedNodes = getSelectedNodes.value;
    const selectedEdges = getSelectedEdges.value;

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      emit("selectFlow", {
        nodes: transformNodeData(selectedNodes) as CustomNodeType[],
        edges: transformEdgeData(selectedEdges) as CustomEdgeType[]
      });
    }
  }
};

let animatedEdgeIds = <string[]>[];
const changeEdgeAnimated = (edgeIds: string[]) => {
  // NOTE: 새로 animated 적용할 ids 조회 및 animated 삭제할 ids 조회
  const addAnimatedEdgeIds = edgeIds.filter((id) => !animatedEdgeIds.includes(id));
  const deleteAnimatedEdgeIds = animatedEdgeIds.filter((id) => !edgeIds.includes(id));
  animatedEdgeIds = [...edgeIds];

  setEdgeAnimated({ addList: addAnimatedEdgeIds, deleteList: deleteAnimatedEdgeIds });
};

const setEdgeAnimated = ({ addList, deleteList }: { addList: string[]; deleteList: string[] }) => {
  addList.forEach((id: string) => {
    const edge = findEdge(id);
    if (edge) edge.animated = true;
  });

  deleteList.forEach((id: string) => {
    const edge = findEdge(id);
    if (edge) edge.animated = false;
  });
};

// TODO: 함수로 사용가능하게 가능할까..
defineExpose({
  changeNode,
  changeEdge,
  onDragStart,
  changeEdgeAnimated
});

onMounted(() => {
  // NOTE: 'Delete' 키를 누를 때 onDelete 함수가 실행되도록 설정
  window.addEventListener("keydown", (event) => {
    if (event.key === "Delete") {
      onDelete();
    }
  });

  // NOTE: 'Control' 키 입력시, contextmenu 차단
  document.addEventListener("contextmenu", (event) => {
    if (event.ctrlKey) {
      event.preventDefault(); // 컨텍스트 메뉴 차단

      const target = event.target as HTMLElement;
      const nodeEl = target.closest(".vue-flow__node");
      if (nodeEl) {
        const nodeId = nodeEl.getAttribute("data-id");
        const node = findNode(nodeId);
        if (node) node.selected = !node.selected;
      }
      const edgeEl = target.closest(".vue-flow__edge");
      if (edgeEl) {
        const edgeId = edgeEl.getAttribute("data-id") as string;
        const edge = findEdge(edgeId);
        if (edge) edge.selected = !edge.selected;
      }
    }
  });

  initHistoryStack({ nodes: props.nodes, edges: props.edges });
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

.vue-flow__nodesselection-rect {
  border: none;
  width: 0 !important;
}
</style>
