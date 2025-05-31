<template>
  <div class="room" :class="{ '--sidebar-opened': isSidebarOpen, '--goals-opened': isGoalsOpen }">
    <transition name="slide-left">
      <ConversationSidebar v-if="isSidebarOpen" />
    </transition>

    <transition name="slide-left">
      <div v-if="isGoalsOpen" class="absolute top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-6 shadow-xl overflow-y-auto z-20">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Conversation Goals</h2>

        <div v-for="(goal, index) in getSelectedPrompt.user_content.goals" :key="index" class="mb-4">
          <details class="group">
            <summary class="cursor-pointer text-base font-medium text-text-base transition hover:text-primary">• {{ goal.phrase }}</summary>
            <p class="ml-4 mt-1 text-sm text-gray-500">{{ goal.translation[getUserTranslateLanguage] }}</p>
          </details>
        </div>
      </div>
    </transition>

    <div class="room__body">
      <div class="conversation" v-if="!isReviewGenerating">
        <div class="absolute top-4 right-4 z-10 flex gap-2">
          <button
            v-if="(getUserHistory?.length > getSelectedPrompt?.meta?.max_turns || getSessionIsEnd) && getIsLogged"
            @click="analyseUserConversation"
            class="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm font-medium"
          >
            Finish and Analyse Conversation
          </button>

          <button
            v-if="getConversationResponse?.conversation_history?.length"
            @click="toggleSidebar"
            class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium"
          >
            Toggle History
          </button>

          <button @click="toggleGoals" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium">Toggle Goals</button>
        </div>

        <div class="conversation__description" v-if="getLastModelFullAnswer">
          <p class="--cursor" v-word-click="handleWordClick">{{ getLastModelFullAnswer }}</p>

          <div class="conversation__warning" v-if="getLastModelTip" v-html="getLastModelTip" />
        </div>

        <div class="conversation__description" v-else-if="!isLoading && !isHold">
          <i class="fa-solid fa-keyboard" />
          <p>Press and hold Spacebar to start recording</p>
        </div>

        <TheLoader v-else-if="isLoading" message="Processing your recording..." />

        <div class="conversation__info --left" v-if="!getIsLoading" @click="repeatLastAudio">
          <i class="fa-solid fa-repeat" />
        </div>

        <div class="conversation__info" @click="isModalInfoOpen = true">
          <i class="fa-regular fa-circle-question" />
        </div>

        <div class="conversation__visualization --client" v-if="isHold">
          <canvas ref="clientCanvasRef" />
        </div>

        <div class="conversation__visualization --prompt" v-if="isHold && getConversationResponse?.conversation_history?.length && !isLoading">
          <p>Recording in progress... Speak now! (Press Esc to cancel the recording) Duration: {{ recordingDuration }}s</p>
        </div>

        <div class="conversation__visualization --prompt" v-else-if="!isHold && getConversationResponse?.conversation_history?.length && !isLoading">
          <p>Press and hold Spacebar to interrupt and start recording</p>
        </div>
      </div>

      <TheLoader v-else message="Review Generation In Progress..." />
    </div>

    <TheWordTooltip
      :language="tooltip.target_language"
      :translation-language="tooltip.explanation_language"
      :word="tooltip.word"
      :position="tooltip.position"
      :show="tooltip.show"
      @close="hideTooltip"
    />

    <v-modal v-model="isModalInfoOpen" is-curtain>
      <InfoModal />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, onBeforeMount, watch } from "vue"
import { conversationStore, audioPlayer, promptStore, errorAnalysisStore, communicationReviewStore, authStore, userStore } from "@/app"
import { useRouter } from "vue-router"
import { TheWordTooltip, TheLoader } from "@/shared/components"
import { retryWithAdaptiveParams } from "@/shared/utils"
import { useMicrophone, initializeCanvasForConversation } from "@/shared/lib"
import helloRecord from "@/shared/assets/records/hello_record.wav"
import { ConversationSidebar, InfoModal } from "./ui"
import { ITooltip, SessionTypeEnum } from "@/shared/types"
import { createSessionHandler } from "@/shared/api"

