import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IUserWordAddWordToUserRequest, IUserWordFilters, IUserWordLookUpRequest, IUserWordPublic, IUserWordUpdateUserWordTierRequest } from "../types"

export const lookupWordHandler = async (payload: IUserWordLookUpRequest): Promise<IUserWordPublic | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary/lookup",
      method: "GET",
      params: {
        ...payload,
      },
    })

    const { data }: { data: IUserWordPublic | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const generateWordAudioUrlHandler = async (global_word_id: string): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/vocabulary/audio/${global_word_id}`,
      method: "GET",
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const addWordToUserHandler = async (payload: IUserWordAddWordToUserRequest): Promise<IUserWordPublic> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary/add",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IUserWordPublic } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const updateUserWordTierHandler = async (payload: IUserWordUpdateUserWordTierRequest): Promise<IUserWordPublic> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary/update-tier",
      method: "PATCH",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IUserWordPublic } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const deleteUserWordHandler = async (global_word_id: string): Promise<boolean> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/vocabulary/user-word/delete/${global_word_id}`,
      method: "DELETE",
    })

    const { data }: { data: boolean } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const listUserWordsHandler = async (payload?: IUserWordFilters): Promise<IUserWordPublic[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary/list",
      method: "GET",
      params: {
        ...payload,
      },
    })

    const { data }: { data: IUserWordPublic[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
