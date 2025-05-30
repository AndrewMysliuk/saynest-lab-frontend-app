import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IModuleFilters, IModuleScenarioEntity, IPromptScenarioEntity } from "@/shared/types"
import { getScenarioByIdHandler, getModuleScenariosHandler, listModulesHandler } from "../api"

export const usePromptStore = defineStore("promptStore", () => {
  const moduleList = ref<IModuleScenarioEntity[]>([])
  const promptList = ref<IPromptScenarioEntity[]>([])
  const currentModule = ref<IModuleScenarioEntity>({} as IModuleScenarioEntity)
  const selectedPrompt = ref<IPromptScenarioEntity>({} as IPromptScenarioEntity)

  const getModuleList = computed(() => moduleList.value)
  const getPromptList = computed(() => promptList.value)
  const getSelectedPrompt = computed(() => selectedPrompt.value)
  const getCurrentModule = computed(() => currentModule.value)

  const setPrompt = (prompt: IPromptScenarioEntity) => {
    selectedPrompt.value = prompt
  }

  const fetchModuleList = async (query?: IModuleFilters) => {
    await listModulesHandler(query)
      .then((response: IModuleScenarioEntity[]) => {
        moduleList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchModuleScenarios = async (module_id: string) => {
    await getModuleScenariosHandler(module_id)
      .then((response: IPromptScenarioEntity[]) => {
        currentModule.value = moduleList.value.find((module) => module._id === module_id) || ({} as IModuleScenarioEntity)

        promptList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchPromptById = async (id: string) => {
    await getScenarioByIdHandler(id)
      .then((response: IPromptScenarioEntity) => {
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
