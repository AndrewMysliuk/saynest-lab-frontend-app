import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IModuleScenario, IPromptScenario } from "../types"

export const getPromptByIdHandler = async (id: string): Promise<IPromptScenario> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/prompts-library/${id}`,
      method: "GET",
    })

    const { data }: { data: IPromptScenario } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getModuleListHandler = async (): Promise<IModuleScenario[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/prompts-library/module",
      method: "GET",
    })

    const { data }: { data: IModuleScenario[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getModuleScenariosHandler = async (module_id: string): Promise<IPromptScenario[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/prompts-library/module/${module_id}`,
      method: "GET",
    })

    const { data }: { data: IPromptScenario[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
