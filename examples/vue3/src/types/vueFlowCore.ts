export interface Node {
  id: string
  type: string
  position: { x: number; y: number }
  data?: Record<string, any>
  style?: Record<string, any>
}

export interface Edge {
  id: string
  type: string
  source: string
  target: string
  data?: object
  label?: string
  labelStyle?: object
  labelBgStyle?: object
  labelBgPadding?: number[]
  labelBgBorderRadius?: number
  style?: object
  animated?: boolean
}

export interface NodeTemplate {
  id: string
  type: string
  label: string
}

export interface NodeTemplateObj {
  [key: string]: NodeTemplate[]
}
