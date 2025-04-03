<template>
  <div class="nuxt-work-flow">
    <div class="work-flow">
      <Sidebar @dragStart="onDragStart"></Sidebar>
      <client-only>
        <VueFlowCore
          ref="vueFlowCoreRef"
          :nodes="nodes"
          :edges="edges"
          :bg-color="isDragOver ? 'rgba(93,140,188,0.42)' : '#edf2f7'"
          :showBgPattern="true"
          :bg-pattern-gap="10"
          :bg-pattern-size="1"
          bg-pattern-color="gray"
          :min-zoom="0"
          :max-zoom="20"
          :snap-grid="[200, 100]"
          :use-mini-map="true"
          mini-map-position="bottom-right"
          mini-map-node-color="darkgray"
          mini-map-node-stroke-color="lightgray"
          mini-map-node-class-name="map-class"
          :mini-map-node-border-radius="15"
          :mini-map-node-stroke-width="5"
          mini-map-mask-color="lightgray"
          :mini-map-pannable="true"
          :mini-map-zoomable="true"
          :use-control="true"
          control-position="top-right"
          :control-show-zoom="true"
          :control-show-fit-view="true"
          :control-show-interactive="true"
          :control-show-undo-redo="true"
          :control-show-screen-shot="true"
          :control-show-theme="true"
          :control-show-save="true"
          :control-show-execution="true"
          node-label-key="label"
          node-type-key="type"
          :use-node-toolbar="true"
          node-toolbar-position="bottom"
          :node-toolbar-offset="10"
          :node-toolbar-show-add="true"
          :node-toolbar-show-delete="true"
          :node-toolbar-show-edit="true"
          :node-toolbar-show-copy="true"
          :node-toolbar-show-execution="true"
          edge-type="smoothStep"
          :marker-type="{ markerEnd: 'arrowclosed' }"
          @save="controlsEvent('save', $event)"
          @switchTheme="controlsEvent('switchTheme', $event)"
          @executeAll="controlsEvent('executeAll', $event)"
          @addNode="nodeToolbarEvent('addNode', $event)"
          @deleteNode="nodeToolbarEvent('deleteNode', $event)"
          @editNode="nodeToolbarEvent('editNode', $event)"
          @copyNode="nodeToolbarEvent('copyNode', $event)"
          @execute="nodeToolbarEvent('execute', $event)"
          @deleteFlow="onDeleteFlow"
          @draggingOver="onDraggingOver"
          @nodeClick="onNodeClick"
          @edgeClick="onEdgeClick"
          @selectFlow="onSelectFlow"
        />
      </client-only>
    </div>

    <NodeEditModal
      v-if="isShowModal && editNodeData"
      :data="editNodeData"
      @updateNode="updateNode"
      @close="isShowModal = false"
    ></NodeEditModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Sidebar from "./components/Sidebar.vue";
import NodeEditModal from "./components/NodeEditModal.vue";
import type { Node, Edge } from "./types/vueFlowCore";

const vueFlowCoreRef = ref<{
  changeNode(data: Node): void;
  changeEdge(data: Edge): void;
  onDragStart(data: { event: any; data?: object }): void;
  changeEdgeAnimated(data: string[]): void;
} | null>(null);

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const isDragOver = ref<boolean>(false);
const isShowModal = ref<boolean>(false);
const editNodeData = ref<Node | null>(null);
const animatedEdgeIds = ref<string[]>([]);

const onDragStart = (event: { event: any; data?: object }) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.onDragStart(event);
  }
};

const onDraggingOver = (dragOver: boolean) => {
  isDragOver.value = dragOver;
};

const updateNode = (data: Node) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeNode(data);
  }
};

const controlsEvent = async (eventName: string, param?: any) => {
  console.log(eventName, param);

  if (eventName === "executeAll") {
    setAnimateEdge(param);
  }
};

const nodeToolbarEvent = (eventName: string, param?: any) => {
  console.log(eventName, param);

  if (eventName === "editNode") {
    isShowModal.value = true;
    editNodeData.value = param;
  }
};

const onNodeClick = (node: object) => {
  console.log("nodeClick", node);
};

const onEdgeClick = (edge: Edge) => {
  console.log("edgeClick", edge);

  updateEdge(edge);
};

const setAnimateEdge = ({ edges }: { edges: Edge[] }) => {
  // TEST: changeEdgeAnimated 함수 사용하여 edge animated update
  animatedEdgeIds.value = [];
  edges.forEach((edge) => {
    animatedEdgeIds.value.push(edge.id);
  });

  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdgeAnimated(animatedEdgeIds.value);
  }

  console.log("animatedEdgeIds", animatedEdgeIds.value);
};

const updateEdge = (edge: Edge) => {
  // TEST: changeEdge 함수 사용하여 edge update
  const edgeData = { ...edge, animated: false } as Edge;
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdge(edgeData);
  }

  console.log("changeEdge", edgeData);
};

const onSelectFlow = (flow: { nodes: Node[]; edges: Edge[] }) => {
  console.log("selectNodes", flow.nodes);
  console.log("selectEdges", flow.edges);
};

const onDeleteFlow = ({ nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] }) => {
  console.log("delete nodeIds: ", nodeIds);
  console.log("delete edgeIds: ", edgeIds);
};

const getGraphData = async () => {
  const res = await fetch("/data/graph.json");
  if (res.ok) {
    const graphData: { nodes: Node[]; edges: Edge[] } = await res.json();
    nodes.value = graphData.nodes;
    edges.value = graphData.edges;
  }
};

onMounted(() => {
  getGraphData();
});
</script>

<style>
html,
body,
#__nuxt {
  margin: 0;
  height: 100%;
}

.nuxt-work-flow {
  display: grid;
  height: 100%;
}

.work-flow {
  display: grid;
  grid-template-columns: 400px auto;
  overflow: hidden;
}

/* NOTE: vueFlow Class Names 사용해서 css 적용 */
.vue-flow__node {
  background-color: white;
  text-align: center;
  color: navy;
  font-size: 10px;
  font-weight: bold;
  border-style: solid;
  border-color: navy;
  border-width: 1px;
  border-radius: 30px;
  opacity: 0.8;
}

.vue-flow__node.selected {
  background-color: navy;
  color: white;
}

.vue-flow__handle {
  background-color: white;
  width: 5px;
  height: 5px;
  border-style: solid;
  border-color: navy;
  border-width: 1.5px;
  border-radius: 100%;
}

.vue-flow__edge-path {
  stroke: dimgray;
  stroke-width: 1.5px;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: navy;
  stroke-width: 1.5px;
}
</style>
