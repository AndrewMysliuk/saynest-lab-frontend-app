<template>
  <div
    class="room"
    :class="{ '--sidebar-opened': isSidebarOpen, '--goals-opened': isGoalsOpen, '--is-word-info': getIsWordModalOpen && isDesktop, '--is-notification': getIsExpiredVisible || getIsTrialVisible }"
  >
    <transition name="slide-left">
      <ConversationSidebar v-if="isSidebarOpen" />
    </transition>

    <transition name="slide-left">
      <div v-if="isGoalsOpen && getSelectedPrompt?.user_content?.goals" class="absolute top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-6 shadow-xl overflow-y-auto z-20">
        <h2 class="text-xl font-bold text-gray-800 mb-6">
          {{ t("conversation.goals.title") }}
        </h2>

        <div v-for="(goal, index) in getSelectedPrompt.user_content.goals" :key="index" class="mb-4">
          <details class="group">
            <summary class="cursor-pointer text-base font-medium text-text-base transition hover:text-primary">• {{ goal.phrase }}</summary>
            <p class="ml-4 mt-1 text-sm text-gray-500">{{ resolveTranslation(goal.translation) }}</p>
          </details>
        </div>
      </div>
    </transition>

    <div class="room__body">
      <div class="conversation" v-if="!isReviewGenerating">
        <div class="absolute top-4 left-0 z-10 flex gap-2">
          <button @click="goToDashboard" class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm font-medium">
            {{ t("conversation.actions.backToDashboard") }}
          </button>
        </div>

        <div class="absolute top-4 right-0 md:right-4 z-10 flex gap-2">
          <button @click="handleReviewModalToggle" class="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm font-semibold">
            {{ t("conversation.actions.review") }}
          </button>

          <button
            v-if="getConversationResponse?.conversation_history?.length"
            @click="toggleSidebar"
            id="CONVERSATION_HISTORY_CLICKED"
            class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm font-medium"
          >
            {{ t("conversation.actions.toggleHistory") }}
          </button>

          <button
            id="CONVERSATION_GOALS_CLICKED"
            @click="toggleGoals"
            class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm font-medium"
          >
            {{ t("conversation.actions.toggleGoals") }}
          </button>
        </div>

        <div class="conversation__description" v-if="getLastModelFullAnswer">
          <p class="--cursor">
            <TheInteractiveText :text="getLastModelFullAnswer" @click-word="handleWordClick" @select-text="handleWordSelection" />
          </p>
        </div>

        <TheLoader v-else-if="isLoading" :message="t('conversation.loader.processingRecording')" />

        <div class="conversation__info --left" @click="openModalInfo">
          <i class="fa-regular fa-circle-question" />
        </div>

        <div class="conversation__info --left-second" v-if="!getIsLoading" @click="repeatLastAudio">
          <i class="fa-solid fa-repeat" />
        </div>

        <div class="conversation__visualization --client" v-if="isHold">
          <canvas ref="clientCanvasRef" />
        </div>

        <div v-if="!isLoading && getConversationResponse?.conversation_history?.length" class="conversation__visualization --prompt flex justify-center items-center gap-6 mt-4">
          <button
            v-if="!isHold"
            @click="startRecordingFromButton"
            class="w-16 h-16 rounded-full bg-indigo-600 text-white text-xl flex items-center justify-center shadow-md"
            :title="t('conversation.recorder.startTitle')"
          >
            <i class="fa-solid fa-microphone" />
          </button>

          <div v-if="isHold" class="min-w-[48px] text-right text-sm text-gray-600 font-medium">{{ recordingDuration }}s</div>

          <button
            v-if="isHold"
            @click="stopRecordingFromButton"
            class="w-16 h-16 rounded-full bg-orange-500 text-white text-xl flex items-center justify-center shadow-md relative"
            :title="t('conversation.recorder.stopTitle')"
          >
            <i class="fa-solid fa-stop" />
          </button>

          <button
            v-if="isHold"
            @click="cancelRecordingFromButton"
            class="w-10 h-10 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition flex items-center justify-center"
            :title="t('conversation.recorder.cancelTitle')"
          >
            <i class="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      <TheLoader v-else :message="t('conversation.loader.reviewInProgress')" />
    </div>

    <v-modal v-model="isModalInfoOpen" is-curtain :is-slide-out-bottom="!isDesktop">
      <InfoModal @close="isModalInfoOpen = false" />
    </v-modal>

    <v-modal v-model="isReviewModalOpen">
      <TheConfirmation is-info :title="t('conversation.reviewModal.title')" :description="t('conversation.reviewModal.desc')" @accept="analyseUserConversation" @cancel="isReviewModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, onBeforeMount, watch, defineAsyncComponent } from "vue"
