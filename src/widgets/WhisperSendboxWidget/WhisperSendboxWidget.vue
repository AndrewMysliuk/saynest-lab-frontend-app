<template>
  <div class="sendbox">
    <h1 class="sendbox__title">Whisper Record To Text</h1>

    <p class="sendbox__desc">{{ isLoading ? "Wait For Response" : isHold ? "Recording..." : "Press and hold Space for audio record" }}</p>

    <p class="sendbox__desc">{{ recordStatus }}</p>

    <p class="sendbox__desc">Response here: {{ getWhisperResponse }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue"
import { sendboxStore } from "@/app"
import { useMicrophone } from "@/shared/lib"

export default defineComponent({
  setup() {
    const isLoading = ref<boolean>(false)
    const isHold = ref<boolean>(false)
    const recordStatus = ref<string>("")
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []

    const getWhisperResponse = computed(() => sendboxStore.getWhisperResponse)

    onMounted(async () => {
      mediaStream = await useMicrophone()
      if (!mediaStream) {
        recordStatus.value = "Microphone access denied"
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    })

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()

        if (!isLoading.value && mediaRecorder === null) {
          await startRecording()
        }
      }
    }

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (e.code === "Space") {
        await stopRecording()
      }
    }

    const startRecording = async () => {
      try {
        isHold.value = true
        recordStatus.value = "Record in progress..."

        if (!mediaStream) return

        mediaRecorder = new MediaRecorder(mediaStream)

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
          audioChunks = []

          recordStatus.value = "Sending audio to server..."
          isLoading.value = true

          await sendboxStore.fetchWhisperSpeachToText(audioBlob)
          isLoading.value = false
          recordStatus.value = ""
        }

        mediaRecorder.start()
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()

        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop())
          mediaStream = null
          mediaRecorder = null
        }

        isHold.value = false
      }
    }

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)

      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
    })

    return {
      isLoading,
      isHold,
      recordStatus,
      getWhisperResponse,
    }
  },
})
</script>
