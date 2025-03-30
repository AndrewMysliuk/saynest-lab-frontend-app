import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ISimulationStartResponse, IStartSimulationRequest } from "../types"

export const startSimulationHandler = async (payload: IStartSimulationRequest): Promise<ISimulationStartResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/scenario-simulation/",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: ISimulationStartResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
