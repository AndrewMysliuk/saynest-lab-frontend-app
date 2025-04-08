import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IWordExplanationRequest, IVocabularyEntity, ISearchSynonymsRequest } from "../types"

export const wordExplanationHandler = async (payload: IWordExplanationRequest): Promise<IVocabularyEntity> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker/explanation",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IVocabularyEntity } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const wordAudioHandler = async (payload: IWordExplanationRequest): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker/audio",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const wordsListHandler = async (): Promise<IVocabularyEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker",
      method: "GET",
    })

    const { data }: { data: IVocabularyEntity[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const searchWordsSynonymsHandler = async (payload: ISearchSynonymsRequest): Promise<IVocabularyEntity[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker/search-synonyms",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IVocabularyEntity[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
