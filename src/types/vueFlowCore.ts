export interface CustomNode {
  id: string; // 노드의 고유 ID
  type: string; // 노드 유형("input", "default", "output", "custom", ...)
  position: { x: number; y: number }; // 2D 좌표 (x, y)
  data?: object;
  style?: object;
}

export interface CustomEdge {
  id: string; // 엣지 고유 ID
  type: string; // 엣지 유형("default", "smoothstep", "step", "custom", ...)
  source: string; // 출발 노드 ID
  target: string; // 목적지 노드 ID
  data?: object;
  label?: string; // 엣지 위에 표시할 텍스트
  labelStyle?: object; // 엣지 라벨의 스타일 속성
  labelBgStyle?: object; // 엣지 라벨 배경 스타일 속성
  labelBgPadding?: number[]; // 엣지 라벨 패딩 값 설정
  labelBgBorderRadius?: number; // 엣지 라벨 배경의 둥근 모서리 설정
  style?: object; // 엣지의 스타일 속성
}
