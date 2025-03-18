<template>
  <Controls
    v-if="props.useControl"
    :position="props.controlPosition"
    :show-zoom="props.controlShowZoom"
    :show-fit-view="props.controlShowFitView"
    :show-interactive="props.controlShowInteractive"
  >
    <ControlButton v-if="props.controlShowUndo" @click="undoBtnClick">
      <SvgICon name="arrow-rotate-left"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.controlShowRedo" @click="redoBtnClick">
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
import { ControlButton, Controls } from "@vue-flow/controls";
import type { PropType } from "vue";
import type { PanelPositionType } from "@vue-flow/core";
import SvgICon from "../common/svgICon.vue";

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
  (e: "undo", item: object): void;
  (e: "redo", item: object): void;
  (e: "screenShot"): void;
  (e: "save", item: object): void;
  (e: "execution", item: object): void;
  (e: "switchTheme", item: object): void;
}>();

const theme = ref("light");

// TODO: Undo 동작 수행 기능 구현
const undoBtnClick = () => {
  emit("undo", {});
};

// TODO: Redo 동작 수행 기능 구현
const redoBtnClick = () => {
  emit("redo", {});
};

// TODO: ScreenShot 기능 구현
const screenShotBtnClick = () => {
  emit("screenShot");
};

// TODO: Nodes, Edges Data 전달 기능 구현
const saveBtnClick = () => {
  emit("save", { nodes: [], edges: [] });
};

// TODO: Node 전체 실행
const executionBtnClick = () => {
  emit("execution", { graph: [] });
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
