import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ITaskGeneratorRequest, IGenericTaskEntity } from "../types"

export const taskGeneratorHandler = async (payload: ITaskGeneratorRequest, abortSignal?: AbortSignal): Promise<IGenericTaskEntity> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/task-generator",
      method: "POST",
      data: {
        ...payload,
      },
      signal: abortSignal,
    })

    const { data }: { data: IGenericTaskEntity } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const setCompletedHandler = async (taskId: string): Promise<void> => {
  try {
    await axios({
      url: `/api/task-generator/${taskId}/completed`,
      method: "PATCH",
    })
  } catch (error: unknown) {
    throw error
  }
}

export const listByReviewHandler = async (reviewId: string): Promise<IGenericTaskEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/task-generator/review/${reviewId}`,
      method: "GET",
    })

    const { data }: { data: IGenericTaskEntity[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
