import { WavRenderer } from "../utils"

export const useMicrophone = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return stream
  } catch (err) {
    console.error("Ошибка доступа к микрофону:", err)
    return null
  }
}

export const initializeCanvas = (clientCanvas: HTMLCanvasElement | null, serverCanvas: HTMLCanvasElement | null, recorder: typeof WavRecorder, streamPlayer: typeof WavStreamPlayer) => {
  let isLoaded = true

  const render = () => {
    if (!isLoaded) return

    const clientCtx = clientCanvas?.getContext("2d")
    const serverCtx = serverCanvas?.getContext("2d")

    if (clientCanvas && clientCtx) {
      clientCanvas.width ||= clientCanvas.offsetWidth
      clientCanvas.height ||= clientCanvas.offsetHeight
      clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height)

      const result = recorder?.getRecordingStatus() ? recorder.getFrequencies("voice") : { values: new Float32Array([0]) }
      WavRenderer.drawBars(clientCanvas, clientCtx, result.values, "#0099ff", 30, 0, 8)
    }

    if (serverCanvas && serverCtx) {
      serverCanvas.width ||= serverCanvas.offsetWidth
      serverCanvas.height ||= serverCanvas.offsetHeight
      serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height)

      const result = streamPlayer?.getAnalyser() ? streamPlayer.getFrequencies("voice") : { values: new Float32Array([0]) }
      WavRenderer.drawBars(serverCanvas, serverCtx, result.values, "#009900", 30, 0, 8)
    }

    window.requestAnimationFrame(render)
  }

  render()

  return () => {
    isLoaded = false
  }
}

export const createAudioPlayer = () => {
  let mediaSource: MediaSource | null = null
  let sourceBuffer: SourceBuffer | null = null
  let audioElement: HTMLAudioElement | null = null
  let audioQueue: Array<string> = []
  let isBufferUpdating = false

  const initMediaSource = () => {
    mediaSource = new MediaSource()
    audioElement = new Audio()
    audioElement.src = URL.createObjectURL(mediaSource)

    mediaSource.addEventListener("sourceopen", () => {
      if (mediaSource && mediaSource.readyState === "open") {
        sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg")
        sourceBuffer.mode = "sequence"

        sourceBuffer.addEventListener("updateend", () => {
          isBufferUpdating = false
          if (audioQueue.length > 0) {
            appendToSourceBuffer()
          }
        })
      }
    })

    audioElement.play().catch((error) => {
      console.error("Audio playback error:", error)
    })
  }

  const appendToSourceBuffer = () => {
    if (sourceBuffer && !sourceBuffer.updating && audioQueue.length > 0) {
      const base64Audio = audioQueue.shift()
      if (base64Audio) {
        const binaryString = atob(base64Audio)
        const len = binaryString.length
        const audioData = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          audioData[i] = binaryString.charCodeAt(i)
        }

        isBufferUpdating = true
        sourceBuffer.appendBuffer(audioData)
      }
    }
  }

  const addToQueue = (base64Audio: string) => {
    audioQueue.push(base64Audio)
    if (!mediaSource) {
      initMediaSource()
    }
    if (!isBufferUpdating) {
      appendToSourceBuffer()
    }
  }

  const interruptAndClear = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }
    audioQueue = []

    if (sourceBuffer) {
      try {
        sourceBuffer.abort()
        mediaSource?.removeSourceBuffer(sourceBuffer)
        sourceBuffer = null
      } catch (error) {
        console.error("Error clearing source buffer:", error)
      }
    }

    initMediaSource()
  }

  return { addToQueue, interruptAndClear }
}
