import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IGenericTask } from "../types"

export const useTaskGeneratorStore = defineStore("taskGeneratorStore", () => {
  const tasksList = ref<IGenericTask[]>([])

  const getTasksList = computed(() => tasksList.value)

  const setTaskToList = (task: IGenericTask) => {
    const taskIndex = tasksList.value.findIndex((item) => item.id === task.id)

    if (taskIndex === -1) {
      tasksList.value.push(task)
      return
    }

    tasksList.value = tasksList.value.map((item) => (item.id === task.id ? task : item))
  }

  const resetTaskList = () => {
    tasksList.value.length = 0
  }

  return {
    getTasksList,
    setTaskToList,
    resetTaskList,
  }
})
