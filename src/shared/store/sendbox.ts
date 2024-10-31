import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { whisperSpeachToTextMethod, conversationMethod } from "../api"
import { IConversationResponse, IConversationPayload, IWhisperResponse } from "../types"
import { animateText } from "../lib"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const whisperResponse = ref<string>("")
  const conversationResponse = ref<IConversationResponse>({} as IConversationResponse)

  const getWhisperResponse = computed(() => whisperResponse.value)
  const getConversationResponse = computed(() => conversationResponse.value)

  const fetchWhisperSpeachToText = async (audio: Blob, prompt?: string) => {
    await whisperSpeachToTextMethod(audio, prompt)
      .then((response: IWhisperResponse) => {
        animateText(response.text, (newText) => {
          whisperResponse.value = newText
        })
      })
      .catch((error: unknown) => {
        throw error
      })
  }

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
    getWhisperResponse,
    getConversationResponse,
    fetchWhisperSpeachToText,
    fetchConversation,
  }
})
