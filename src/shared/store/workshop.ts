import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IModuleInfo, IModuleScenariosFlat, IModuleStructureComplex, IWorkshopScenarioBasicInformation, IWorkshopScenarioContent, IWorkshopScenarioMetadataActions } from "../types"
import {
  DEFAULT_MODULE_COMPLEX_STRUCTURE,
  DEFAULT_MODULE_INFO,
  DEFAULT_MODULE_SCENARIOS_FLAT,
  DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION,
  DEFAULT_WORKSHOP_SCENARIO_CONTENT,
  DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS,
} from "../lib"

export const useWorkshopStore = defineStore("workshopStore", () => {
  const basicInformation = ref<IWorkshopScenarioBasicInformation>(DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION)
  const scenarioContent = ref<IWorkshopScenarioContent>(DEFAULT_WORKSHOP_SCENARIO_CONTENT)
  const metadataActions = ref<IWorkshopScenarioMetadataActions>(DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS)
  const moduleInfo = ref<IModuleInfo>(DEFAULT_MODULE_INFO)
  const moduleScenariosFlat = ref<IModuleScenariosFlat>(DEFAULT_MODULE_SCENARIOS_FLAT)
  const moduleStructureComplex = ref<IModuleStructureComplex>(DEFAULT_MODULE_COMPLEX_STRUCTURE)

  const getBasicInformation = computed(() => basicInformation.value)
  const getScenarioContent = computed(() => scenarioContent.value)
  const getMetadataActions = computed(() => metadataActions.value)
  const getModuleInfo = computed(() => moduleInfo.value)
  const getModuleScenariosFlat = computed(() => moduleScenariosFlat.value)
  const getModuleStructureComplex = computed(() => moduleStructureComplex.value)

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

  const setModuleInfo = (value: Partial<IModuleInfo>) => {
    moduleInfo.value = {
      ...moduleInfo.value,
      ...value,
    }
  }

  const setModuleScenariosFlat = (value: Partial<IModuleScenariosFlat>) => {
    moduleScenariosFlat.value = {
      ...moduleScenariosFlat.value,
      ...value,
    }
  }

  const setModuleStructureComplex = (value: Partial<IModuleStructureComplex>) => {
    moduleStructureComplex.value = {
      ...moduleStructureComplex.value,
      ...value,
    }
  }

  return {
    getBasicInformation,
    getScenarioContent,
    getMetadataActions,
    getModuleInfo,
    getModuleScenariosFlat,
    getModuleStructureComplex,
    setBasicInformation,
    setScenarioContent,
    setMetadataActions,
    setModuleInfo,
    setModuleScenariosFlat,
    setModuleStructureComplex,
  }
})
