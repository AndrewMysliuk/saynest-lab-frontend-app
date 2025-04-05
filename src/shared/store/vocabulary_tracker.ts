import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IVocabularyJSONEntry, IWordExplanationRequest } from "../types"
import { wordAudioHandler, wordExplanationHandler, wordsListHandler } from "../api"

export const useVocabularyTrackerStore = defineStore("vocabularyTrackerStore", () => {
  const wordsList = ref<IVocabularyJSONEntry[]>([])
  const currentWord = ref<IVocabularyJSONEntry | null>(null)

  const getWordsList = computed(() => wordsList.value)
  const getCurrentWord = computed(() => currentWord.value)

  const fetchWordsList = async () => {
    await wordsListHandler()
      .then((response: IVocabularyJSONEntry[]) => {
        wordsList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchWordExplanation = async (payload: IWordExplanationRequest) => {
    await wordExplanationHandler(payload)
      .then((response: IVocabularyJSONEntry) => {
        currentWord.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchWordAudio = async (payload: IWordExplanationRequest) => {
    await wordAudioHandler(payload)
      .then((response: string) => {
        if (currentWord.value) {
          currentWord.value = {
            ...currentWord.value,
            audio_base64: response,
          }
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getWordsList,
    getCurrentWord,
    fetchWordsList,
    fetchWordExplanation,
    fetchWordAudio,
  }
})
