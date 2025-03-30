import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ITaskGeneratorRequest, ITaskGeneratorResponse } from "../types"

export const taskGeneratorHandler = async (payload: ITaskGeneratorRequest): Promise<ITaskGeneratorResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/task-generator",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: ITaskGeneratorResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
