import { computed, ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import type { Edge, GraphEdge, Node, XYPosition } from "@vue-flow/core";
import type { CustomEdge, CustomNode } from "../types/vueFlowCore.ts";

interface History {
  actionType: string;
  nodes?: Node[] | undefined;
  edges?: Edge[] | undefined;
  origin?: Node[] | undefined;
  change?: Node[] | undefined;
}

const state = {
  snapGrid: ref<[number, number]>([15, 15]),
  lastNodeEventData: ref<{ id: string; from?: XYPosition }[]>([]),
  historyStack: ref<History[]>([]),
  currentStackKey: ref<number>(0)
};

export default function useFlowCommon() {
  const { snapGrid, lastNodeEventData, historyStack, currentStackKey } = state;
  const {
    getSelectedNodes,
    getSelectedEdges,
    getConnectedEdges,
    addNodes,
    removeNodes,
    findEdge,
    addEdges,
    removeEdges,
    getNodes,
    updateNode,
    findNode,
    getIncomers,
    getOutgoers
  } = useVueFlow();

  const isUndoDisabled = computed(() => {
    return currentStackKey.value === 0;
  });

  const isRedoDisabled = computed(() => {
    return historyStack.value.length === currentStackKey.value + 1;
  });

  const setSnapGrid = (data: [number, number]) => {
    snapGrid.value = data;
  };

  const initHistoryStack = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    historyStack.value = [{ actionType: "init", nodes, edges }];
  };

  const addNode = (nodes: Node) => {
    addNodes(nodes);
    // NOTE: Node 추가한 경우, historyStack 에 추가
    pushHistory({ actionType: "add", nodes: [nodes] });
  };

  const addEdge = (edges: Edge) => {
    addEdges(edges);
    // NOTE: Edge 추가한 경우, historyStack 에 추가
    pushHistory({ actionType: "add", edges: [edges] });
  };

  const updateNodeData = (node: Node) => {
    const originNodeData = { ...findNode(node.id) } as Node;
    updateNode(node.id, node);
    // NOTE: Node 수정한 경우, historyStack 에 추가
    pushHistory({ actionType: "edit", origin: [originNodeData], change: [node] });
  };

  const updateEdgeData = (edge: GraphEdge) => {
    const originEdge = findEdge(edge.id);
    removeEdges(edge.id);
    addEdge({ ...originEdge, ...edge });
  };

  /**
   * 현재 선택된 노드 및 엣지 삭제 함수
   */
  const deleteElements = () => {
    const nextNodeChanges: any = [];
    const nextEdgeChanges: any = [];
    const nodeIds: string[] = [];
    const connectedEdges: Edge[] = [];
    let edgeIds: string[] = [];

    getSelectedNodes.value.forEach((el) => {
      nextNodeChanges.push({ id: el.id, type: "remove" });

      nodeIds.push(el.id);
      getConnectedEdges(el.id).forEach((edge) => {
        edgeIds.push(edge.id);
        connectedEdges.push(edge);
      });
    });

    getSelectedEdges.value.forEach((el) => {
      nextEdgeChanges.push({ id: el.id, type: "remove" });
      edgeIds.push(el.id);
    });

    // TODO: confirm modal
    if (confirm("삭제하시겠습니까?")) {
      // NOTE:  Node/Edge 삭제한 경우, historyStack 에 추가
      pushHistory({
        actionType: "delete",
        nodes: getSelectedNodes.value,
        edges: [...getSelectedEdges.value, ...connectedEdges]
      });

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
      (acc, node: { id: string; from?: XYPosition }) => {
        if (node.from) {
          acc[node.id] = node.from;
        }
        return acc;
      },
      {} as { [key: string]: XYPosition }
    );

    const isNodePositionOccupied = nodes.some((node) => {
      const originPosition = originNodePositionMap[node.id];
      const isAtOriginPosition = originPosition.x === node.position.x && originPosition.y === node.position.y;
      return getNodeByPosition({ nodeId: node.id, position: node.position }) !== null || isAtOriginPosition;
    });

    const changeNodePositionList: Node[] = [];
    const originNodePositionList: Node[] = nodes.map(({ id, position }) => {
      changeNodePositionList.push({ id, position });
      const originPosition = { position: originNodePositionMap[id] };
      if (isNodePositionOccupied) {
        updateNode(id, originPosition);
      }
      return { id, ...originPosition };
    });

    // NOTE: Node position 이동한 경우, historyStack 에 추가
    if (!isNodePositionOccupied) {
      pushHistory({ actionType: "position", origin: originNodePositionList, change: changeNodePositionList });
    }
  };

  const pushHistory = (history: History) => {
    currentStackKey.value++;
    if (historyStack.value[currentStackKey.value]) {
      historyStack.value.splice(currentStackKey.value);
    }
    historyStack.value.push(history);
  };

  const executeUndo = () => {
    if (currentStackKey.value === 0) {
      return;
    }

    const { actionType, nodes, edges, origin }: History = historyStack.value[currentStackKey.value--];
    if (actionType === "position" && origin) {
      origin.forEach((node: Node) => {
        updateNode(node.id, { position: node.position });
      });
    } else if (actionType === "add") {
      if (nodes) {
        removeNodes(nodes);
      }
      if (edges) {
        removeEdges(edges);
      }
    } else if (actionType === "delete") {
      if (nodes) {
        addNodes(nodes);
      }
      if (edges) {
        addEdges(edges);
      }
    } else if (actionType === "edit" && origin) {
      const node = origin[0];
      updateNode(node.id, node);
    }
  };

  const executeRedo = () => {
    if (historyStack.value.length === currentStackKey.value + 1) {
      return;
    }

    const { actionType, nodes, edges, change }: History = historyStack.value[++currentStackKey.value];
    if (actionType === "position" && change) {
      change.forEach((node: Node) => {
        updateNode(node.id, { position: node.position });
      });
    } else if (actionType === "add") {
      if (nodes) {
        addNodes(nodes);
      }
      if (edges) {
        addEdges(edges);
      }
    } else if (actionType === "delete") {
      if (nodes) {
        removeNodes(nodes);
      }
      if (edges) {
        removeEdges(edges);
      }
    } else if (actionType === "edit" && change) {
      const node = change[0];
      updateNode(node.id, node);
    }
  };

  const transformNodeData = (data: Node | Node[]): CustomNode | CustomNode[] => {
    const isArray = !!Array.isArray(data);

    const nodes: Node[] = isArray ? (data as Node[]) : ([data] as Node[]);
    const nodeKey: (keyof CustomNode)[] = ["id", "type", "position", "data", "style"];
    let nodeData: CustomNode[] = [];

    if (nodes.length > 0) {
      nodeData = nodes.map((node) => {
        const result: Partial<CustomNode> = {};
        (Object.keys(node) as (keyof CustomNode)[]).forEach((key: keyof CustomNode) => {
          if (nodeKey.includes(key)) {
            result[key] = node[key];
          }
        });
        return result as CustomNode;
      });
    }

    return isArray ? nodeData : nodeData[0];
  };

  const transformEdgeData = (data: Edge | Edge[]): CustomEdge | CustomEdge[] => {
    const isArray = !!Array.isArray(data);

    const edges: Edge[] = isArray ? (data as Edge[]) : ([data] as Edge[]);
    const edgeKey: (keyof CustomEdge)[] = [
      "id",
      "type",
      "source",
      "target",
      "data",
      "label",
      "labelStyle",
      "labelBgStyle",
      "labelBgPadding",
      "labelBgBorderRadius",
      "style"
    ];
    let edgeData: CustomEdge[] = [];

    if (edges.length > 0) {
      edgeData = edges.map((edge) => {
        const result: Partial<CustomEdge> = {};
        (Object.keys(edge) as (keyof CustomEdge)[]).forEach((key: keyof CustomEdge) => {
          if (edgeKey.includes(key)) {
            result[key] = edge[key];
          }
        });
        return result as CustomEdge;
      });
    }

    return isArray ? edgeData : edgeData[0];
  };

  const getPath = () => {
    const pathIds: Node[][] = [];

    getNodes.value.forEach((node) => {
      if (getIncomers(node.id).length === 0) {
        findPaths(node, [node], pathIds);
      }
    });

    return ([] = pathIds.map((path) => {
      return transformNodeData(path) as CustomNode[];
    }));
  };

  const getPathByNode = (node: Node) => {
    const pathIds: Node[][] = [];
    const targetPath: Node[][] = [];

    getNodes.value.forEach((n) => {
      if (getIncomers(n.id).length === 0) {
        findPaths(n, [n], pathIds, node.id, targetPath);
      }
    });

    return ([] = targetPath.map((path) => {
      return transformNodeData(path) as CustomNode[];
    }));
  };

  const findPaths = (node: Node, path: Node[], pathIds: Node[][], targetNodeId?: string, targetPath?: Node[][]) => {
    const nextNodes = getOutgoers(node.id);

    if (nextNodes.length === 0) {
      pathIds.push([...path]);

      // NOTE: 특정 노드를 포함한 경로 저장 (targetNodeId가 있을 때만)
      if (targetNodeId && path.some((n) => n.id === targetNodeId)) {
        targetPath?.push([...path]);
      }
    } else {
      nextNodes.forEach((nextNode) => {
        findPaths(nextNode, [...path, nextNode], pathIds, targetNodeId, targetPath);
      });
    }
  };

  return {
    snapGrid,
    isUndoDisabled,
    isRedoDisabled,
    initHistoryStack,
    setSnapGrid,
    addNode,
    updateNodeData,
    addEdge,
    updateEdgeData,
    deleteElements,
    findAvailablePosition,
    onNodesChange,
    onNodeDragStop,
    getNodeByPosition,
    executeUndo,
    executeRedo,
    transformNodeData,
    transformEdgeData,
    getPath,
    getPathByNode
  };
}
