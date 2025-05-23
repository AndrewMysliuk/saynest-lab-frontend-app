import { computed, reactive, ref } from "vue"
import { defineStore } from "pinia"
import { IGenericTaskEntity, ITaskGeneratorRequest } from "../types"
import { getTaskHandler, listByReviewHandler, setCompletedHandler, taskGeneratorHandler } from "../api"

export const useTaskGeneratorStore = defineStore("taskGeneratorStore", () => {
  const tasksList = ref<IGenericTaskEntity[]>([])
  const selectedAnswersMap = reactive<Record<string, Record<number, string>>>({})

  const getTasksList = computed(() => tasksList.value)

  const fetchTasksByReviewId = async (reviewId: string) => {
    await listByReviewHandler(reviewId)
      .then((response: IGenericTaskEntity[]) => {
        tasksList.value = response

        resetTaskAnswers()

        response.forEach((task) => {
          selectedAnswersMap[task._id] = {}

          if (task.is_completed && task.user_answers) {
            Object.entries(task.user_answers).forEach(([sentenceId, answer]) => {
              selectedAnswersMap[task._id][Number(sentenceId)] = answer
            })
          }
        })
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchSetCompleted = async (taskId: string, answers: Record<number, string>) => {
    await setCompletedHandler(taskId, answers)
      .then(() => {
        tasksList.value = tasksList.value.map((item) => (item._id === taskId ? { ...item, is_completed: true, user_answers: answers } : item))
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchTaskGenerator = async (payload: ITaskGeneratorRequest, abortSignal?: AbortSignal) => {
    return await taskGeneratorHandler(payload, abortSignal)
      .then((response: IGenericTaskEntity) => {
        tasksList.value.push(response)

        selectedAnswersMap[response._id] = {}

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchTask = async (taskId: string) => {
    await getTaskHandler(taskId)
      .then((response: IGenericTaskEntity | null) => {
        if (response) {
          tasksList.value = [response]

          resetTaskAnswers()

          if (response) {
            selectedAnswersMap[response._id] = {}

            if (response.is_completed && response.user_answers) {
              Object.entries(response.user_answers).forEach(([sentenceId, answer]) => {
                selectedAnswersMap[response._id][Number(sentenceId)] = answer
              })
            }
          }
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const selectTaskAnswer = ({ taskId, sentenceId, option }: { taskId: string; sentenceId: number; option: string }) => {
    if (!selectedAnswersMap[taskId]) {
      selectedAnswersMap[taskId] = {}
    }
    selectedAnswersMap[taskId][sentenceId] = option
  }

  const resetTaskAnswers = () => {
    Object.keys(selectedAnswersMap).forEach((key) => {
      delete selectedAnswersMap[key]
    })
  }

  const resetTaskList = () => {
    tasksList.value.length = 0
  }

  return {
    getTasksList,
    selectedAnswersMap,
    fetchTasksByReviewId,
    fetchSetCompleted,
    fetchTaskGenerator,
    fetchTask,
    resetTaskList,
    selectTaskAnswer,
    resetTaskAnswers,
  }
})
