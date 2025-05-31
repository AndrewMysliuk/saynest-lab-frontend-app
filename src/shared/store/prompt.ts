import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IModuleFilters, IModuleParams, IModuleScenarioEntity, IPromptFilters, IPromptParams, IPromptScenarioEntity } from "@/shared/types"
import { getScenarioByIdHandler, listScenariosHandler, getModuleScenariosHandler, listModulesHandler } from "../api"

export const usePromptStore = defineStore("promptStore", () => {
  const moduleList = ref<IModuleScenarioEntity[]>([])
  const promptList = ref<IPromptScenarioEntity[]>([])
  const modulePromptList = ref<IPromptScenarioEntity[]>([])
  const currentModule = ref<IModuleScenarioEntity>({} as IModuleScenarioEntity)
  const currentPrompt = ref<IPromptScenarioEntity>({} as IPromptScenarioEntity)
  const moduleParams = ref<IModuleParams>({
    offset: 0,
    limit: 20,
    hasMore: true,
    isLoading: false,
  })
  const promptParams = ref<IPromptParams>({
    offset: 0,
    limit: 20,
    hasMore: true,
    isLoading: false,
  })

  const getModuleList = computed(() => moduleList.value)
  const getPromptList = computed(() => promptList.value)
  const getModulePromptList = computed(() => modulePromptList.value)
  const getCurrentPrompt = computed(() => currentPrompt.value)
  const getCurrentModule = computed(() => currentModule.value)
  const getModuleParams = computed(() => moduleParams.value)
  const getPromptParams = computed(() => promptParams.value)

  const setPrompt = (prompt: IPromptScenarioEntity) => {
    currentPrompt.value = prompt
  }

  const resetModuleParams = () => {
    moduleParams.value = {
      offset: 0,
      limit: 20,
      hasMore: true,
      isLoading: false,
    }
  }

  const resetPromptParams = () => {
    promptParams.value = {
      offset: 0,
      limit: 20,
      hasMore: true,
      isLoading: false,
    }
  }

  const fetchScenariosList = async (isLoadMore = false, query?: IPromptFilters) => {
    try {
      if (promptParams.value.isLoading) return

      promptParams.value.isLoading = true

      if (!isLoadMore) {
        promptList.value = []
        resetPromptParams()
      }

      const limit = query?.limit ?? promptParams.value.limit
      const offset = query?.offset ?? promptParams.value.offset

      const response = await listScenariosHandler({
        ...query,
        limit,
        offset,
      })

      if (isLoadMore) {
        promptList.value = [...promptList.value, ...response]
      } else {
        promptList.value = response
      }

      promptParams.value.offset = offset + limit
      promptParams.value.hasMore = response.length === limit
    } catch (error) {
      console.error("fetchScenariosList error:", error)
    } finally {
      promptParams.value.isLoading = false
    }
  }

  const fetchModuleList = async (isLoadMore = false, query?: IModuleFilters) => {
    try {
      if (moduleParams.value.isLoading) return

      moduleParams.value.isLoading = true

      if (!isLoadMore) {
        moduleList.value = []
        resetModuleParams()
      }

      const limit = query?.limit ?? moduleParams.value.limit
      const offset = query?.offset ?? moduleParams.value.offset

      const response = await listModulesHandler({
        ...query,
        limit,
        offset,
      })

      if (isLoadMore) {
        moduleList.value = [...moduleList.value, ...response]
      } else {
        moduleList.value = response
      }

      moduleParams.value.offset = offset + limit
      moduleParams.value.hasMore = response.length === limit
    } catch (error) {
      console.error("fetchModuleList error:", error)
    } finally {
      moduleParams.value.isLoading = false
    }
  }

  const fetchModuleScenarios = async (module_id: string) => {
    await getModuleScenariosHandler(module_id)
      .then((response: IPromptScenarioEntity[]) => {
        currentModule.value = moduleList.value.find((module) => module._id === module_id) || ({} as IModuleScenarioEntity)

        modulePromptList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchPromptById = async (id: string) => {
    await getScenarioByIdHandler(id)
      .then((response: IPromptScenarioEntity) => {
        currentPrompt.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getPromptList,
    getCurrentPrompt,
    getModuleList,
    getCurrentModule,
    getModulePromptList,
    getModuleParams,
    getPromptParams,
    setPrompt,
    resetModuleParams,
    resetPromptParams,
    fetchScenariosList,
    fetchModuleScenarios,
    fetchPromptById,
    fetchModuleList,
  }
})
