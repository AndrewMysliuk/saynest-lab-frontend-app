import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ITaskGeneratorRequest, IGenericTask } from "../types"

export const taskGeneratorHandler = async (payload: ITaskGeneratorRequest, abortSignal?: AbortSignal): Promise<IGenericTask> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/task-generator",
      method: "POST",
      data: {
        ...payload,
      },
      signal: abortSignal,
    })

    const { data }: { data: IGenericTask } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
