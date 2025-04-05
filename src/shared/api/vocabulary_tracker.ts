import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IWordExplanationRequest, IVocabularyJSONEntry } from "../types"

export const wordExplanationHandler = async (payload: IWordExplanationRequest): Promise<IVocabularyJSONEntry> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker/explanation",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IVocabularyJSONEntry } = response

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

export const wordsListHandler = async (): Promise<IVocabularyJSONEntry[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/vocabulary-tracker",
      method: "GET",
    })

    const { data }: { data: IVocabularyJSONEntry[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
