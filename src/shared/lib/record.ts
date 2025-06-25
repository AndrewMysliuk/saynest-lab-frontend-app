import { ref } from "vue"

export const useMicrophone = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return stream
  } catch (err) {
    console.error("Ошибка доступа к микрофону:", err)
    return null
  }
}

const cleanupAudioContext = async (audioContext: AudioContext, mediaStream: MediaStream) => {
  mediaStream.getTracks().forEach((track) => track.stop())

  if (audioContext && audioContext.state !== "closed") {
    await audioContext.close()
  }
}

export const initializeCanvasForConversation = (canvas: HTMLCanvasElement | null, mediaStream: MediaStream) => {
  let isLoaded = true
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()

  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.8

  const source = audioContext.createMediaStreamSource(mediaStream)
  source.connect(analyser)

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Float32Array(bufferLength)

  const render = () => {
    if (!isLoaded || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    analyser.getFloatTimeDomainData(dataArray)

    const barWidth = (canvas.width / bufferLength) * 2.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const amplitude = Math.abs(dataArray[i])
      const barHeight = amplitude * canvas.height * 2.5

      const hue = 160 + amplitude * 100
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
      x += barWidth + 1
    }

    requestAnimationFrame(render)
  }

  render()

  return async () => {
    isLoaded = false
    await cleanupAudioContext(audioContext, mediaStream)
  }
}

export const createAudioPlayer = () => {
  let mediaSource: MediaSource | null = null
  let sourceBuffer: SourceBuffer | null = null
  const audioElement = ref<HTMLAudioElement | null>(null)
  let audioQueue: Array<string> = []
  let isBufferUpdating = false

  const initMediaSource = () => {
    if (mediaSource) return

    mediaSource = new MediaSource()
    audioElement.value = new Audio()
    audioElement.value.src = URL.createObjectURL(mediaSource)

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
  }

  const appendToSourceBuffer = () => {
    if (sourceBuffer && !sourceBuffer.updating && audioQueue.length > 0) {
      const base64Audio = audioQueue.shift()
      if (base64Audio) {
        const binaryString = atob(base64Audio)
        const audioData = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          audioData[i] = binaryString.charCodeAt(i)
        }

        isBufferUpdating = true
        try {
          sourceBuffer.appendBuffer(audioData)

          if (audioElement.value && audioElement.value.paused) {
            audioElement.value.play().catch((error) => {
              console.error("Audio playback error:", error)
            })
          }
        } catch (error) {
          console.error("Error appending to source buffer:", error)
        }
      }
    }
  }

  const addToQueue = (base64Audio: string) => {
    audioQueue.push(base64Audio)

    if (!mediaSource || !audioElement) {
      initMediaSource()
    }
    if (!isBufferUpdating && (!sourceBuffer || !sourceBuffer.updating)) {
      appendToSourceBuffer()
    }
  }

  const interruptAndClear = () => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
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

    if (mediaSource) {
      mediaSource = null
    }
  }

  return { addToQueue, interruptAndClear, audioElement }
}

// Google TTS Url
export const createUrlAudioPlayer = () => {
  const audioElement = ref<HTMLAudioElement | null>(new Audio())

  const playUrl = (url: string) => {
    if (!audioElement.value) return

    audioElement.value.pause()
    audioElement.value.currentTime = 0
    audioElement.value.src = url
    audioElement.value.load()

    audioElement.value.play().catch((error) => {
      console.error("Audio playback error:", error)
    })
  }

  const stop = () => {
    if (!audioElement.value) return
    audioElement.value.pause()
    audioElement.value.currentTime = 0
  }

  return {
    playUrl,
    stop,
    audioElement,
  }
}
