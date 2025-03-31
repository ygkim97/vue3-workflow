<script setup lang="ts">
import { onMounted, ref, nextTick, defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'dragStart', item: { event: any; data?: object }): void
}>()

const contentRefs = ref<any[]>([])
const contentHeights = ref<{ [key: string]: number }>({})
const defaultItem = [
  { name: 'Input Node', type: 'input' },
  { name: 'Default Node', type: 'default' },
  { name: 'Oupput Node', type: 'output' },
]
const accordionItems = ref<{ id: string; label: string; item: object[] }[]>([
  { id: 'node001', label: 'Node API TEST', item: [] },
  { id: 'node002', label: 'Node TEST 001', item: defaultItem },
  { id: 'node003', label: 'Node TEST 002', item: defaultItem },
])
const accordionState = ref<{ [key: string]: boolean }>({})

const initializeAccordionState = () => {
  accordionItems.value.forEach(({ id }) => {
    accordionState.value[id] = false
  })
}

const updateContentHeight = () => {
  nextTick(() => {
    contentRefs.value.forEach((content) => {
      if (content) {
        contentHeights.value[content.id] = content.scrollHeight
      }
    })
  })
}

const toggleAccordion = (id: string) => {
  accordionState.value[id] = !accordionState.value[id]
}

const onDragStart = ({
  event,
  data,
}: {
  event: Event
  data: { id: string; name: string; inputs: object[] }
}) => {
  // TODO: inputs default 값 설정
  const { id, name, inputs } = data
  emit('dragStart', { event, data: { function_id: id, label: name } })
}

onMounted(async () => {
  const res = await fetch('http://192.168.107.19:5052/api/v1/udf')

  if (res.ok) {
    const resData: { success: boolean; data: object[] } = await res.json()
    if (resData.success) {
      accordionItems.value[0].item = resData.data

      await nextTick()
      updateContentHeight()
    }
  }

  initializeAccordionState()
})
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
            maxHeight: accordionState[item.id] ? `${contentHeights[item.id]}px` : '0px',
          }"
          ref="contentRefs"
        >
          <div class="vue-flow__accordion-body">
            <div class="vue-flow__drag-group">
              <template v-for="nodeItem in item.item">
                <div :draggable="true" @dragstart="onDragStart({ event: $event, data: nodeItem })">
                  {{ nodeItem.name }}
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
