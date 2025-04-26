export interface ITooltipPosition {
  x: number
  y: number
}

export interface ITooltip {
  show: boolean
  word: string
  target_language: string
  explanation_language: string
  position: ITooltipPosition
}
