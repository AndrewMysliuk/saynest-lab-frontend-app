import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { audioPlayer } from "@/app"
import { createConversationHandler } from "../api"
import { IConversationResponse, IConversationPayload, IConversationHistory, IConversationHistoryGPT, ITextAnalysisResponse } from "../types"
import { formatCorrections } from "../lib"

export const useConversationStore = defineStore("conversationStore", () => {
  const conversationResponse = ref<IConversationResponse>({ session_id: "", conversation_history: [], last_model_response: {} as ITextAnalysisResponse, error_analyser_response: null })
  const lastModelFullAnswer = ref<string>("")
  const lastModelTip = ref<string>("")
  const gptResponses = ref<IConversationHistoryGPT[]>([])
  const isLoading = ref<boolean>(false)

  const getConversationResponse = computed(() => conversationResponse.value)
  const getLastModelFullAnswer = computed(() => lastModelFullAnswer.value)
  const getLastModelTip = computed(() => lastModelTip.value)
  const getGptResponses = computed(() => gptResponses.value)
  const getIsLoading = computed(() => isLoading.value)

  const fetchConversation = async (payload: IConversationPayload) => {
    isLoading.value = true
    gptResponses.value = []
    lastModelTip.value = ""
    setLastModelFullAnswer("")

    await createConversationHandler(payload, async (data) => {
      if (data.role === "user") {
        conversationResponse.value.conversation_history.push(data as IConversationHistory)
      } else if (data.role === "assistant" && "content" in data) {
        gptResponses.value.push(data as IConversationHistoryGPT)
      } else if (data.role === "assistant" && "audio_chunk" in data) {
        setLastModelFullAnswer(getGptResponses.value[getGptResponses.value.length - 1]?.content)
        audioPlayer.addToQueue(data.audio_chunk)
      }
    })
      .then((response: IConversationResponse) => {
        conversationResponse.value = response

        if (response.error_analyser_response) {
          lastModelTip.value = formatCorrections(response.error_analyser_response)
        }
      })
      .catch((error: unknown) => {
        throw error
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const setLastModelFullAnswer = (value: string) => {
    if (!value) {
      lastModelFullAnswer.value = ""
      return
    }

    lastModelFullAnswer.value = value
  }

  return {
    getConversationResponse,
    getLastModelFullAnswer,
    getLastModelTip,
    getGptResponses,
    getIsLoading,
    fetchConversation,
    setLastModelFullAnswer,
  }
})
