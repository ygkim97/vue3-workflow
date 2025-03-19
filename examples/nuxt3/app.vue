<template>
  <div class="work-flow">
    <header>Nuxt - Work Flow Test</header>
    <VueFlowCore
      id="nuxtVueFlow"
      :nodes="nodes"
      :edges="edges"
      bg-color="#edf2f7"
      :showBgPattern="true"
      :bg-pattern-gap="20"
      :bg-pattern-size="2"
      bg-pattern-color="gray"
      :min-zoom="0"
      :max-zoom="20"
      :snap-grid="[200, 200]"
      :use-mini-map="true"
      mini-map-position="top-left"
      mini-map-node-color="darkgray"
      mini-map-node-stroke-color="navy"
      mini-map-node-class-name="map-class"
      :mini-map-node-border-radius="15"
      :mini-map-node-stroke-width="5"
      mini-map-mask-color="lightgray"
      :mini-map-pannable="true"
      :mini-map-zoomable="true"
      :use-control="true"
      control-position="top-center"
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
      @undo="controlsEvent('undo', $event)"
      @redo="controlsEvent('redo', $event)"
      @screenShot="controlsEvent('screenShot')"
      @save="controlsEvent('save', $event)"
      @switchTheme="controlsEvent('switchTheme', $event)"
      @execution="controlsEvent('execution', $event)"
      @toolbarItemClick="toolbarItemClick"
      @delete="onDelete"
    />
  </div>
</template>

<script lang="ts" setup>
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
    target: "test2",
    label: "Label",
    labelStyle: { fill: "navy" },
    labelBgStyle: { fill: "white" },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 4
  }
]);

const defaultNodeStyle = {
  backgroundColor: "white",
  width: "100px",
  height: "10px",
  color: "navy",
  fontSize: "10px",
  fontWeight: "bold",
  borderStyle: "solid",
  borderColor: "navy",
  borderWidth: "2px",
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
  borderWidth: "2px",
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
  strokeWidth: "2px"
};

const selectEdgeStyle = {
  stroke: "navy",
  strokeWidth: "3px"
};

const markerType = {
  markerStart: "arrow",
  markerEnd: "arrowclosed"
};

const controlsEvent = (eventName: string, event?: Event) => {
  console.log(eventName, event);
};

const toolbarItemClick = (event: { id: string }) => {
  console.log(event);
};

const onDelete = ({ nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] }) => {
  console.log("delete nodeIds: ", nodeIds);
  console.log("delete edgeIds: ", edgeIds);
};
</script>

<style>
html,
body,
#__nuxt {
  margin: 0;
  height: 100%;
}

.work-flow {
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
</style>
