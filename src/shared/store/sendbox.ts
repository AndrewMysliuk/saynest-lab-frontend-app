import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { audioPlayer } from "@/app"
import { conversationMethod, tasksByGptModelMethod } from "../api"
import { IConversationResponse, IConversationPayload, IConversationHistory, IConversationHistoryGPT, IConversationHistoryTTS, IGPTRequest, IGPTMessage } from "../types"
import { parseCorrection, removeCorrections } from "../lib"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const conversationResponse = ref<IConversationResponse>({ session_id: "", conversation_history: [] })
  const lastModelFullAnswer = ref<string>("")
  const lastModelTip = ref<string>("")
  const gptResponses = ref<IConversationHistoryGPT[]>([])
  const ttsResponses = ref<IConversationHistoryTTS[]>([])
  const isLoading = ref<boolean>(false)
  const gptMessage = ref<IGPTMessage>({ role: "assistant", content: "" } as IGPTMessage)

  const getConversationResponse = computed(() => conversationResponse.value)
  const getLastModelFullAnswer = computed(() => lastModelFullAnswer.value)
  const getLastModelTip = computed(() => lastModelTip.value)
  const getGptResponses = computed(() => gptResponses.value)
  const getTtsResponses = computed(() => ttsResponses.value)
  const getIsLoading = computed(() => isLoading.value)
  const getGptMessage = computed(() => gptMessage.value)

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

  const fetchTasksByGptModel = async (payload: IGPTRequest) => {
    isLoading.value = true

    await tasksByGptModelMethod(payload, (data) => data)
      .then((response: IGPTMessage) => {
        gptMessage.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const setLastModelFullAnswer = (value: string) => {
    lastModelFullAnswer.value = removeCorrections(value)
    lastModelTip.value = parseCorrection(value)
  }

  return {
    getConversationResponse,
    getLastModelFullAnswer,
    getLastModelTip,
    getGptResponses,
    getTtsResponses,
    getIsLoading,
    getGptMessage,
    fetchConversation,
    fetchTasksByGptModel,
    setLastModelFullAnswer,
  }
})
