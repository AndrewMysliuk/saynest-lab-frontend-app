import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { audioPlayer } from "@/app"
import { conversationMethod, tasksByGptModelMethod } from "../api"
import {
  IConversationResponse,
  IConversationPayload,
  IConversationHistory,
  IConversationHistoryGPT,
  IConversationHistoryTTS,
  IGPTRequest,
  IGPTMessage,
  IAnalyzedResponse,
  IAnalysisResult,
} from "../types"
import { formatCorrections } from "../lib"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const conversationResponse = ref<IConversationResponse>({ session_id: "", conversation_history: [] })
  const lastModelFullAnswer = ref<string>("")
  const lastModelTip = ref<string>("")
  const gptResponses = ref<IConversationHistoryGPT[]>([])
  const ttsResponses = ref<IConversationHistoryTTS[]>([])
  const isLoading = ref<boolean>(false)
  const gptMessage = ref<IGPTMessage>({ role: "assistant", content: "" } as IGPTMessage)
  const gptAnalyserResult = ref<IAnalysisResult>({} as IAnalysisResult)

  const getConversationResponse = computed(() => conversationResponse.value)
  const getLastModelFullAnswer = computed(() => lastModelFullAnswer.value)
  const getLastModelTip = computed(() => lastModelTip.value)
  const getGptResponses = computed(() => gptResponses.value)
  const getTtsResponses = computed(() => ttsResponses.value)
  const getIsLoading = computed(() => isLoading.value)
  const getGptMessage = computed(() => gptMessage.value)
  const getGptAnalyserResult = computed(() => gptAnalyserResult.value)

  const fetchConversation = async (payload: IConversationPayload) => {
    isLoading.value = true
    gptResponses.value = []
    ttsResponses.value = []
    setLastModelFullAnswer("")

    await conversationMethod(payload, async (data) => {
      if ("session_id" in data) {
        conversationResponse.value = data as IConversationResponse
      } else if (data.role === "user") {
        conversationResponse.value.conversation_history.push(data as IConversationHistory)
      } else if (data.role === "assistant" && "content" in data) {
        gptResponses.value.push(data as IConversationHistoryGPT)
      } else if (data.role === "assistant" && "audioChunk" in data) {
        setLastModelFullAnswer(getGptResponses.value[getGptResponses.value.length - 1]?.content)
        audioPlayer.addToQueue(data.audioChunk)
        ttsResponses.value.push(data as IConversationHistoryTTS)
      }
    })
      .then((response: IConversationResponse) => {
        conversationResponse.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const fetchConversationAnalyserByGptModel = async (payload: IGPTRequest) => {
    await tasksByGptModelMethod(payload)
      .then((response: IGPTMessage) => {
        const parseResponse = JSON.parse(response.content) as IAnalysisResult
        gptAnalyserResult.value = parseResponse
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchTasksByGptModel = async (payload: IGPTRequest) => {
    await tasksByGptModelMethod(payload)
      .then((response: IGPTMessage) => {
        gptMessage.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const setLastModelFullAnswer = (value: string) => {
    if (!value) {
      lastModelFullAnswer.value = ""
      lastModelTip.value = ""

      return
    }

    const parseResponse = JSON.parse(value) as IAnalyzedResponse

    lastModelFullAnswer.value = parseResponse?.message ?? ""
    lastModelTip.value = formatCorrections(parseResponse?.corrections) ?? ""
  }

  return {
    getConversationResponse,
    getLastModelFullAnswer,
    getLastModelTip,
    getGptResponses,
    getTtsResponses,
    getIsLoading,
    getGptMessage,
    getGptAnalyserResult,
    fetchConversation,
    fetchConversationAnalyserByGptModel,
    fetchTasksByGptModel,
    setLastModelFullAnswer,
  }
})
