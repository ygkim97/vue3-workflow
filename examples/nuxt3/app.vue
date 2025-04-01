<template>
  <div class="nuxt-work-flow">
    <header>Nuxt - Work Flow Test</header>
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
          :marker-type="markerType"
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

    <Modal v-if="isShowModal" :data="editData" @updateNode="updateNode" @close="isShowModal = false"></Modal>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "./components/Sidebar.vue";
import Modal from "./components/Modal.vue";
import { ref, onMounted } from "vue";
import type { DagData, Node, Edge } from "./types/vueFlowCore";

onMounted(() => {
  getNodes();
});

const dagData = ref<Partial<DagData>>({});
const getNodes = async () => {
  const res = await $fetch<{ success: boolean; data: DagData }>("http://192.168.107.19:5052/api/v1/dag/dag_dGVzdDAwMQ");
  if (res.success) {
    dagData.value = res.data;
    nodes.value = dagData.value.nodes ?? [];
    edges.value = dagData.value.edges ?? [];
  }
};

const vueFlowCoreRef = ref<{
  changeNode(data: Node): void;
  changeEdge(data: Edge): void;
  onDragStart(data: { event: any; data?: object }): void;
  changeEdgeAnimated(data: string[]): void;
} | null>(null);

const updateNode = (data: Node) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeNode(data);
  }
};

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const isDragOver = ref(false);

const markerType = {
  markerEnd: "arrowclosed"
};

const isShowModal = ref(false);
const editData = ref({});

const controlsEvent = async (eventName: string, event?: any) => {
  console.log(eventName, event);

  if (eventName === "save") {
    const { id, name, description } = dagData.value;
    const res = await $fetch<{ success: boolean }>(`http://192.168.107.19:5052/api/v1/dag/${id}`, {
      method: "PATCH",
      body: { name, description, nodes: event.nodes, edges: event.edges }
    });
    if (res.success) {
      alert("저장되었습니다.");
    }
  }
};

const nodeToolbarEvent = (eventName: string, event?: any) => {
  console.log(eventName, event);

  if (eventName === "editNode") {
    isShowModal.value = true;
    editData.value = event;
  }
};

const onDeleteFlow = ({ nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] }) => {
  console.log("delete nodeIds: ", nodeIds);
  console.log("delete edgeIds: ", edgeIds);
};

// NOTE: Sidebar DragAndDrop
const onDragStart = (event: { event: any; data?: object }) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.onDragStart(event);
  }
};
const onDraggingOver = (dragOver: boolean) => {
  isDragOver.value = dragOver;
};

const animatedEdgeIds = ref(["a2be69bc-5bb9-42d4-8e6d-f2ff74ff02b3"]);
const onNodeClick = (node: object) => {
  console.log("nodeClick", node);
};

const onEdgeClick = (edge: Edge) => {
  console.log("edgeClick", edge);

  if (animatedEdgeIds.value.includes(edge.id)) {
    animatedEdgeIds.value = animatedEdgeIds.value.filter((id) => id !== edge.id);
  } else {
    animatedEdgeIds.value.push(edge.id);
  }
  console.log(animatedEdgeIds.value);

  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdgeAnimated(animatedEdgeIds.value);
  }

  // TEST: changeEdge
  /*const edgeData = { ...edge, animated: true, label: "test" } as Edge;
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdge(edgeData);
  }*/
};

const onSelectFlow = (flow: { nodes: Node[]; edges: Edge[] }) => {
  console.log("selectNodes", flow.nodes);
  console.log("selectEdges", flow.edges);
};
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
  grid-template-rows: 50px auto;
}

header {
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  padding: 20px;
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
