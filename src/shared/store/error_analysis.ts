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
  const sessionIsEnd = ref(false)

  const getLastModelTip = computed(() => lastModelTip.value)
  const getModelTips = computed(() => modelTips.value)
  const getSessionErrors = computed(() => sessionErrors.value)
  const getLastSessionError = computed(() => lastSessionError.value)
  const getSessionIsEnd = computed(() => sessionIsEnd.value)

  const resetLastModelTip = () => {
    lastModelTip.value = ""
  }

  const fetchErrorAnalysis = async (payload: IErrorAnalysisRequest) => {
    await errorAnalysisHandler(payload)
      .then((response: IErrorAnalysisEntity | null) => {
        if (response) {
          lastSessionError.value = response

          if (response.is_end) {
            sessionIsEnd.value = true
          }

          if (response.has_errors) {
            sessionErrors.value.push(response)

            const format = formatCorrections(response)
            lastModelTip.value = format
            modelTips.value.push(format)
          }
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const resetAll = () => {
    lastModelTip.value = ""
    modelTips.value = []
    lastSessionError.value = null
    sessionIsEnd.value = false
    sessionErrors.value = []
  }

  return {
    getLastModelTip,
    getModelTips,
    getSessionErrors,
    getLastSessionError,
    getSessionIsEnd,
    resetAll,
    resetLastModelTip,
    fetchErrorAnalysis,
  }
})