import { useI18n } from "vue-i18n"
import { conversationStore, audioPlayer, urlAudioPlayer, promptStore, errorAnalysisStore, communicationReviewStore, authStore, userStore, orgStore, subscriptionStore, vocabularyStore } from "@/app"
import { useRouter } from "vue-router"
import { TheConfirmation, TheLoader, TheInteractiveText } from "@/shared/components"
import { retryWithAdaptiveParams } from "@/shared/utils"
import { useMicrophone, initializeCanvasForConversation, isLg } from "@/shared/lib"
import { SessionTypeEnum } from "@/shared/types"
import { createSessionHandler } from "@/shared/api"
import startRecordEn from "@/shared/assets/records/start_record_en.wav"
import startRecordBg from "@/shared/assets/records/start_record_bg.wav"
import startRecordDe from "@/shared/assets/records/start_record_de.wav"
import startRecordEs from "@/shared/assets/records/start_record_es.wav"
import startRecordPt from "@/shared/assets/records/start_record_pt.wav"
import startRecordFr from "@/shared/assets/records/start_record_fr.wav"
import startRecordPl from "@/shared/assets/records/start_record_pl.wav"
import startRecordUk from "@/shared/assets/records/start_record_uk.wav"
import startRecordIt from "@/shared/assets/records/start_record_it.wav"
import LanguagesList from "@/shared/json_data/languages.json"

const FILE_LANGUAGE = [
  {
    file: startRecordEn,
    language: "English",
  },
  {
    file: startRecordBg,
    language: "Bolgarian",
  },
  {
    file: startRecordDe,
    language: "German",
  },
  {
    file: startRecordEs,
    language: "Spanish",
  },
  {
    file: startRecordPt,
    language: "Portuguese",
  },
  {
    file: startRecordFr,
    language: "French",
  },
  {
    file: startRecordPl,
    language: "Polish",
  },
  {
    file: startRecordUk,
    language: "Ukrainian",
  },
  {
    file: startRecordIt,
    language: "Italian",
  },
]

