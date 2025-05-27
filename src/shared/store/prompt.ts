import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IModuleScenario, IPromptScenario } from "@/shared/types"
import { getPromptByIdHandler, getModuleScenariosHandler, getModuleListHandler } from "../api"

export const usePromptStore = defineStore("promptStore", () => {
  const moduleList = ref<IModuleScenario[]>([])
  const promptList = ref<IPromptScenario[]>([])
  const currentModule = ref<IModuleScenario>({} as IModuleScenario)
  const selectedPrompt = ref<IPromptScenario>({} as IPromptScenario)

  const getModuleList = computed(() => moduleList.value)
  const getPromptList = computed(() => promptList.value)
  const getSelectedPrompt = computed(() => selectedPrompt.value)
  const getCurrentModule = computed(() => currentModule.value)

  const setPrompt = (prompt: IPromptScenario) => {
    selectedPrompt.value = prompt
  }

  const fetchModuleList = async () => {
    await getModuleListHandler()
      .then((response: IModuleScenario[]) => {
        moduleList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchModuleScenarios = async (module_id: string) => {
    await getModuleScenariosHandler(module_id)
      .then((response: IPromptScenario[]) => {
        currentModule.value = moduleList.value.find((module) => module.id === module_id) || ({} as IModuleScenario)

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
    getModuleList,
    getCurrentModule,
    setPrompt,
    fetchModuleScenarios,
    fetchPromptById,
    fetchModuleList,
  }
})
