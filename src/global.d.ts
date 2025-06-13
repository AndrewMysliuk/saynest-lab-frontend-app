import { AudioAnalysis } from "@/shared/lib/wavtools/analysis/audioAnalysis"
import { WavStreamPlayer } from "@/shared/lib/wavtools/wavStreamPlayer"
import { WavRecorder } from "@/shared/lib/wavtools/wavRecorder"

declare global {
  var AudioAnalysis: typeof AudioAnalysis
  var WavStreamPlayer: typeof WavStreamPlayer
  var WavRecorder: typeof WavRecorder
}

declare global {
  interface HTMLElement {
    _cleanup?: () => void
  }
  interface Window {
    google: typeof google
    hj: typeof hj
    Paddle: typeof Paddle
  }
}

export {}
