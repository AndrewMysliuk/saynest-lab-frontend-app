import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ISessionEntity, ISessionCreateRequest } from "../types"

export const createSessionHandler = async (payload: ISessionCreateRequest): Promise<ISessionEntity> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/session",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: ISessionEntity } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
