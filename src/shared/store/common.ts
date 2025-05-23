import { computed, ref } from "vue"
import { defineStore } from "pinia"

export const useCommonStore = defineStore("commonStore", () => {
  const isPageLoading = ref<boolean>(false)

  const getIsPageLoading = computed(() => isPageLoading.value)

  const setIsPageLoading = (value: boolean) => {
    isPageLoading.value = value
  }

  return {
    getIsPageLoading,
    setIsPageLoading,
  }
})
