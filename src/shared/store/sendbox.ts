import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { whisperSpeachToTextMethod } from "../api"
import { IWhisperResponse } from "../types"
import { animateText } from "../lib"

export const useSendboxStore = defineStore("sendboxStore", () => {
  const whisperResponse = ref<string>("")

  const getWhisperResponse = computed(() => whisperResponse.value)

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

  return {
    getWhisperResponse,
    fetchWhisperSpeachToText,
  }
})
