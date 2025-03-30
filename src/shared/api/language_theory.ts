import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ILanguageTopic } from "../types"

export const getTheoryByLanguageHandler = async (language: string): Promise<ILanguageTopic[]> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/language-theory/${language}`,
      method: "GET",
    })

    const { data }: { data: ILanguageTopic[] } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
