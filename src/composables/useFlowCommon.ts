import { ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import type { XYPosition, Node } from "@vue-flow/core";

const state = {
  snapGrid: ref<[number, number]>([15, 15]),
  lastNodeEventData: ref<Node[]>([])
};

export default function useFlowCommon() {
  const { snapGrid, lastNodeEventData } = state;
  const { getSelectedNodes, getSelectedEdges, getConnectedEdges, removeNodes, removeEdges, getNodes, updateNode } =
    useVueFlow();

  const setSnapGrid = (data: [number, number]) => {
    snapGrid.value = data;
  };

  /**
   * 현재 선택된 노드 및 엣지 삭제 함수
   */
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

  /**
   * 노드 변경 이벤트 처리 함수
   */
  const onNodesChange = (event: any) => {
    lastNodeEventData.value = event;
  };

  /**
   * 노드 드래그 종료 이벤트 처리 함수
   */
  const onNodeDragStop = ({ nodes }: { nodes: Node[] }) => {
    resetNodePositionIfOccupied(nodes);
  };

  /**
   * 주어진 위치에 이미 다른 노드가 있는지 확인하는 함수
   *
   * 노드 추가인 경우는 `nodeId`를 체크하지 않으며,
   * 기존 노드의 위치를 기준으로 겹치는 다른 노드를 찾아 return.
   */
  const getNodeByPosition = ({ nodeId, position }: { nodeId?: string; position: XYPosition }) => {
    return (
      getNodes.value.find(
        (node) => node.id !== nodeId && node.position.x === position.x && node.position.y === position.y
      ) || null
    );
  };

  /**
   * 주어진 기준 위치에서, X축을 기준으로 겹치지 않는 새로운 위치를 찾아 반환하는 함수
   *
   * 이 함수는 X축으로만 우측으로 이동하며, 주어진 기준 위치의 X좌표를 기준으로
   * 해당 위치가 이미 다른 노드에 의해 점유되어 있으면, 지정된 스냅 그리드 크기만큼
   * X좌표를 이동시켜가며, 빈 위치를 찾아 return.
   */
  const findAvailablePosition = (basePosition: XYPosition) => {
    const snapGridX = snapGrid.value[0];
    let newX = basePosition.x + snapGridX;

    while (getNodeByPosition({ position: { x: newX, y: basePosition.y } })) {
      newX += snapGridX;
    }

    return { x: newX, y: basePosition.y };
  };

  /**
   * 주어진 노드들의 위치가 이미 다른 노드에 의해 차지되어 있는지 확인하고,
   * 만약 차지된 경우, 원래의 위치로 노드를 되돌리는 함수
   */
  const resetNodePositionIfOccupied = (nodes: Node[]) => {
    const originNodePositionMap: { [key: string]: XYPosition } = lastNodeEventData.value.reduce(
      (acc, node) => {
        acc[node.id] = node.position;
        return acc;
      },
      {} as { [key: string]: XYPosition }
    );

    const isNodePositionOccupied = nodes.some((node) => {
      return getNodeByPosition({ nodeId: node.id, position: node.position }) !== null;
    });

    if (isNodePositionOccupied) {
      nodes.forEach((node) => {
        updateNode(node.id, { position: originNodePositionMap[node.id] });
      });
    }
  };

  return {
    setSnapGrid,
    deleteElements,
    findAvailablePosition,
    onNodesChange,
    onNodeDragStop
  };
}
