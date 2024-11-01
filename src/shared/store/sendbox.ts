import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { conversationMethod } from "../api"
import { IConversationResponse, IConversationPayload } from "../types"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const conversationResponse = ref<IConversationResponse>({} as IConversationResponse)

  const getConversationResponse = computed(() => conversationResponse.value)

  const fetchConversation = async (payload: IConversationPayload) => {
    await conversationMethod(payload)
      .then((response: IConversationResponse) => {
        conversationResponse.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getConversationResponse,
    fetchConversation,
  }
})
