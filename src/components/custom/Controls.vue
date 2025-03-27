<template>
  <Controls
    v-if="props.useControl"
    :position="props.controlPosition"
    :show-zoom="props.controlShowZoom"
    :show-fit-view="props.controlShowFitView"
    :show-interactive="props.controlShowInteractive"
  >
    <ControlButton v-if="props.controlShowUndo" :disabled="isUndoDisabled" @click="undoBtnClick">
      <SvgICon name="arrow-rotate-left"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowRedo" :disabled="isRedoDisabled" @click="redoBtnClick">
      <SvgICon name="arrow-rotate-right"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowScreenShot" @click="screenShotBtnClick">
      <SvgICon name="camera"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowSave" @click="saveBtnClick">
      <SvgICon name="floppy-disk"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowExecution" @click="executionBtnClick">
      <SvgICon name="play"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowTheme" @click="themeBtnClick">
      <SvgICon :name="theme === 'light' ? 'moon' : 'sun'"></SvgICon>
    </ControlButton>
  </Controls>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import { ControlButton, Controls } from "@vue-flow/controls";
import type { PropType } from "vue";
import type { PanelPositionType } from "@vue-flow/core";
import type { CustomNode, CustomEdge } from "../../types/vueFlowCore.ts";
import SvgICon from "../common/svgICon.vue";
import useFlowCommon from "../../composables/useFlowCommon.ts";
import useScreenshot from "../../composables/useScreenshot.ts";

const { getNodes, getEdges, vueFlowRef, getSelectedElements } = useVueFlow();
const { executeUndo, executeRedo, isUndoDisabled, isRedoDisabled, transformNodeData, transformEdgeData } =
  useFlowCommon();
const { capture } = useScreenshot();

const props = defineProps({
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
  controlShowUndo: {
    type: Boolean,
    default: true
  },
  controlShowRedo: {
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
  }
});

const emit = defineEmits<{
  (e: "save", item: { nodes: CustomNode[]; edges: CustomEdge[] }): void;
  (e: "executeAll", item: { nodes: CustomNode[]; edges: CustomEdge[] }): void;
  (e: "switchTheme", item: { theme: string }): void;
}>();

const theme = ref("light");

const undoBtnClick = () => {
  executeUndo();
};

const redoBtnClick = () => {
  executeRedo();
};

// TODO: ScreenShot 기능 구현 - 기능 오류
const screenShotBtnClick = () => {
  // NOTE: 선택된 Node, Edge 선택 해제
  getSelectedElements.value.forEach((el) => {
    el.selected = false;
  });

  capture(vueFlowRef.value as HTMLElement, { shouldDownload: true, isNodeDataOnly: true });
};

const saveBtnClick = () => {
  const params = {
    nodes: transformNodeData(getNodes.value) as CustomNode[],
    edges: transformEdgeData(getEdges.value) as CustomEdge[]
  };
  emit("save", params);
};

const executionBtnClick = () => {
  // TODO: nodePath 데이터 전달
  const params = {
    nodes: transformNodeData(getNodes.value) as CustomNode[],
    edges: transformEdgeData(getEdges.value) as CustomEdge[]
  };
  emit("executeAll", params);
};

const themeBtnClick = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  emit("switchTheme", { theme: theme.value });
};
</script>

<style>
@import "@vue-flow/controls/dist/style.css";

.vue-flow__controls {
  display: flex;
}
</style>
