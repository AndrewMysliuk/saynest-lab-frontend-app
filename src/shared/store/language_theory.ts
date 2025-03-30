import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ILanguageTopic } from "../types"
import { getTheoryByLanguageHandler } from "../api"

export const useLanguageTheoryStore = defineStore("languageTheoryStore", () => {
  const languageByTheory = ref<ILanguageTopic[]>([])

  const getLanguageByTheory = computed(() => languageByTheory.value)

  const fetchTheoryByLanguage = async (language: string) => {
    await getTheoryByLanguageHandler(language)
      .then((response: ILanguageTopic[]) => {
        languageByTheory.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getLanguageByTheory,
    fetchTheoryByLanguage,
  }
})
