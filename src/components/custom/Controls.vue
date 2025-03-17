<template>
  <Controls
    v-if="props.useControl"
    :position="props.controlPosition"
    :show-zoom="props.showZoom"
    :show-fit-view="props.showFitView"
    :show-interactive="props.showInteractive"
    :show-undo="props.showUndo"
    :show-redo="props.showRedo"
    :show-screen-shot="props.showScreenShot"
    :show-theme="props.showTheme"
    :show-save="props.showSave"
  >
    <ControlButton v-if="props.showUndo" @click="undoBtnClick">
      <SvgICon name="arrow-rotate-left"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.showRedo" @click="redoBtnClick">
      <SvgICon name="arrow-rotate-right"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.showScreenShot" @click="screenShotBtnClick">
      <SvgICon name="camera"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.showSave" @click="saveBtnClick">
      <SvgICon name="floppy-disk"></SvgICon>
    </ControlButton>
    <ControlButton v-if="props.showTheme" @click="themeBtnClick">
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
  showZoom: {
    type: Boolean,
    default: true
  },
  showFitView: {
    type: Boolean,
    default: true
  },
  showInteractive: {
    type: Boolean,
    default: true
  },
  showUndo: {
    type: Boolean,
    default: true
  },
  showRedo: {
    type: Boolean,
    default: true
  },
  showScreenShot: {
    type: Boolean,
    default: true
  },
  showTheme: {
    type: Boolean,
    default: true
  },
  showSave: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: "undo", item: object): void;
  (e: "redo", item: object): void;
  (e: "screenShot"): void;
  (e: "save", item: object): void;
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
  emit("switchTheme", { nodes: [], edges: [] });
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
