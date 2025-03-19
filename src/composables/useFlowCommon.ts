import { ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import type { XYPosition, Node } from "@vue-flow/core";

const state = {
  lastNodeEventData: ref<Node[]>([])
};

export default function useDragAndDrop() {
  const { lastNodeEventData } = state;
  const { getSelectedNodes, getSelectedEdges, getConnectedEdges, removeNodes, removeEdges, getNodes, updateNode } =
    useVueFlow();

  const deleteElements = () => {
    const nextNodeChanges: any = [];
    const nextEdgeChanges: any = [];
    const nodeIds: string[] = [];
    let edgeIds: string[] = [];

    getSelectedNodes.value.forEach((el) => {
      nextNodeChanges.push({ id: el.id, type: "remove" });

      nodeIds.push(el.id);
      getConnectedEdges(el.id).forEach((edge) => {
        edgeIds.push(edge.id);
      });
    });

    getSelectedEdges.value.forEach((el) => {
      nextEdgeChanges.push({ id: el.id, type: "remove" });
      edgeIds.push(el.id);
    });

    // TODO: confirm modal
    if (confirm("삭제하시겠습니까?")) {
      removeNodes(nextNodeChanges);
      removeEdges(nextEdgeChanges);

      edgeIds = [...new Set(edgeIds)];
      return { nodeIds, edgeIds };
    }
  };

  const findAvailablePosition = (snapGrid: [number, number], basePosition: XYPosition) => {
    const snapGridX = snapGrid[0];
    let newX = basePosition.x + snapGridX;

    while (getNodeByPosition({ x: newX, y: basePosition.y })) {
      // NOTE: 우측으로만 Position 검색
      newX += snapGridX;
    }

    return { x: newX, y: basePosition.y };
  };

  const getNodeByPosition = (position: { x: number; y: number }, nodeId?: string) => {
    return (
      getNodes.value.find(
        (node) => node.id !== nodeId && node.position.x === position.x && node.position.y === position.y
      ) || null
    );
  };

  const onNodesChange = (event: any) => {
    lastNodeEventData.value = event;
  };

  const onNodeDragStop = ({ nodes }: { nodes: Node[] }) => {
    const originNodePositionMap: { [key: string]: XYPosition } = lastNodeEventData.value.reduce(
      (acc, node) => {
        acc[node.id] = node.position;
        return acc;
      },
      {} as { [key: string]: XYPosition }
    );

    const foundTrue = nodes.some((node) => {
      return getNodeByPosition(node.position, node.id) !== null;
    });

    if (foundTrue) {
      nodes.forEach((node) => {
        updateNode(node.id, { position: originNodePositionMap[node.id] });
      });
    }
  };

  return {
    deleteElements,
    findAvailablePosition,
    onNodesChange,
    onNodeDragStop
  };
}
