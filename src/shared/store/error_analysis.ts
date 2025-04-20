import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { formatCorrections } from "../lib"
import { IErrorAnalysisEntity, IErrorAnalysisRequest } from "../types"
import { errorAnalysisHandler } from "../api"

export const useErrorAnalysisStore = defineStore("errorAnalysisStore", () => {
  const lastModelTip = ref<string>("")
  const modelTips = ref<string[]>([])
  const lastSessionError = ref<IErrorAnalysisEntity | null>(null)
  const sessionErrors = ref<IErrorAnalysisEntity[]>([])

  const getLastModelTip = computed(() => lastModelTip.value)
  const getModelTips = computed(() => modelTips.value)
  const getSessionErrors = computed(() => sessionErrors.value)
  const getLastSessionError = computed(() => lastSessionError.value)

  const resetLastModelTip = () => {
    lastModelTip.value = ""
  }

  const fetchErrorAnalysis = async (payload: IErrorAnalysisRequest) => {
    await errorAnalysisHandler(payload)
      .then((response: IErrorAnalysisEntity | null) => {
        if (response && response.has_errors) {
          sessionErrors.value.push(response)
          lastSessionError.value = response

          const format = formatCorrections(response)
          lastModelTip.value = format
          modelTips.value.push(format)
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getLastModelTip,
    getModelTips,
    getSessionErrors,
    getLastSessionError,
    resetLastModelTip,
    fetchErrorAnalysis,
  }
})
