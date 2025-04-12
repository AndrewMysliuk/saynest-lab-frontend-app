import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IStatistics, IStatisticsGenerateRequest } from "../types"

export const generateConversationReviewHandler = async (payload: IStatisticsGenerateRequest): Promise<IStatistics> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IStatistics } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const reviewsListHandler = async (): Promise<IStatistics[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review",
      method: "GET",
    })

    const { data }: { data: IStatistics[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getReviewHandler = async (review_id: string): Promise<IStatistics> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/communication-review/${review_id}`,
      method: "GET",
    })

    const { data }: { data: IStatistics } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const deleteReviewHandler = async (review_id: string): Promise<boolean> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/communication-review/${review_id}`,
      method: "DELETE",
    })

    const { data }: { data: boolean } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
