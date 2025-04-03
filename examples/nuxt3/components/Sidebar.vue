<script setup lang="ts">
import { onMounted, ref, nextTick, defineEmits } from "vue";
import type { NodeTemplateObj, NodeTemplate } from "~/types/vueFlowCore";

const emit = defineEmits<{
  (e: "dragStart", item: { event: any; data?: object }): void;
}>();

const contentRefs = ref<any[]>([]);
const contentHeights = ref<{ [key: string]: number }>({});

const nodeTemplateObj = ref<NodeTemplateObj | null>(null);
const accordionState = ref<{ [key: string]: boolean }>({});

const updateContentHeight = () => {
  nextTick(() => {
    contentRefs.value.forEach((content) => {
      if (content) {
        contentHeights.value[content.id] = content.scrollHeight;
      }
    });
  });
};

const initializeAccordionState = () => {
  for (const key in nodeTemplateObj) {
    accordionState.value[key] = false;
  }
};

const toggleAccordion = (category: string) => {
  accordionState.value[category] = !accordionState.value[category];
};

const onDragStart = ({ event, data }: { event: Event; data: NodeTemplate }) => {
  const { id, type, label } = data;
  emit("dragStart", { event, data: { template_node_id: id, type, label } });
};

onMounted(async () => {
  const res = await fetch("/data/nodeTemplate.json");
  if (res.ok) {
    nodeTemplateObj.value = await res.json();

    await nextTick(() => {
      updateContentHeight();
    });
  }

  initializeAccordionState();
});
</script>

<template>
  <aside class="vue-flow__sidebar">
    <div class="vue-flow__sidebar-title">NUXT WORKFLOW</div>

    <div class="vue-flow__sidebar-contents">
      <div
        v-for="(nodeTemplateList, category) in nodeTemplateObj"
        :key="`category_${category}`"
        class="vue-flow__accordion"
      >
        <button @click="toggleAccordion(category as string)" class="vue-flow__accordion-header">
          <span class="vue-flow__accordion-text">{{ category }}</span>
          <span class="vue-flow__accordion-icon">
            <img v-if="accordionState[category]" src="../assets/icon/chevron-up.svg" alt="" />
            <img v-else src="../assets/icon/chevron-down.svg" alt="" />
          </span>
        </button>
        <div
          ref="contentRefs"
          :id="category as string"
          class="vue-flow__accordion-content"
          :style="{
            maxHeight: accordionState[category] ? `${contentHeights[category]}px` : '0px'
          }"
        >
          <div class="vue-flow__accordion-body">
            <div class="vue-flow__drag-group">
              <template v-for="nodeTemplate in nodeTemplateList">
                <div
                  class="node-template"
                  :draggable="true"
                  @dragstart="onDragStart({ event: $event, data: nodeTemplate })"
                >
                  {{ nodeTemplate.label }}
                </div>
              </template>
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

.vue-flow__drag-group > .node-template {
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
