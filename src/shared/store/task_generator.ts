import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IGenericTaskEntity, ITaskGeneratorRequest } from "../types"
import { getTaskHandler, listByReviewHandler, setCompletedHandler, taskGeneratorHandler } from "../api"

export const useTaskGeneratorStore = defineStore("taskGeneratorStore", () => {
  const tasksList = ref<IGenericTaskEntity[]>([])
  const currentTask = ref<IGenericTaskEntity | null>(null)

  const getTasksList = computed(() => tasksList.value)
  const getCurrentTask = computed(() => currentTask.value)

  const fetchTasksByReviewId = async (reviewId: string) => {
    await listByReviewHandler(reviewId)
      .then((response: IGenericTaskEntity[]) => {
        tasksList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchSetCompleted = async (taskId: string) => {
    await setCompletedHandler(taskId)
      .then(() => {
        tasksList.value = tasksList.value.map((item) => (item._id === taskId ? { ...item, is_completed: true } : item))
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchTaskGenerator = async (payload: ITaskGeneratorRequest, abortSignal?: AbortSignal) => {
    return await taskGeneratorHandler(payload, abortSignal)
      .then((response: IGenericTaskEntity) => {
        tasksList.value.push(response)

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchTask = async (taskId: string) => {
    await getTaskHandler(taskId)
      .then((response: IGenericTaskEntity | null) => {
        currentTask.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const resetTaskList = () => {
    tasksList.value.length = 0
  }

  return {
    getTasksList,
    getCurrentTask,
    fetchTasksByReviewId,
    fetchSetCompleted,
    fetchTaskGenerator,
    fetchTask,
    resetTaskList,
  }
})
