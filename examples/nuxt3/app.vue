<template>
  <div class="nuxt-work-flow">
    <header>Nuxt - Work Flow Test</header>
    <div class="work-flow">
      <Sidebar @dragStart="onDragStart"></Sidebar>
      <client-only>
        <VueFlowCore
          ref="vueFlowCoreRef"
          id="nuxtVueFlow"
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
          :control-show-undo="true"
          :control-show-redo="true"
          :control-show-screen-shot="true"
          :control-show-theme="true"
          :control-show-save="true"
          :control-show-execution="true"
          node-label-key="label"
          node-type-key="type"
          :default-node-style="defaultNodeStyle"
          :select-node-style="selectNodeStyle"
          :default-node-class="defaultNodeClass"
          :select-node-class="selectNodeClass"
          :default-handle-style="defaultHandleStyle"
          :default-handle-class="defaultHandleClass"
          :use-node-toolbar="true"
          node-toolbar-position="bottom"
          :node-toolbar-offset="10"
          :node-toolbar-show-add="true"
          :node-toolbar-show-delete="true"
          :node-toolbar-show-edit="true"
          :node-toolbar-show-copy="true"
          :node-toolbar-show-execution="true"
          edge-type="smoothStep"
          :default-edge-style="defaultEdgeStyle"
          :default-edge-class="defaultEdgeClass"
          :select-edge-style="selectEdgeStyle"
          :select-edge-class="selectEdgeClass"
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
import type { DagData, Node, Edge } from "../types/vueFlowCore";

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
  onDragStart(data: { event: any; data?: object }): void;
  controlButton: any;
} | null>(null);
const updateNode = (data: Node) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeNode(data);
  }
};

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const isDragOver = ref(false);

const defaultNodeStyle = {
  /*backgroundColor: "white",
  width: "100px",
  height: "10px",
  color: "navy",
  fontSize: "10px",
  fontWeight: "bold",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "1px",
  borderRadius: "30px",
  opacity: 0.5*/
};

const defaultNodeClass = "default-node-class";

const selectNodeStyle = {
  /*backgroundColor: "navy",
  color: "white"*/
};

const selectNodeClass = "select-node-class";

const defaultHandleStyle = {
  /*backgroundColor: "white",
  width: "5px",
  height: "5px",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "2px",
  borderRadius: "100%"*/
};

const defaultHandleClass = "default-handle-class";

const defaultEdgeStyle = {
  /*stroke: "gray",
  strokeWidth: "1px"*/
};

const defaultEdgeClass = "default-edge-class";

const selectEdgeStyle = {
  /*stroke: "navy",
  strokeWidth: "1px"*/
};

const selectEdgeClass = "select-edge-class";

const markerType = {
  markerEnd: "arrowclosed"
};

const isShowModal = ref(false);
const editData = ref({});

const controlsEvent = async (eventName: string, event?: any) => {
  console.log(eventName, event);

  if (eventName === "save") {
    const { id, name, description } = dagData.value;
    await $fetch(`http://192.168.107.19:5052/api/v1/dag/${id}`, {
      method: "PATCH",
      body: { name, description, nodes: event.nodes, edges: event.edges }
    });
  }
};

const nodeToolbarEvent = (eventName: string, event?: any) => {
  console.log(eventName, event);

  if (eventName === "editNode") {
    isShowModal.value = true;
    editData.value = event.params;
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

const onNodeClick = (node: object) => {
  console.log("nodeClick", node);
};

const onEdgeClick = (edge: object) => {
  console.log("edgeClick", edge);
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

.default-node-class {
  background-color: white;
  width: 100px;
  height: 10px;
  color: darkgreen;
  font-size: 10px;
  font-weight: bold;
  border-style: solid;
  border-color: darkgreen;
  border-width: 1px;
  border-radius: 30px;
  opacity: 0.8;
}

.select-node-class {
  background-color: darkgreen;
  color: white;
}

/* NOTE: handle class 사용시 background-color 의 경우, !important 해주어야 style 적용가능 */
.default-handle-class {
  background-color: white !important;
  width: 5px;
  height: 5px;
  border-style: solid;
  border-color: darkgreen;
  border-width: 2px;
  border-radius: 100%;
}

.default-edge-class {
  stroke: yellowgreen;
  stroke-width: 2px;
}

/* NOTE: select edge class 사용시 stroke 의 경우, !important 해주어야 style 적용 가능 */
.select-edge-class {
  stroke: forestgreen !important;
  stroke-width: 2.5px;
}
</style>
