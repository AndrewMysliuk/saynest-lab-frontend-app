import { noteFrequencies, noteFrequencyLabels, voiceFrequencies, voiceFrequencyLabels } from "./constants"

export interface AudioAnalysisOutputType {
  values: Float32Array
  frequencies: number[]
  labels: string[]
}

type AnalysisType = "frequency" | "music" | "voice"

/**
 * Analyzes audio for visual output
 * @class
 */
export class AudioAnalysis {
  private fftResults: Float32Array[] = []
  private audio: HTMLAudioElement
  private context: AudioContext | OfflineAudioContext
  private analyser: AnalyserNode
  private sampleRate: number
  private audioBuffer: AudioBuffer | null

  constructor(audioElement: HTMLAudioElement, audioBuffer: AudioBuffer | null = null) {
    this.audioBuffer = audioBuffer
    if (audioBuffer) {
      const { length, sampleRate } = audioBuffer
      const offlineAudioContext = new OfflineAudioContext({ length, sampleRate })
      const source = offlineAudioContext.createBufferSource()
      source.buffer = audioBuffer
      const analyser = offlineAudioContext.createAnalyser()
      analyser.fftSize = 8192
      analyser.smoothingTimeConstant = 0.1
      source.connect(analyser)
      this.processOfflineAudioContext(offlineAudioContext, analyser, source)
      this.audio = audioElement
      this.context = offlineAudioContext
      this.analyser = analyser
      this.sampleRate = sampleRate
    } else {
      const audioContext = new AudioContext()
      const track = audioContext.createMediaElementSource(audioElement)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 8192
      analyser.smoothingTimeConstant = 0.1
      track.connect(analyser)
      analyser.connect(audioContext.destination)
      this.audio = audioElement
      this.context = audioContext
      this.analyser = analyser
      this.sampleRate = audioContext.sampleRate
    }
  }

  private processOfflineAudioContext(offlineAudioContext: OfflineAudioContext, analyser: AnalyserNode, source: AudioBufferSourceNode): void {
    const renderQuantumInSeconds = 1 / 60
    const durationInSeconds = offlineAudioContext.length / offlineAudioContext.sampleRate
    const analyze = (index: number) => {
      const suspendTime = renderQuantumInSeconds * index
      if (suspendTime < durationInSeconds) {
        offlineAudioContext.suspend(suspendTime).then(() => {
          const fftResult = new Float32Array(analyser.frequencyBinCount)
          analyser.getFloatFrequencyData(fftResult)
          this.fftResults.push(fftResult)
          analyze(index + 1)
        })
      } else if (index === 1) {
        offlineAudioContext.startRendering()
      } else {
        offlineAudioContext.resume()
      }
    }
    source.start(0)
    analyze(1)
  }

  static getFrequencies(
    analyser: AnalyserNode,
    sampleRate: number,
    fftResult: Float32Array | null,
    analysisType: AnalysisType = "frequency",
    minDecibels = -100,
    maxDecibels = -30
  ): AudioAnalysisOutputType {
    if (!fftResult) {
      fftResult = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(fftResult)
    }
    const nyquistFrequency = sampleRate / 2
    const frequencyStep = (1 / fftResult.length) * nyquistFrequency
    let outputValues: number[]
    let frequencies: number[]
    let labels: string[]

    if (analysisType === "music" || analysisType === "voice") {
      const useFrequencies = analysisType === "voice" ? voiceFrequencies : noteFrequencies
      const aggregateOutput = Array(useFrequencies.length).fill(minDecibels)
      for (let i = 0; i < fftResult.length; i++) {
        const frequency = i * frequencyStep
        const amplitude = fftResult[i]
        for (let n = useFrequencies.length - 1; n >= 0; n--) {
          if (frequency > useFrequencies[n]) {
            aggregateOutput[n] = Math.max(aggregateOutput[n], amplitude)
            break
          }
        }
      }
      outputValues = aggregateOutput
      frequencies = useFrequencies
      labels = analysisType === "voice" ? voiceFrequencyLabels : noteFrequencyLabels
    } else {
      outputValues = Array.from(fftResult)
      frequencies = outputValues.map((_, i) => frequencyStep * i)
      labels = frequencies.map((f) => `${f.toFixed(2)} Hz`)
    }

    const normalizedOutput = outputValues.map((v) => Math.max(0, Math.min((v - minDecibels) / (maxDecibels - minDecibels), 1)))
    return { values: new Float32Array(normalizedOutput), frequencies, labels }
  }

  getFrequencies(analysisType: AnalysisType = "frequency", minDecibels = -100, maxDecibels = -30): AudioAnalysisOutputType {
    let fftResult: Float32Array | null = null
    if (this.audioBuffer && this.fftResults.length) {
      const pct = this.audio.currentTime / this.audio.duration
      const index = Math.min(Math.floor(pct * this.fftResults.length), this.fftResults.length - 1)
      fftResult = this.fftResults[index]
    }
    return AudioAnalysis.getFrequencies(this.analyser, this.sampleRate, fftResult, analysisType, minDecibels, maxDecibels)
  }

  async resumeIfSuspended(): Promise<true> {
    if (this.context.state === "suspended") {
      await this.context.resume()
    }
    return true
  }
}

globalThis.AudioAnalysis = AudioAnalysis
