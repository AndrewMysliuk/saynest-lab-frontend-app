import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { audioPlayer } from "@/app"
import { createConversationHandler } from "../api"
import { IConversationResponse, IConversationPayload, ITextAnalysisResponse, StreamEventEnum, ConversationShortResponse } from "../types"

export const useConversationStore = defineStore("conversationStore", () => {
  const conversationResponse = ref<IConversationResponse>({ session_id: "", conversation_history: [], last_model_response: {} as ITextAnalysisResponse })
  const lastModelFullAnswer = ref<string>("")
  const gptResponses = ref<ConversationShortResponse[]>([])
  const isLoading = ref<boolean>(false)

  const getConversationResponse = computed(() => conversationResponse.value)
  const getLastModelFullAnswer = computed(() => lastModelFullAnswer.value)
  const getGptResponses = computed(() => gptResponses.value)
  const getIsLoading = computed(() => isLoading.value)

  const fetchConversation = async (payload: IConversationPayload) => {
    isLoading.value = true
    gptResponses.value = []
    setLastModelFullAnswer("")

    await createConversationHandler(payload, (data) => {
      switch (data.type) {
        case StreamEventEnum.TRANSCRIPTION:
          gptResponses.value.push({ type: data.type, role: data.role, content: data.content, audio_url: data.audio_url })
          break
        case StreamEventEnum.GPT_RESPONSE:
          gptResponses.value.push({ type: data.type, role: data.role, content: data.content })
          break
        case StreamEventEnum.TTS_CHUNK:
          setLastModelFullAnswer(getGptResponses.value.at(-1)?.content ?? null)
          audioPlayer.addToQueue(data.audioChunk)
          break
        case StreamEventEnum.ERROR:
          console.error("AI Error:", data.content)
          break
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

  const setLastModelFullAnswer = (value: string | null) => {
    if (!value) {
      lastModelFullAnswer.value = ""
      return
    }

    lastModelFullAnswer.value = value
  }

  return {
    getConversationResponse,
    getLastModelFullAnswer,
    getGptResponses,
    getIsLoading,
    fetchConversation,
    setLastModelFullAnswer,
  }
})
