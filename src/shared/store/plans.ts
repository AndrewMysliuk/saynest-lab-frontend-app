import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPlanEntity } from "../types"
import { getPublicPlanListHandler, getPlanByIdHandler } from "../api"

export const usePlansStore = defineStore("plansStore", () => {
  const plansList = ref<IPlanEntity[]>([])
  const currentPlan = ref<IPlanEntity | null>(null)

  const getPlansList = computed(() => plansList.value)
  const getCurrentPlan = computed(() => currentPlan.value)

  const fetchPlansList = async () => {
    await getPublicPlanListHandler()
      .then((response: IPlanEntity[]) => {
        plansList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchPlanById = async (plan_id: string) => {
    await getPlanByIdHandler(plan_id)
      .then((response: IPlanEntity | null) => {
        currentPlan.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getPlansList,
    getCurrentPlan,
    fetchPlansList,
    fetchPlanById,
  }
})
