<script setup lang="ts">
import { shallowRef, watch, defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

// shallowRef는 Reactivity System에서 객체 내부를 반응형으로 만들지 않음.
// 여기서는 동적으로 불러오는 컴포넌트를 저장하는 데 사용되어, 불필요한 반응형 처리로 인한 성능 문제를 방지함.
const iconComponent = shallowRef();

watch(
  () => props.name,
  (newName) => {
    iconComponent.value = defineAsyncComponent(() => import(`../../assets/icon/${newName}.svg`));
  },
  { immediate: true } // 초기 로드 시에도 실행
);
</script>

<template>
  <component :is="iconComponent" class="fill-current" />
</template>
