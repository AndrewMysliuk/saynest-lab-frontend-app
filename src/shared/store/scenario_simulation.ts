import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ISimulationStartResponse, IStartSimulationRequest } from "../types"
import { startSimulationHandler } from "../api"

export const useScenarioSimulationStore = defineStore("scenarioSimulationStore", () => {
  const simulationResponse = ref<ISimulationStartResponse | null>(null)

  const getSimulationResponse = computed(() => simulationResponse.value)

  const startScenarioSimulation = async (payload: IStartSimulationRequest) => {
    await startSimulationHandler(payload)
      .then((response: ISimulationStartResponse) => {
        simulationResponse.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getSimulationResponse,
    startScenarioSimulation,
  }
})
