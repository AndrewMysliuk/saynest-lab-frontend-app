<template>
  <div class="room" :class="{ '--sidebar-opened': isSidebarOpen }">
    <transition name="slide-left">
      <ConversationSidebarSendbox v-if="isSidebarOpen" />
    </transition>

    <div class="room__body">
      <div class="conversation">
        <div class="conversation__history" v-if="getConversationResponse?.conversation_history?.length">
          <v-button label="Toggle History" buttonStyle="regular" @click="isSidebarOpen = !isSidebarOpen" />
        </div>

        <div class="conversation__description" v-if="getLastModelFullAnswer && !isHold">
          <p v-animate-text="getLastModelFullAnswer" />
        </div>

        <div class="conversation__description" v-else-if="!isLoading && !isHold">
          <i class="fa-solid fa-keyboard" />
          <p>Press and hold Spacebar to start recording</p>
        </div>

        <div v-else-if="isHold" class="conversation__description">
          <i class="fa-solid fa-volume-high" />
          <p>Recording in progress... Speak now!</p>
        </div>

        <div v-else-if="isLoading" class="conversation__description">
          <span class="--pulse" />
          <p>Processing your recording...</p>
        </div>

        <div class="conversation__info" @click="isModalInfoOpen = true">
          <i class="fa-regular fa-circle-question" />
        </div>
      </div>
    </div>

    <v-modal v-model="isModalInfoOpen">
      <InfoModal />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, onBeforeMount, nextTick } from "vue"
import { sendboxStore, audioPlayer, promptStore } from "@/app"
import { useRouter } from "vue-router"
import { useMicrophone } from "@/shared/lib"
import { ConversationSidebarSendbox, InfoModal } from "./ui"

export default defineComponent({
  components: {
    ConversationSidebarSendbox,
    InfoModal,
  },

  setup() {
    const router = useRouter()
    const isModalInfoOpen = ref<boolean>(false)
    const isSidebarOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const isHold = ref<boolean>(false)
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []
    let recordingStartTime: number | null = null

    const getConversationResponse = computed(() => sendboxStore.getConversationResponse)
    const getLastModelFullAnswer = computed(() => sendboxStore.getLastModelFullAnswer)
    const getSelectedPrompt = computed(() => promptStore.getSelectedPrompt)

    onBeforeMount(() => {
      if (!Object.keys(getSelectedPrompt.value).length) {
        nextTick(() => {
          router.push({ name: "sendbox.prompts" })
        })
      }
    })

    onMounted(async () => {
      mediaStream = await useMicrophone()

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    })

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Space" && !isHold.value && !isLoading.value && !mediaRecorder) {
        e.preventDefault()

        isHold.value = true
        audioPlayer.interruptAndClear()
        await startRecording()
      }
    }

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()

        if (isHold.value && !isLoading.value) {
          await stopRecording()
        }

        isHold.value = false
      }
    }

    const startRecording = async () => {
      if (mediaRecorder || isLoading.value || !mediaStream) return

      try {
        recordingStartTime = Date.now()
        mediaRecorder = new MediaRecorder(mediaStream)
        audioChunks = []

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          if (audioChunks.length === 0) return

          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          audioChunks = []

          const recordingDuration = Date.now() - (recordingStartTime ?? 0)
          if (recordingDuration < 125) return

          isLoading.value = true

          await sendboxStore.fetchConversation({
            whisper: {
              audioFile: audioBlob,
            },
            gpt_model: {
              model: "gpt-4o-mini",
              max_tokens: 500,
            },
            tts: {
              model: "tts-1",
              voice: "alloy",
              response_format: "mp3",
            },
            system: {
              sessionId: getConversationResponse.value?.session_id ?? "",
              globalPrompt: getSelectedPrompt.value?.prompt,
            },
          })

          isLoading.value = false
          mediaRecorder = null
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
      mediaRecorder = null
    }

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)

      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop())
    })

    return {
      isModalInfoOpen,
      isSidebarOpen,
      isLoading,
      isHold,
      getLastModelFullAnswer,
      getConversationResponse,
    }
  },
})
</script>
