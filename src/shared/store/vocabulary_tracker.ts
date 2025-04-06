import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ISearchSynonymsRequest, IVocabularyJSONEntry, IWordExplanationRequest } from "../types"
import { searchWordsSynonymsHandler, wordAudioHandler, wordExplanationHandler, wordsListHandler } from "../api"

export const useVocabularyTrackerStore = defineStore("vocabularyTrackerStore", () => {
  const wordsList = ref<IVocabularyJSONEntry[]>([])
  const currentWord = ref<IVocabularyJSONEntry | null>(null)
  const recomendedWords = ref<IVocabularyJSONEntry[]>([])

  const getWordsList = computed(() => wordsList.value)
  const getCurrentWord = computed(() => currentWord.value)
  const getRecomendedWords = computed(() => recomendedWords.value)

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

  const fetchWordsSynonyms = async (payload: ISearchSynonymsRequest) => {
    await searchWordsSynonymsHandler(payload)
      .then((response: IVocabularyJSONEntry[]) => {
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
