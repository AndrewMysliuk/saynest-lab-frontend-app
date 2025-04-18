import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IPromptScenario } from "../types"

export const getPromptsListHandler = async (): Promise<IPromptScenario[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/prompts-library",
      method: "GET",
    })

    const { data }: { data: IPromptScenario[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

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
