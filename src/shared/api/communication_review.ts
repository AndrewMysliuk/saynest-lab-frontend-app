import { axios, publicAxios } from "../config"
import { AxiosResponse } from "axios"
import { ICommunicationReview, ICommunicationReviewFilters, ICommunicationReviewGenerateRequest, ICommunicationReviewUpdateAudioUrl } from "../types"

export const generateConversationReviewHandler = async (payload: ICommunicationReviewGenerateRequest): Promise<ICommunicationReview> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: ICommunicationReview } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const reviewsListHandler = async (query?: ICommunicationReviewFilters): Promise<ICommunicationReview[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review",
      method: "GET",
      params: query,
    })

    const { data }: { data: ICommunicationReview[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getReviewHandler = async (review_id: string): Promise<ICommunicationReview> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/communication-review/${review_id}`,
      method: "GET",
    })

    const { data }: { data: ICommunicationReview } = response

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

export const deleteAllHistoryHandler = async (): Promise<boolean> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review/all-history",
      method: "DELETE",
    })

    const { data }: { data: boolean } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const updateAudioUrlHandler = async (dto: ICommunicationReviewUpdateAudioUrl): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/communication-review/update-audio-url",
      method: "POST",
      data: {
        ...dto,
      },
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const generateReviewPublicIdHandler = async (review_id: string): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/communication-review/${review_id}/generate-public-id`,
      method: "GET",
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getReviewByPublicIdHandler = async (public_id: string): Promise<ICommunicationReview> => {
  try {
    const response: AxiosResponse = await publicAxios({
      url: `/api/communication-review/public/${public_id}`,
      method: "GET",
    })

    const { data }: { data: ICommunicationReview } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
