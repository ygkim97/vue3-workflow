import { ref, watch } from "vue";
import { useVueFlow } from "@vue-flow/core";
import useFlowCommon from "./useFlowCommon.ts";
import { v4 as uuidv4 } from "uuid";

const Type = "node";
const state = {
  draggedType: ref<string | null>(null),
  draggedData: ref<object>({}),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false)
};

export default function useDragAndDrop() {
  const { draggedType, draggedData, isDragOver, isDragging } = state;
  const { snapGrid, getNodeByPosition } = useFlowCommon();
  const { screenToFlowCoordinate, addNodes } = useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
  });

  const onDragStart = ({ event, data }: { event: any; data?: object }) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/vueflow", Type);
      event.dataTransfer.effectAllowed = "move";
    }

    draggedType.value = Type;
    draggedData.value = data || {};
    isDragging.value = true;

    document.addEventListener("drop", onDragEnd);
  };

  const onDragEnd = () => {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener("drop", onDragEnd);
  };

  const onDragOver = (event: any) => {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  };

  const onDragLeave = () => {
    isDragOver.value = false;
  };

  const onDrop = (event: any) => {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY
    });

    const alignedPosition = ["x", "y"].reduce(
      (acc, coordinate, currentIndex) => {
        const gridSize = snapGrid.value[currentIndex];
        const value = position[coordinate as keyof typeof position];
        const alignedValue = Math.round(value / gridSize) * gridSize;

        // -0을 0으로 변환
        acc[coordinate as "x" | "y"] = alignedValue === -0 ? 0 : alignedValue;

        return acc;
      },
      {} as { x: number; y: number }
    );

    if (getNodeByPosition({ position: alignedPosition })) {
      return;
    }

    addNodes([
      {
        id: uuidv4(),
        type: "custom",
        position: alignedPosition,
        data: draggedData.value
      }
    ]);
  };

  return {
    onDragStart,
    onDragOver,
    onDrop,
    onDragLeave,
    isDragOver
  };
}
