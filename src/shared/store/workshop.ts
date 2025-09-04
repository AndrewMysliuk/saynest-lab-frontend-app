import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IWorkshopScenarioBasicInformation, IWorkshopScenarioContent, IWorkshopScenarioMetadataActions } from "../types"
import { DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION, DEFAULT_WORKSHOP_SCENARIO_CONTENT, DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS } from "../lib"

export const useWorkshopStore = defineStore("workshopStore", () => {
  const basicInformation = ref<IWorkshopScenarioBasicInformation>(DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION)
  const scenarioContent = ref<IWorkshopScenarioContent>(DEFAULT_WORKSHOP_SCENARIO_CONTENT)
  const metadataActions = ref<IWorkshopScenarioMetadataActions>(DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS)

  const getBasicInformation = computed(() => basicInformation.value)
  const getScenarioContent = computed(() => scenarioContent.value)
  const getMetadataActions = computed(() => metadataActions.value)

  const setBasicInformation = (value: Partial<IWorkshopScenarioBasicInformation>) => {
    basicInformation.value = {
      ...basicInformation.value,
      ...value,
    }
  }

  const setScenarioContent = (value: Partial<IWorkshopScenarioContent>) => {
    scenarioContent.value = {
      ...scenarioContent.value,
      ...value,
    }
  }

  const setMetadataActions = (value: Partial<IWorkshopScenarioMetadataActions>) => {
    metadataActions.value = {
      ...metadataActions.value,
      ...value,
    }
  }

  return {
    getBasicInformation,
    getScenarioContent,
    getMetadataActions,
    setBasicInformation,
    setScenarioContent,
    setMetadataActions,
  }
})
