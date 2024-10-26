import { StreamProcessorSrc } from "./worklets/streamProcessor"
import { AudioAnalysis, AudioAnalysisOutputType } from "./analysis/audioAnalysis"

interface WavStreamPlayerOptions {
  sampleRate?: number
}

interface TrackSampleOffset {
  trackId: string | null
  offset: number
  currentTime: number
}

/**
 * Plays audio streams received in raw PCM16 chunks from the browser
 */
export class WavStreamPlayer {
  private scriptSrc: string
  private sampleRate: number
  private context: AudioContext | null = null
  private stream: AudioWorkletNode | null = null
  private analyser: AnalyserNode | null = null
  private trackSampleOffsets: Record<string, TrackSampleOffset> = {}
  private interruptedTrackIds: Record<string, boolean> = {}

  constructor({ sampleRate = 44100 }: WavStreamPlayerOptions = {}) {
    this.scriptSrc = StreamProcessorSrc
    this.sampleRate = sampleRate
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  async connect(): Promise<true> {
    this.context = new AudioContext({ sampleRate: this.sampleRate })
    if (this.context.state === "suspended") {
      await this.context.resume()
    }
    try {
      await this.context.audioWorklet.addModule(this.scriptSrc)
    } catch (e) {
      console.error(e)
      throw new Error(`Could not add audioWorklet module: ${this.scriptSrc}`)
    }
    const analyser = this.context.createAnalyser()
    analyser.fftSize = 8192
    analyser.smoothingTimeConstant = 0.1
    this.analyser = analyser
    return true
  }

  getFrequencies(analysisType: "frequency" | "music" | "voice" = "frequency", minDecibels: number = -100, maxDecibels: number = -30): AudioAnalysisOutputType {
    if (!this.analyser) {
      throw new Error("Not connected, please call .connect() first")
    }
    return AudioAnalysis.getFrequencies(this.analyser, this.sampleRate, null, analysisType, minDecibels, maxDecibels)
  }

  private async _start(): Promise<true> {
    if (!this.context) {
      throw new Error("Audio context not initialized. Call connect() first.")
    }
    const streamNode = new AudioWorkletNode(this.context, "stream_processor")
    streamNode.connect(this.context.destination)
    streamNode.port.onmessage = (e) => {
      const { event } = e.data
      if (event === "stop") {
        streamNode.disconnect()
        this.stream = null
      } else if (event === "offset") {
        const { requestId, trackId, offset } = e.data
        const currentTime = offset / this.sampleRate
        this.trackSampleOffsets[requestId] = { trackId, offset, currentTime }
      }
    }

    this.analyser?.disconnect()
    streamNode.connect(this.analyser!)
    this.stream = streamNode
    return true
  }

  add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array, trackId: string = "default"): Int16Array | void {
    if (typeof trackId !== "string") {
      throw new Error(`trackId must be a string`)
    } else if (this.interruptedTrackIds[trackId]) {
      return
    }
    if (!this.stream) {
      this._start()
    }
    let buffer: Int16Array
    if (arrayBuffer instanceof Int16Array) {
      buffer = arrayBuffer
    } else if (arrayBuffer instanceof ArrayBuffer) {
      buffer = new Int16Array(arrayBuffer)
    } else {
      throw new Error(`argument must be Int16Array or ArrayBuffer`)
    }
    this.stream!.port.postMessage({ event: "write", buffer, trackId })
    return buffer
  }

  async getTrackSampleOffset(interrupt: boolean = false): Promise<TrackSampleOffset | null> {
    if (!this.stream) {
      return null
    }
    const requestId = crypto.randomUUID()
    this.stream.port.postMessage({
      event: interrupt ? "interrupt" : "offset",
      requestId,
    })
    let trackSampleOffset
    while (!trackSampleOffset) {
      trackSampleOffset = this.trackSampleOffsets[requestId]
      await new Promise((resolve) => setTimeout(resolve, 1))
    }
    const { trackId } = trackSampleOffset
    if (interrupt && trackId) {
      this.interruptedTrackIds[trackId] = true
    }
    return trackSampleOffset
  }

  async interrupt(): Promise<TrackSampleOffset | null> {
    return this.getTrackSampleOffset(true)
  }
}

globalThis.WavStreamPlayer = WavStreamPlayer
