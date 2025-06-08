import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IOrganizationEntity } from "../types"
import { getOrgByIdHandler } from "../api"

export const useOrgStore = defineStore("orgStore", () => {
  const currentOrg = ref<IOrganizationEntity | null>(null)

  const getCurrentOrg = computed(() => currentOrg.value)

  const updateTrialUsage = (type: "session" | "review" | "task", count = 1) => {
    if (!getCurrentOrg.value) return

    if (!getCurrentOrg.value.trial_usage) {
      getCurrentOrg.value.trial_usage = { session_count: 0, review_count: 0, task_count: 0 }
    }

    switch (type) {
      case "session":
        getCurrentOrg.value.trial_usage.session_count += count
        break
      case "review":
        getCurrentOrg.value.trial_usage.review_count += count
        break
      case "task":
        getCurrentOrg.value.trial_usage.task_count += count
        break
    }
  }

  const fetchOrgById = async () => {
    await getOrgByIdHandler()
      .then((response: IOrganizationEntity | null) => {
        currentOrg.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getCurrentOrg,
    fetchOrgById,
    updateTrialUsage,
  }
})
