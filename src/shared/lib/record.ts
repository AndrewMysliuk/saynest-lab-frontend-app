import { WavRenderer } from "../utils"

// WavRecorder, WavStreamPlayer,

export const useMicrophone = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return stream
  } catch (err) {
    console.error("Ошибка доступа к микрофону:", err)
    return null
  }
}

export const animateText = (text: string, updateFn: (text: string) => void, speed: number = 50) => {
  let index = 0
  let currentText = ""

  updateFn("")

  const interval = setInterval(() => {
    if (index < text.length) {
      currentText += text[index]
      updateFn(currentText)
      index++
    } else {
      clearInterval(interval)
    }
  }, speed)
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
      WavRenderer.drawBars(clientCanvas, clientCtx, result.values, "#0099ff", 10, 0, 8)
    }

    if (serverCanvas && serverCtx) {
      serverCanvas.width ||= serverCanvas.offsetWidth
      serverCanvas.height ||= serverCanvas.offsetHeight
      serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height)

      const result = streamPlayer?.getAnalyser() ? streamPlayer.getFrequencies("voice") : { values: new Float32Array([0]) }
      WavRenderer.drawBars(serverCanvas, serverCtx, result.values, "#009900", 10, 0, 8)
    }

    window.requestAnimationFrame(render)
  }

  render()

  return () => {
    isLoaded = false
  }
}
