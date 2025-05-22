import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IUserProgressEntity } from "../types"
import { getByUserIdHandler } from "../api"

export const useUserProgressStore = defineStore("userProgressStore", () => {
  const currentUserProgress = ref<IUserProgressEntity | null>(null)

  const getCurrentUserProgress = computed(() => currentUserProgress.value)

  const fetchCurrentUserProgress = async () => {
    await getByUserIdHandler()
      .then((response: IUserProgressEntity | null) => {
        currentUserProgress.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getCurrentUserProgress,
    fetchCurrentUserProgress,
  }
})
