import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IModuleFilters, IModuleScenarioEntity, IPromptFilters, IPromptScenarioEntity } from "../types"

export const getScenarioByIdHandler = async (id: string): Promise<IPromptScenarioEntity> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/prompts-library/scenario/${id}`,
      method: "GET",
    })

    const { data }: { data: IPromptScenarioEntity } = response
    return data
  } catch (error: unknown) {
    throw error
  }
}

export const listScenariosHandler = async (query: IPromptFilters): Promise<IPromptScenarioEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/prompts-library/scenarios",
      method: "GET",
      params: query,
    })

    const { data }: { data: IPromptScenarioEntity[] } = response
    return data
  } catch (error: unknown) {
    throw error
  }
}

export const listModulesHandler = async (query?: IModuleFilters): Promise<IModuleScenarioEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/prompts-library/modules",
      method: "GET",
      params: query,
    })

    const { data }: { data: IModuleScenarioEntity[] } = response
    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getModuleScenariosHandler = async (module_id: string): Promise<IPromptScenarioEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/prompts-library/module/${module_id}/scenarios`,
      method: "GET",
    })

    const { data }: { data: IPromptScenarioEntity[] } = response
    return data
  } catch (error: unknown) {
    throw error
  }
}
