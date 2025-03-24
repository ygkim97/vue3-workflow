<template>
  <div class="nuxt-work-flow">
    <header>Nuxt - Work Flow Test</header>
    <div class="work-flow" v-if="isMounted">
      <Sidebar @drag-start="onDragStart"></Sidebar>
      <VueFlowCore
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
        node-label-key="name"
        node-type-key="nodeType"
        :default-node-style="defaultNodeStyle"
        :select-node-style="selectNodeStyle"
        :default-handle-style="defaultHandleStyle"
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
        :select-edge-style="selectEdgeStyle"
        :marker-type="markerType"
        :dragStartEvent="dragStartEvent"
        @undo="controlsEvent('undo', $event)"
        @redo="controlsEvent('redo', $event)"
        @screenShot="controlsEvent('screenShot')"
        @save="controlsEvent('save', $event)"
        @switchTheme="controlsEvent('switchTheme', $event)"
        @execution="controlsEvent('execution', $event)"
        @toolbarItemClick="toolbarItemClick"
        @delete="onDelete"
        @draggingOver="onDraggingOver"
      />
    </div>

    <Modal v-if="isShowModal" :data="editData" @close="isShowModal = false"></Modal>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "./components/Sidebar.vue";
import Modal from "./components/Modal.vue";
import { ref } from "vue";

const nodes = ref([
  {
    id: "test1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: { name: "Start", nodeType: "input" }
  },
  {
    id: "test2",
    type: "custom",
    position: { x: 400, y: 100 },
    data: { name: "Process" }
  }
]);
const edges = ref([
  {
    id: "e1-2",
    type: "custom",
    source: "test1",
    target: "test2"
  }
]);

const dragStartEvent = ref({});
const isDragOver = ref(false);

watch(
  nodes.value,
  (value) => {
    console.log(value);
  },
  { deep: true }
);

const defaultNodeStyle = {
  backgroundColor: "white",
  width: "100px",
  height: "10px",
  color: "navy",
  fontSize: "10px",
  fontWeight: "bold",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "1px",
  borderRadius: "30px"
};

const selectNodeStyle = {
  backgroundColor: "navy",
  width: "100px",
  height: "10px",
  color: "white",
  fontSize: "10px",
  fontWeight: "bold",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "1px",
  borderRadius: "30px"
};

const defaultHandleStyle = {
  backgroundColor: "white",
  width: "5px",
  height: "5px",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "2px",
  borderRadius: "100%"
};

const defaultEdgeStyle = {
  stroke: "gray",
  strokeWidth: "1px"
};

const selectEdgeStyle = {
  stroke: "navy",
  strokeWidth: "1px"
};

const markerType = {
  markerEnd: "arrowclosed"
};

const isShowModal = ref(false);
const editData = ref({});

const controlsEvent = (eventName: string, event?: Event) => {
  if (event) {
    console.log(eventName, event);
  } else {
    console.log(eventName);
  }
};

const toolbarItemClick = (event: { id: string; params: any }) => {
  console.log(event);
  if (event.id === "edit") {
    isShowModal.value = true;
    editData.value = event.params;
  }
};

const onDelete = ({ nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] }) => {
  console.log("delete nodeIds: ", nodeIds);
  console.log("delete edgeIds: ", edgeIds);
};

// NOTE: Sidebar DragAndDrop
const onDragStart = (event: { event: any; data?: object }) => {
  dragStartEvent.value = event;
};
const onDraggingOver = (dragOver: boolean) => {
  isDragOver.value = dragOver;
};

// ISSUE: Vue의 Hydration Mismatch 문제로 warm console. SSR 관련? 확인필요
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
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
</style>
