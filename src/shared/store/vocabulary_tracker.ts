import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ISearchSynonymsRequest, IVocabularyEntity, IWordExplanationRequest } from "../types"
import { searchWordsSynonymsHandler, wordAudioHandler, wordExplanationHandler, wordsListHandler } from "../api"

export const useVocabularyTrackerStore = defineStore("vocabularyTrackerStore", () => {
  const wordsList = ref<IVocabularyEntity[]>([])
  const currentWord = ref<IVocabularyEntity | null>(null)
  const recomendedWords = ref<IVocabularyEntity[]>([])

  const getWordsList = computed(() => wordsList.value)
  const getCurrentWord = computed(() => currentWord.value)
  const getRecomendedWords = computed(() => recomendedWords.value)

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

  const fetchWordsSynonyms = async (payload: ISearchSynonymsRequest) => {
    await searchWordsSynonymsHandler(payload)
      .then((response: IVocabularyEntity[]) => {
        const newWords = response.filter((item) => !recomendedWords.value.some((entry) => entry.word.toLowerCase() === item.word.toLowerCase()))
        recomendedWords.value = [...recomendedWords.value, ...newWords]
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getWordsList,
    getCurrentWord,
    getRecomendedWords,
    fetchWordsList,
    fetchWordExplanation,
    fetchWordAudio,
    fetchWordsSynonyms,
  }
})
