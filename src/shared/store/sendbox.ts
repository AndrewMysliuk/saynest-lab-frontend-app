import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { audioPlayer } from "@/app"
import { conversationMethod } from "../api"
import { IConversationResponse, IConversationPayload, IConversationHistory, IConversationHistoryGPT, IConversationHistoryTTS } from "../types"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const conversationResponse = ref<IConversationResponse>({ session_id: "", conversation_history: [] })
  const gptResponses = ref<IConversationHistoryGPT[]>([])
  const ttsResponses = ref<IConversationHistoryTTS[]>([])
  const isLoading = ref<boolean>(false)

  const getConversationResponse = computed(() => conversationResponse.value)
  const getGptResponses = computed(() => gptResponses.value)
  const getTtsResponses = computed(() => ttsResponses.value)
  const getIsLoading = computed(() => isLoading.value)

  const fetchConversation = async (payload: IConversationPayload) => {
    isLoading.value = true
    gptResponses.value = []
    ttsResponses.value = []

    await conversationMethod(payload, (data) => {
      console.log(data)

      if ("session_id" in data) {
        conversationResponse.value = data as IConversationResponse
      } else if (data.role === "user") {
        conversationResponse.value.conversation_history.push(data as IConversationHistory)
      } else if (data.role === "assistant" && "content" in data) {
        gptResponses.value.push(data as IConversationHistoryGPT)
      } else if (data.role === "assistant" && "audioChunk" in data) {
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

  return {
    getConversationResponse,
    getGptResponses,
    getTtsResponses,
    getIsLoading,
    fetchConversation,
  }
})
