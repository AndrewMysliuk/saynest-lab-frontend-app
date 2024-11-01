<template>
  <div class="room" :class="{ '--sidebar-opened': isSidebarOpen }">
    <transition name="slide-left">
      <ConversationSidebarSendbox v-if="isSidebarOpen" />
    </transition>

    <div class="room__body">
      <div>
        <div class="room__title">Conversation Chat</div>

        <div class="room__navbar">
          <div class="room__navbar-wrapper">
            <div class="room__navbar-btn">
              <v-button label="Toggle History" buttonStyle="regular" @click="isSidebarOpen = !isSidebarOpen" :disabled="!getConversationResponse?.conversation_history?.length" />
            </div>
          </div>
        </div>

        <div class="room__spacebar">
          {{ isLoading ? "Wait For Response" : isHold ? "Recording..." : "Press and hold Space for audio record" }}
        </div>

        <div class="room__spacebar">
          {{ recordStatus }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from "vue"
import { sendboxStore } from "@/app"
import { useMicrophone } from "@/shared/lib"
import { testPrompt } from "@/shared/utils"
import { ConversationSidebarSendbox } from "./ui"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export default defineComponent({
  components: {
    ConversationSidebarSendbox,
  },

  setup() {
    const isSidebarOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const isHold = ref<boolean>(false)
    const recordStatus = ref<string>("")
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []

    const getConversationResponse = computed(() => sendboxStore.getConversationResponse)

    onMounted(async () => {
      mediaStream = await useMicrophone()
      if (!mediaStream) {
        recordStatus.value = "Microphone access denied"
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    })

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Space" && !isHold.value && !isLoading.value) {
        e.preventDefault()
        isHold.value = true
        await startRecording()
      }
    }

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (e.code === "Space" && isHold.value && !isLoading.value) {
        e.preventDefault()
        await stopRecording()
        isHold.value = false
      }
    }

    const startRecording = async () => {
      try {
        recordStatus.value = "Record in progress..."

        if (!mediaStream) return

        mediaRecorder = new MediaRecorder(mediaStream)
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          audioChunks = []

          recordStatus.value = "Sending audio to server..."
          isLoading.value = true

          await sendboxStore.fetchConversation({
            whisper: {
              audioFile: audioBlob,
            },
            gpt_model: {
              model: "gpt-4-turbo",
              max_tokens: 500,
            },
            tts: {
              model: "tts-1",
              voice: "alloy",
              response_format: "mp3",
            },
            system: {
              sessionId: getConversationResponse.value?.session_id ?? "",
              globalPrompt: testPrompt,
            },
          })

          const lastResponse = getConversationResponse.value?.conversation_history?.[getConversationResponse.value?.conversation_history?.length - 1]

          if (lastResponse) {
            const audio = new Audio(`${VITE_API_CORE_URL}${lastResponse.audioUrl}`)
            audio.play()
          }

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
      isSidebarOpen,
      isLoading,
      isHold,
      recordStatus,
      getConversationResponse,
    }
  },
})
</script>
