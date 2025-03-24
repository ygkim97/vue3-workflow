<script setup lang="ts">
import { defineEmits, onMounted, ref } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: false
  }
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updateNode", item: object): void;
}>();

const nodeLabel = ref<string>("");
const nodeDesc = ref<string>("");

const close = () => {
  emit("close");
};

const change = () => {
  if (props.data && confirm("변경된 내용이 저장됩니다. 계속하시겠습니까?")) {
    const { id, type, position, data } = props.data;
    const changeData = { ...data, label: nodeLabel.value, description: nodeDesc.value };
    emit("updateNode", { id, type, position, data: changeData });
    close();
  }
};

onMounted(() => {
  if (props.data) {
    const { label, description } = props.data.data;
    nodeLabel.value = label;
    nodeDesc.value = description || "";
  }
});
</script>
<template>
  <div class="modal-overlay" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="modal-backdrop" aria-hidden="true"></div>

    <div class="modal-container">
      <div class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-body">
            <div class="modal-header">
              <h3 id="modal-title">Update Node Details</h3>
              <button class="close-btn" @click="close">X</button>
            </div>
            <div class="input-group">
              <label for="label">Label</label>
              <input type="text" id="label" placeholder="label" v-model="nodeLabel" />
            </div>
            <!-- TODO: 데이터 inputs 에 맞게 form 유형 변경 -->
            <div class="input-group">
              <label for="description">Description</label>
              <textarea id="description" placeholder="description" v-model="nodeDesc"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="confirm-btn" @click="change">Change</button>
            <button class="cancel-btn" @click="close">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: relative;
  z-index: 10;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(107, 114, 128, 0.75);
  transition: opacity 0.3s ease;
}

.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  overflow-y: auto;
}

.modal-wrapper {
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.modal-content {
  position: relative;
  padding: 20px;
  transform: scale(1);
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: white;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  all: unset;
  cursor: pointer;
}

.input-group {
  margin-top: 1.5rem;
  display: grid;
  gap: 0.5rem;
}

.input-group label {
  text-align: start;
  font-weight: 700;
  color: #4b5563;
}

.input-group input,
.input-group textarea {
  display: block;
  min-width: 0;
  flex-grow: 1;
  padding: 10px;
  font-size: 1rem;
  color: #111827;
  border: 1px solid #d1d5db;
  resize: none;
}

.input-group textarea {
  height: 7rem;
}

.modal-footer {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr; /* 3등분, 가운데 3배 넓이 */
  gap: 10px;
  padding-top: 20px;
}

.confirm-btn,
.cancel-btn {
  width: 100%;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 10px;
  grid-column: 2;
}

.confirm-btn:hover {
  background-color: #3b82f6;
}

.cancel-btn {
  background-color: white;
  color: #111827;
  border: 1px solid #d1d5db;
  grid-column: 3;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}
</style>
