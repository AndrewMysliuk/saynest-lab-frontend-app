import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IErrorAnalysisEntity, IErrorAnalysisRequest } from "../types"

export const errorAnalysisHandler = async (payload: IErrorAnalysisRequest): Promise<IErrorAnalysisEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/error-analysis",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IErrorAnalysisEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