export default defineComponent({
  components: {
    ConversationSidebar: defineAsyncComponent(() => import("./ui/ConversationSidebar")),
    InfoModal: defineAsyncComponent(() => import("./ui/InfoModal")),
    TheLoader,
    TheInteractiveText,
    TheConfirmation,
  },

  setup() {
    const { t, locale } = useI18n()
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
    const isReviewModalOpen = ref<boolean>(false)
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []
    let cleanupCanvas: (() => void) | null = null
    const recordingDuration = ref<number>(0)
    let recordingTimer: number | null = null
    const isDesktop = ref<boolean>(isLg())

    const getIsLogged = computed(() => authStore.getIsLogged)
    const getIsLoading = computed(() => conversationStore.getIsLoading)
    const getConversationResponse = computed(() => conversationStore.getConversationResponse)
    const getUserHistory = computed(() => getConversationResponse.value.conversation_history?.filter((item) => item.role === "user"))
    const getLastModelAudioUrl = computed(() => conversationStore.getLastModelAudioUrl)
    const getLastModelFullAnswer = computed(() => conversationStore.getLastModelFullAnswer)
    const getLastModelTip = computed(() => errorAnalysisStore.getLastModelTip)
    const getSessionIsEnd = computed(() => errorAnalysisStore.getSessionIsEnd)
    const getSelectedPrompt = computed(() => promptStore.getCurrentPrompt)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)
    const getUserTranslateLanguage = computed(() => (locale.value ? locale.value : userStore.getCurrentUser?.explanation_language || "en"))
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getIsExpiredVisible = computed(() => subscriptionStore.getIsExpiredVisible)
    const getIsTrialVisible = computed(() => subscriptionStore.getIsTrialVisible)
    const getIsWordModalOpen = computed(() => vocabularyStore.getIsWordModalOpen)

    onBeforeMount(async () => {
      if (!Object.keys(getSelectedPrompt.value)?.length) {
        setTimeout(() => {
          router.push({ name: "platform.dashboard" })
        }, 100)
      } else {
        conversationStore.resetAll()
        errorAnalysisStore.resetAll()

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
          isReviewModalOpen.value = false
          isReviewGenerating.value = true

          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event: "SCENARIO_COMPLETED",
            scenario_name: getSelectedPrompt.value.name,
            scenario_id: getSelectedPrompt.value._id,
            user_id: getCurrentUser.value?._id,
          })

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
            name: "platform.history",
            params: { id: getCurrentReview.value?._id },
          })
        } catch (error) {
          console.error("Error analysing user conversation:", error)
        } finally {
          isReviewGenerating.value = false
          orgStore.updateTrialUsage("review")
        }
      }
    }

    const repeatLastAudio = async () => {
      // if (!audioElementRef.value) return

      // audioElementRef.value.pause()
      // audioElementRef.value.currentTime = 0
      // audioElementRef.value.play()
      urlAudioPlayer.playUrl(getLastModelAudioUrl.value)
    }

    const simulateGreeting = async () => {
      try {
        const targetFileLanguage = FILE_LANGUAGE.find((item) => item.language === getSelectedPrompt.value.meta.target_language)

        if (!targetFileLanguage) throw new Error("missing greeting audio file")

        const response = await fetch(targetFileLanguage?.file)
        const audioBlob = await response.blob()

        if (!audioBlob) return

        isLoading.value = true

        const { _id } = await createSessionHandler({
          type: SessionTypeEnum.SPEACKING,
          prompt_id: getSelectedPrompt.value?._id,
          active_ielts_part: getSelectedPrompt.value?.meta?.active_ielts_part,
        })

        orgStore.updateTrialUsage("session")

        await conversationStore.fetchConversation(
          {
            whisper: { audio_file: audioBlob },
            gpt_model: { model: "gpt-4o", max_tokens: 350 },
            // tts: { model: "tts-1", voice: "nova", response_format: "mp3" },
            // tts: { voice: "EXAVITQu4vr4xnSDxMaL", model: "eleven_flash_v2_5", voice_settings: { stability: 0.5, similarity_boost: 0.6 } },
            tts: { response_format: "mp3", language_code: "" },
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
        recordingDuration.value = 0
        e.preventDefault()
        isHold.value = true
        isCancelled.value = false
        // audioPlayer.interruptAndClear()
        urlAudioPlayer.stop()
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

    const startRecordingFromButton = async () => {
      if (!isHold.value && !isLoading.value) {
        recordingDuration.value = 0
        isHold.value = true
        isCancelled.value = false
        // audioPlayer.interruptAndClear()
        urlAudioPlayer.stop()
        await startRecording()
      }
    }

    const stopRecordingFromButton = async () => {
      if (isHold.value) {
        isCancelled.value = false
        await stopRecording()
        isHold.value = false
      }
    }

    const cancelRecordingFromButton = async () => {
      if (isHold.value) {
        isCancelled.value = true
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

        mediaRecorder = new MediaRecorder(mediaStream)
        // { mimeType: "audio/webm;codecs=opus" }

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
                // tts: { model: "tts-1", voice: "nova", response_format: "mp3" },
                // tts: { voice: "EXAVITQu4vr4xnSDxMaL", model: "eleven_flash_v2_5", voice_settings: { stability: 0.5, similarity_boost: 0.6 } },
                tts: { response_format: "mp3", language_code: "" },
                system: {
                  session_id: getConversationResponse.value?.session_id ?? "",
                  prompt_id: getSelectedPrompt.value?._id,
                },
                target_language: getSelectedPrompt.value.meta.target_language,
                explanation_language: getUserTranslateLanguage.value,
              },
              controller.signal
            )

            retryWithAdaptiveParams(
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
                signal: controller.signal,
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

        recordingTimer = window.setInterval(async () => {
          recordingDuration.value = Math.floor((Date.now() - recordingStartTime) / 1000)

          const isIelts = getSelectedPrompt.value.meta.is_it_ielts
          const durationValue = isIelts ? 180 : 60

          if (recordingDuration.value >= durationValue && isHold.value) {
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

    const toggleGoals = () => {
      if (isSidebarOpen.value) isSidebarOpen.value = false
      isGoalsOpen.value = !isGoalsOpen.value
    }

    const toggleSidebar = () => {
      if (isGoalsOpen.value) isGoalsOpen.value = false
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const handleReviewModalToggle = () => {
      if (!getIsLogged.value) return

      if (getUserHistory.value?.length > getSelectedPrompt.value?.meta?.max_turns || getSessionIsEnd.value) {
        analyseUserConversation()
        return
      }

      isReviewModalOpen.value = true
    }

    const goToDashboard = () => {
      conversationStore.resetAll()
      errorAnalysisStore.resetAll()
      urlAudioPlayer.stop()

      router.push({ name: "platform.dashboard" })
    }

    const handleWordClick = async (word: string) => {
      if (!word) return

      try {
        isSidebarOpen.value = false
        isGoalsOpen.value = false

        vocabularyStore.setSelectedPhrase("")
        vocabularyStore.setIsWordModalOpen(true)

        const languageISO = LanguagesList.find((item) => item.language === getSelectedPrompt.value.meta.target_language)?.language_iso || "en"

        await vocabularyStore.lookupWordMethod({
          word,
          target_language: languageISO,
          native_language: getUserTranslateLanguage.value,
        })
      } catch (error: unknown) {
        vocabularyStore.setIsWordModalOpen(false)
      }
    }

    const handleWordSelection = (phrase: string) => {
      isSidebarOpen.value = false
      isGoalsOpen.value = false

      vocabularyStore.setSelectedWord(null)
      vocabularyStore.setSelectedPhrase(phrase)
      vocabularyStore.setIsWordModalOpen(true)
    }

    const openModalInfo = () => {
      vocabularyStore.setIsWordModalOpen(false)
      isModalInfoOpen.value = true
    }

    const resolveTranslation = (t: string | Record<string, string> | undefined) => {
      if (!t) return ""
      if (typeof t === "string") return t
      return t[getUserTranslateLanguage.value] || ""
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
      vocabularyStore.setIsWordModalOpen(false)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    })

    return {
      recordingDuration,
      isDesktop,
      clientCanvasRef,
      audioElementRef,
      getIsWordModalOpen,
      isModalInfoOpen,
      isReviewModalOpen,
      isSidebarOpen,
      isGoalsOpen,
      isLoading,
      isGoalsToggle,
      isHold,
      isReviewGenerating,
      getSelectedPrompt,
      getIsLoading,
      getUserHistory,
      getLastModelFullAnswer,
      getLastModelTip,
      getConversationResponse,
      getUserTranslateLanguage,
      getIsExpiredVisible,
      getIsTrialVisible,
      openModalInfo,
      goToDashboard,
      handleWordClick,
      handleWordSelection,
      startRecordingFromButton,
      stopRecordingFromButton,
      cancelRecordingFromButton,
      handleReviewModalToggle,
      analyseUserConversation,
      repeatLastAudio,
      toggleGoals,
      toggleSidebar,
      resolveTranslation,
      t,
    }
  },
})
</script>
