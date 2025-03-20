<script setup lang="ts">
import { onMounted, ref } from "vue";

const contentRefs = ref<any[]>([]);
const contentHeights = ref<{ [key: string]: number }>({});
const accordionItems = ref<{ id: string; label: string }[]>([
  { id: "nodeDataControls", label: "Node & Data Controls (Button)" },
  { id: "nodeCollection", label: "Node Collection (Drag)" },
  { id: "scrollTest", label: "Contents Overflow Scroll Test" }
]);
const accordionState = ref<{ [key: string]: boolean }>({});

const initializeAccordionState = () => {
  accordionItems.value.forEach(({ id }) => {
    accordionState.value[id] = false;
  });
};

const updateContentHeight = () => {
  contentRefs.value.forEach((content) => {
    const id = content.id;
    contentHeights.value[id] = content.scrollHeight;
  });
};

const toggleAccordion = (id: string) => {
  accordionState.value[id] = !accordionState.value[id];
};

onMounted(() => {
  initializeAccordionState();
  updateContentHeight();
});
</script>

<template>
  <aside class="vue-flow__sidebar">
    <div class="vue-flow__sidebar-title">WORK FLOW</div>

    <div class="vue-flow__sidebar-contents">
      <div v-for="item in accordionItems" :key="`item_${item.id}`" class="vue-flow__accordion">
        <button @click="toggleAccordion(item.id)" class="vue-flow__accordion-header">
          <span class="vue-flow__accordion-text">{{ item.label }}</span>
          <span class="vue-flow__accordion-icon">
            <img v-if="accordionState[item.id]" src="../assets/icon/chevron-up.svg" alt="" />
            <img v-else src="../assets/icon/chevron-down.svg" alt="" />
          </span>
        </button>
        <div
          :id="item.id"
          class="vue-flow__accordion-content"
          :style="{
            maxHeight: accordionState[item.id] ? `${contentHeights[item.id]}px` : '0px'
          }"
          ref="contentRefs"
        >
          <div class="vue-flow__accordion-body">
            <div class="vue-flow__drag-group">
              <div
                :draggable="true"
                @dragstart="$emit('dragStart', { event: $event, data: { name: 'TEST01', type: 'input' } })"
              >
                Input Node
              </div>
              <div
                :draggable="true"
                @dragstart="$emit('dragStart', { event: $event, data: { name: 'TEST02', type: 'output' } })"
              >
                Default Node
              </div>
              <div
                :draggable="true"
                @dragstart="$emit('dragStart', { event: $event, data: { name: 'TEST03', type: 'output' } })"
              >
                Output Node
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
.vue-flow__sidebar {
  width: 100%;
  height: 100%;
  border-right: 2px solid #e5e7eb;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.vue-flow__sidebar-title {
  font-weight: bold;
  text-align: center;
  font-size: 1.25rem;
  padding: 1rem 0;
  border-bottom: 2px solid #e5e7eb;
}

.vue-flow__sidebar-contents {
  overflow-y: scroll;
  max-height: 100%;
}

/* Accordion */
.vue-flow__accordion {
  border-bottom: 1px solid #cbd5e1;
  padding: 0 1rem;
}

.vue-flow__accordion-header {
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  color: #1e293b;
}

.vue-flow__accordion-text {
  color: #4b5563;
  font-weight: bold;
}

.vue-flow__accordion-icon {
  color: #1e293b;
  transition: transform 0.3s;
  width: 1rem;
  height: 1rem;
}

.vue-flow__accordion-content {
  overflow: hidden;
  transition: all 1s ease-in-out;
}

.vue-flow__accordion-body {
  padding-bottom: 1.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

/* Button Group, Drag Group */
.vue-flow__drag-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 0.5rem;
}

.vue-flow__drag-group div {
  width: 10rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 2px solid #1e3a8a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e3a8a;
  cursor: grab !important;
  background-color: white;
}
</style>
