import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ILanguageTopic } from "../types"
import { getTheoryByLanguageHandler } from "../api"

export const useLanguageTheoryStore = defineStore("languageTheoryStore", () => {
  const languageByTheory = ref<ILanguageTopic[]>([])
  const selectedTopic = ref<ILanguageTopic | null>(null)

  const getLanguageByTheory = computed(() => languageByTheory.value)
  const getSelectedTopic = computed(() => selectedTopic.value)

  const selectTopic = (topic: ILanguageTopic | null) => {
    selectedTopic.value = topic
  }

  const fetchTheoryByLanguage = async (language: string) => {
    await getTheoryByLanguageHandler(language)
      .then((response: ILanguageTopic[]) => {
        selectTopic(response[0])
        languageByTheory.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getLanguageByTheory,
    getSelectedTopic,
    fetchTheoryByLanguage,
    selectTopic,
  }
})
