<template>
  <div class="work-flow">
    <Sidebar @dragStart="onDragStart"></Sidebar>
    <div class="test-box">
      <div class="test-box__header" @click="isOpen = !isOpen">
        📦 TEST BUTTON BOX
        <img v-if="isOpen" src="../assets/icon/chevron-up.svg" alt="" />
        <img v-else src="../assets/icon/chevron-down.svg" alt="" />
      </div>

      <div v-show="isOpen" class="test-box__list">
        <button class="test-box__button" @click="getNodesData">getNodes</button>
        <button class="test-box__button" @click="getEdgesData">getEdges</button>
        <button class="test-box__button" @click="getPathData">getPath</button>
        <label class="test-box__checkbox">
          <input type="checkbox" v-model="interactionDisabled" />
          <span class="">상호작용 비활성화</span>
        </label>
      </div>
    </div>
    <VueFlowCore
      ref="vueFlowCoreRef"
      :nodes="nodes"
      :edges="edges"
      :interaction-disabled="interactionDisabled"
      :bg-color="isDragOver ? 'rgba(93,140,188,0.42)' : '#edf2f7'"
      :showBgPattern="true"
      :bg-pattern-gap="10"
      :bg-pattern-size="1"
      bg-pattern-color="gray"
      :min-zoom="0"
      :max-zoom="20"
      :snap-grid="[200, 100]"
      :fit-view-on-init="true"
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
      @paneClick="onPaneClick"
    />
  </div>

  <NodeEditModal
    v-if="isShowModal && editNodeData"
    :data="editNodeData"
    @updateNode="updateNode"
    @close="isShowModal = false"
  ></NodeEditModal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import NodeEditModal from '../components/NodeEditModal.vue'
import type { Node, Edge } from '../types/vueFlowCore'

const vueFlowCoreRef = ref<{
  changeNode(data: Node, shouldPushHistory?: boolean): void
  changeEdge(data: Edge, shouldPushHistory?: boolean): void
  onDragStart(data: { event: any; data?: object }): void
  changeEdgeAnimated(edgeIds: string[]): void
  getNodes: Node[]
  getEdges: Edge[]
  getPath: Node[][]
  getPathByNodeId(nodeId: string): Node[][]
  getIncomers(nodeId: string): Node[]
  getOutgoers(nodeId: string): Node[]
} | null>(null)

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const isOpen = ref(false)
const isDragOver = ref<boolean>(false)
const isShowModal = ref<boolean>(false)
const editNodeData = ref<Node | null>(null)
const animatedEdgeIds = ref<string[]>([])
const interactionDisabled = ref<boolean>(false)

const onDragStart = (event: { event: any; data?: object }) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.onDragStart(event)
  }
}

const onDraggingOver = (dragOver: boolean) => {
  isDragOver.value = dragOver
}

const updateNode = (data: Node) => {
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeNode(data, true)
  }
}

const controlsEvent = async (eventName: string, param?: any) => {
  console.log(eventName, param)

  if (eventName === 'executeAll') {
    setAnimateEdge(param)
  }
}

const nodeToolbarEvent = (eventName: string, param?: any) => {
  console.log(eventName, param)

  if (eventName === 'editNode') {
    isShowModal.value = true
    editNodeData.value = param
  }
}

const onNodeClick = (node: Node) => {
  console.log('nodeClick', node)

  const ref = vueFlowCoreRef.value
  if (ref) {
    const nodeId = node.id
    console.log('getPathByNodeId', ref.getPathByNodeId(nodeId))
    console.log('getIncomers', ref.getIncomers(nodeId))
    console.log('getOutgoers', ref.getOutgoers(nodeId))
  }
}

const onEdgeClick = (edge: Edge) => {
  console.log('edgeClick', edge)

  updateEdge(edge)
}

const setAnimateEdge = ({ edges }: { edges: Edge[] }) => {
  // TEST: changeEdgeAnimated 함수 사용하여 edge animated update
  animatedEdgeIds.value = []
  edges.forEach((edge) => {
    animatedEdgeIds.value.push(edge.id)
  })

  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdgeAnimated(animatedEdgeIds.value)
  }

  console.log('animatedEdgeIds', animatedEdgeIds.value)
}

const updateEdge = (edge: Edge) => {
  // TEST: changeEdge 함수 사용하여 edge update
  if (vueFlowCoreRef.value) {
    vueFlowCoreRef.value.changeEdge({ ...edge, label: edge.label ? '' : 'Label' }, true)
  }
}

const onSelectFlow = (flow: { nodes: Node[]; edges: Edge[] }) => {
  console.log('selectNodes', flow.nodes)
  console.log('selectEdges', flow.edges)
}

const onDeleteFlow = ({ nodeIds, edgeIds }: { nodeIds: string[]; edgeIds: string[] }) => {
  console.log('delete nodeIds: ', nodeIds)
  console.log('delete edgeIds: ', edgeIds)
}

const getGraphData = async () => {
  const res = await fetch('/data/graph.json')
  if (res.ok) {
    const graphData: { nodes: Node[]; edges: Edge[] } = await res.json()
    nodes.value = graphData.nodes
    edges.value = graphData.edges
  }
}

/* TEST BOX FUNCTION */
const getNodesData = () => {
  const ref = vueFlowCoreRef.value
  if (ref) {
    console.log('getNodes', ref.getNodes)
  }
}
const getEdgesData = () => {
  const ref = vueFlowCoreRef.value
  if (ref) {
    console.log('getEdges', ref.getEdges)
  }
}

const getPathData = () => {
  const ref = vueFlowCoreRef.value
  if (ref) {
    console.log('getPath', ref.getPath)
  }
}

const onPaneClick = () => {
  console.log('onPaneClick')
}

onMounted(() => {
  getGraphData()
})
</script>

<style>
.work-flow {
  display: grid;
  grid-template-columns: 400px auto;
  overflow: hidden;
}

.test-box {
  position: absolute;
  top: 20px;
  left: 420px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  z-index: 1000;
  width: max-content;
}

.test-box__header {
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.test-box__header > img {
  width: 12px;
}

.test-box__list {
  display: grid;
  row-gap: 10px;
  margin-top: 12px;
}

.test-box__button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  font-size: 13px;
}

.test-box__button:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.test-box__checkbox {
  font-size: 13px;
  display: flex;
  grid-gap: 2px;
  align-items: center;
}
</style>
