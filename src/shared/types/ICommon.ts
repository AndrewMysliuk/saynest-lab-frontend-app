export interface ITooltipPosition {
  x: number
  y: number
}

export interface ITooltip {
  show: boolean
  word: string
  language: string
  translation_language: string
  position: ITooltipPosition
}
