<template>
  <!-- TODO: sidebar 에서 dragAndDrop 으로 node 추가시 테스트 필요 -->
  <Background
    :style="{ backgroundColor: bgColor }"
    variant="dots"
    :gap="props.bgPatternGap"
    :size="showBgPattern ? props.bgPatternSize : 0"
    :pattern-color="props.bgPatternColor"
  ></Background>
</template>

<script lang="ts" setup>
import { Background } from "@vue-flow/background";

const props = defineProps({
  bgColor: {
    type: String,
    default: "#fff"
  },
  showBgPattern: {
    type: Boolean,
    default: true
  },
  bgPatternGap: {
    type: Number,
    default: 10
  },
  bgPatternSize: {
    type: Number,
    default: 0.4
  },
  bgPatternColor: {
    type: String,
    default: "#81818a"
  }
});
</script>

<style></style>
