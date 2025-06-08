import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPlanEntity } from "../types"
import { getPublicPlanListHandler } from "../api"

export const usePlansStore = defineStore("plansStore", () => {
  const plansList = ref<IPlanEntity[]>([])

  const getPlansList = computed(() => plansList.value)

  const fetchPlansList = async () => {
    await getPublicPlanListHandler()
      .then((response: IPlanEntity[]) => {
        plansList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getPlansList,
    fetchPlansList,
  }
})
