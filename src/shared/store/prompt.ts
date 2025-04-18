import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPromptScenario } from "@/shared/types"
import { getPromptByIdHandler, getPromptsListHandler } from "../api"

export const usePromptStore = defineStore("promptStore", () => {
  const promptList = ref<IPromptScenario[]>([])
  const selectedPrompt = ref<IPromptScenario>({} as IPromptScenario)

  const getPromptList = computed(() => promptList.value)
  const getSelectedPrompt = computed(() => selectedPrompt.value)

  const setPrompt = (prompt: IPromptScenario) => {
    selectedPrompt.value = prompt
  }

  const fetchPromptsList = async () => {
    await getPromptsListHandler()
      .then((response: IPromptScenario[]) => {
        promptList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchPromptById = async (id: string) => {
    await getPromptByIdHandler(id)
      .then((response: IPromptScenario) => {
        selectedPrompt.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getPromptList,
    getSelectedPrompt,
    setPrompt,
    fetchPromptsList,
    fetchPromptById,
  }
})