export default defineComponent({
  components: {
    ConversationSidebar,
    InfoModal,
    TheLoader,
    TheWordTooltip,
  },

  setup() {
    const router = useRouter()
    const controller = new AbortController()
    const clientCanvasRef = ref<HTMLCanvasElement | null>(null)
    const audioElementRef = ref<HTMLAudioElement | null>(null)
    const isModalInfoOpen = ref<boolean>(false)
    const isSidebarOpen = ref<boolean>(false)
    const isGoalsOpen = ref<boolean>(false)
    const isReviewGenerating = ref<boolean>(false)
    const isLoading = ref<boolean>(true)
    const isHold = ref<boolean>(false)
    const isCancelled = ref<boolean>(false)
    const isGoalsToggle = ref<boolean>(false)
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []
    let cleanupCanvas: (() => void) | null = null
    const tooltip = ref<ITooltip>({
      show: false,
      target_language: "",
      explanation_language: "",
      word: "",
      position: { x: 0, y: 0 },
    })
    const recordingDuration = ref<number>(0)
    let recordingTimer: number | null = null

    const getIsLogged = computed(() => authStore.getIsLogged)
    const getIsLoading = computed(() => conversationStore.getIsLoading)
    const getConversationResponse = computed(() => conversationStore.getConversationResponse)
    const getUserHistory = computed(() => getConversationResponse.value.conversation_history?.filter((item) => item.role === "user"))
    const getLastModelFullAnswer = computed(() => conversationStore.getLastModelFullAnswer)
    const getLastModelTip = computed(() => errorAnalysisStore.getLastModelTip)
    const getSessionIsEnd = computed(() => errorAnalysisStore.getSessionIsEnd)
    const getSelectedPrompt = computed(() => promptStore.getCurrentPrompt)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "uk")

    onBeforeMount(async () => {
      if (!Object.keys(getSelectedPrompt.value)?.length) {
        setTimeout(() => {
          router.push({ name: "platform.conversation-dashboard" })
        }, 100)
      } else {
        conversationStore.resetAll()
        errorAnalysisStore.resetAll()

        tooltip.value.target_language = getSelectedPrompt.value.meta.target_language
        tooltip.value.explanation_language = getUserTranslateLanguage.value

        await simulateGreeting()
      }
    })

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      window.addEventListener("beforeunload", handleBeforeUnload)
    })

    const analyseUserConversation = async () => {
      if (getConversationResponse.value) {
        try {
          isReviewGenerating.value = true

          await communicationReviewStore.generateConversationReview({
            session_id: getConversationResponse.value?.session_id,
            prompt_id: getSelectedPrompt.value._id,
            topic_title: getSelectedPrompt.value.title ?? "",
            target_language: getSelectedPrompt.value.meta.target_language,
            explanation_language: getUserTranslateLanguage.value,
          })

          conversationStore.resetAll()
          errorAnalysisStore.resetAll()

          router.push({
            name: "platform.conversation-history",
            params: { id: getCurrentReview.value?._id },
          })
        } catch (error) {
          console.error("Error analysing user conversation:", error)
        } finally {
          isReviewGenerating.value = false
        }
      }
    }

    const repeatLastAudio = async () => {
      if (!audioElementRef.value) return

      audioElementRef.value.pause()
      audioElementRef.value.currentTime = 0
      audioElementRef.value.play()
    }

    const simulateGreeting = async () => {
      try {
        const response = await fetch(helloRecord)
        const audioBlob = await response.blob()

        if (!audioBlob) return

        isLoading.value = true

        const { _id } = await createSessionHandler({
          type: SessionTypeEnum.SPEACKING,
          prompt_id: getSelectedPrompt.value?._id,
        })

        await conversationStore.fetchConversation(
          {
            whisper: { audio_file: audioBlob },
            gpt_model: { model: "gpt-4o", max_tokens: 350 },
            tts: { model: "tts-1", voice: "nova", response_format: "mp3" },
            // tts: { voice: "EXAVITQu4vr4xnSDxMaL", model: "eleven_flash_v2_5", voice_settings: { stability: 0.3, similarity_boost: 0.6 } },
            system: {
              session_id: _id,
              prompt_id: getSelectedPrompt.value?._id,
            },
            target_language: getSelectedPrompt.value.meta.target_language,
            explanation_language: getUserTranslateLanguage.value,
          },
          controller.signal
        )
      } catch (error) {
        console.error("Error simulating greeting:", error)
      } finally {
        isLoading.value = false
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
      return ""
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Space" && !isHold.value && !isLoading.value) {
        e.preventDefault()
        isHold.value = true
        isCancelled.value = false
        audioPlayer.interruptAndClear()
        await startRecording()
      }

      if (e.code === "Escape" && isHold.value) {
        e.preventDefault()
        isCancelled.value = true
        await stopRecording()
        isHold.value = false
      }
    }

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (e.code === "Space" && isHold.value) {
        e.preventDefault()
        await stopRecording()
        isHold.value = false
      }
    }

    const startRecording = async () => {
      if (isLoading.value || mediaRecorder) return

      try {
        mediaStream = await useMicrophone()
        audioChunks = []
        const recordingStartTime = Date.now()

        if (!mediaStream) return

        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm;codecs=opus" })

        if (clientCanvasRef.value) {
          cleanupCanvas = initializeCanvasForConversation(clientCanvasRef.value, mediaStream)
        }

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          if (audioChunks.length === 0 || isCancelled.value) {
            audioChunks = []
            isCancelled.value = false
            if (cleanupCanvas) await cleanupCanvas()
            return
          }

          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          audioChunks = []

          if (recordingDuration.value * 1000 < 125) return

          isLoading.value = true

          try {
            errorAnalysisStore.resetLastModelTip()

            await conversationStore.fetchConversation(
              {
                whisper: { audio_file: audioBlob },
                gpt_model: { model: "gpt-4o", max_tokens: 350 },
                tts: { model: "tts-1", voice: "nova", response_format: "mp3" },
                // tts: { voice: "EXAVITQu4vr4xnSDxMaL", model: "eleven_flash_v2_5", voice_settings: { stability: 0.3, similarity_boost: 0.6 } },
                system: {
                  session_id: getConversationResponse.value?.session_id ?? "",
                  prompt_id: getSelectedPrompt.value?._id,
                },
                target_language: getSelectedPrompt.value.meta.target_language,
                explanation_language: getUserTranslateLanguage.value,
              },
              controller.signal
            )

            await retryWithAdaptiveParams(
              errorAnalysisStore.fetchErrorAnalysis,
              {
                gpt_payload: {
                  model: "gpt-4o",
                  max_tokens: 1000,
                  messages: getConversationResponse.value.conversation_history.map((item) => ({
                    role: item.role,
                    content: item.content,
                  })),
                },
                session_id: getConversationResponse.value?.session_id ?? "",
                target_language: getSelectedPrompt.value.meta.target_language,
                explanation_language: getUserTranslateLanguage.value,
                prompt_id: getSelectedPrompt.value?._id ?? "",
              },
              {
                retries: 3,
                delayMs: 1000,
                onRetry: (attempt, error) => {
                  console.warn(`Attempt ${attempt} failed. Error:`, error)
                },
                adaptParams: (params) => {
                  return {
                    ...params,
                    gpt_payload: {
                      ...params.gpt_payload,
                      max_tokens: params?.gpt_payload?.max_tokens ? params?.gpt_payload?.max_tokens + 100 : 1000,
                    },
                  }
                },
              }
            )
          } catch (error) {
            console.error("Error fetching conversation:", error)
          } finally {
            isLoading.value = false
          }

          if (cleanupCanvas) await cleanupCanvas()
        }

        recordingDuration.value = 0

        recordingTimer = window.setInterval(async () => {
          recordingDuration.value = Math.floor((Date.now() - recordingStartTime) / 1000)

          if (recordingDuration.value >= 60 && isHold.value) {
            isCancelled.value = true
            await stopRecording()
            isHold.value = false
          }
        }, 1000)

        mediaRecorder.start()
      } catch (error: unknown) {
        console.log(error)
        if (cleanupCanvas) await cleanupCanvas()
      }
    }

    const stopRecording = async () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()
      }

      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
        mediaStream = null
      }

      if (cleanupCanvas) {
        await cleanupCanvas()
        cleanupCanvas = null
      }

      if (recordingTimer) {
        clearInterval(recordingTimer)
        recordingTimer = null
      }

      mediaRecorder = null
    }

    const hideTooltip = () => {
      tooltip.value.show = false
    }

    const handleWordClick = (word: string, event: MouseEvent) => {
      tooltip.value.show = false

      setTimeout(() => {
        tooltip.value = {
          ...tooltip.value,
          show: true,
          word,
          position: {
            x: event.clientX + window.scrollX,
            y: event.clientY + window.scrollY + 20,
          },
        }
      }, 10)
    }

    const toggleGoals = () => {
      if (isSidebarOpen.value) isSidebarOpen.value = false
      isGoalsOpen.value = !isGoalsOpen.value
    }

    const toggleSidebar = () => {
      if (isGoalsOpen.value) isGoalsOpen.value = false
      isSidebarOpen.value = !isSidebarOpen.value
    }

    watch(
      () => audioPlayer.audioElement.value,
      (newElement) => {
        if (newElement) {
          audioElementRef.value = newElement
        }
      }
    )

    onBeforeUnmount(() => {
      document.body.style.overflow = ""
      controller.abort()
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    })

    return {
      tooltip,
      recordingDuration,
      clientCanvasRef,
      audioElementRef,
      isModalInfoOpen,
      isSidebarOpen,
      isGoalsOpen,
      isLoading,
      isGoalsToggle,
      isHold,
      isReviewGenerating,
      getSelectedPrompt,
      getIsLogged,
      getIsLoading,
      getUserHistory,
      getLastModelFullAnswer,
      getLastModelTip,
      getConversationResponse,
      getUserTranslateLanguage,
      getSessionIsEnd,
      hideTooltip,
      handleWordClick,
      analyseUserConversation,
      repeatLastAudio,
      toggleGoals,
      toggleSidebar,
    }
  },
})
</script>
