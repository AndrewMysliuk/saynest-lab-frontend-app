import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ITaskGeneratorRequest, ITaskGeneratorResponse } from "../types"
import { taskGeneratorHandler } from "../api"

export const useTaskGeneratorStore = defineStore("taskGeneratorStore", () => {
  const currentTask = ref<ITaskGeneratorResponse | null>(null)

  const getCurrentTask = computed(() => currentTask.value)

  const generateTask = async (payload: ITaskGeneratorRequest) => {
    localStorage.removeItem("TASK_RESPONSE")
    currentTask.value = null

    await taskGeneratorHandler(payload)
      .then((response: ITaskGeneratorResponse) => {
        currentTask.value = response

        localStorage.setItem("TASK_RESPONSE", JSON.stringify(response))
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const parseCurrentTask = () => {
    const task = localStorage.getItem("TASK_RESPONSE")

    if (task) {
      currentTask.value = JSON.parse(task)
    }
  }

  return {
    getCurrentTask,
    generateTask,
    parseCurrentTask,
  }
})
