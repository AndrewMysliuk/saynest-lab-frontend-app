import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ITaskGeneratorRequest, ITaskGeneratorResponse } from "../types"
import { taskGeneratorHandler } from "../api"

export const useTaskGeneratorStore = defineStore("taskGeneratorStore", () => {
  const currentTask = ref<ITaskGeneratorResponse | null>(null)

  const getCurrentTask = computed(() => currentTask.value)

  const generateTask = async (payload: ITaskGeneratorRequest) => {
    await taskGeneratorHandler(payload)
      .then((response: ITaskGeneratorResponse) => {
        currentTask.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getCurrentTask,
    generateTask,
  }
})
