import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IVocabularyEntity, IWordExplanationRequest } from "../types"
import { wordAudioHandler, wordExplanationHandler, wordsListHandler } from "../api"

export const useVocabularyTrackerStore = defineStore("vocabularyTrackerStore", () => {
  const wordsList = ref<IVocabularyEntity[]>([])
  const currentWord = ref<IVocabularyEntity | null>(null)

  const getWordsList = computed(() => wordsList.value)
  const getCurrentWord = computed(() => currentWord.value)

  const fetchWordsList = async () => {
    await wordsListHandler()
      .then((response: IVocabularyEntity[]) => {
        wordsList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchWordExplanation = async (payload: IWordExplanationRequest) => {
    const existing = wordsList.value.find((item) => item.word.toLowerCase() === payload.word.toLowerCase())

    if (existing) {
      currentWord.value = existing
      return existing
    }

    await wordExplanationHandler(payload)
      .then((response: IVocabularyEntity) => {
        currentWord.value = response

        wordsList.value.push(response)
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchWordAudio = async (payload: IWordExplanationRequest) => {
    if (currentWord.value?.audio_base64) {
      return
    }

    await wordAudioHandler(payload)
      .then((response: string) => {
        if (currentWord.value) {
          currentWord.value = {
            ...currentWord.value,
            audio_base64: response,
          }

          wordsList.value = wordsList.value.map((item) => (item._id === currentWord.value?._id ? { ...item, audio_base64: response } : item))
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
