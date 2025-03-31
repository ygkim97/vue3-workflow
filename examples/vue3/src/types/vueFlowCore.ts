export interface DagData {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data?: Record<string, any>;
  style?: Record<string, any>;
}

export interface Edge {
  id: string;
  type: string;
  source: string;
  target: string;
  data?: object;
  label?: string;
  labelStyle?: object;
  labelBgStyle?: object;
  labelBgPadding?: number[];
  labelBgBorderRadius?: number;
  style?: object;
  animated?: boolean;
}
