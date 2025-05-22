import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IUserProgressEntity } from "../types"

export const getByUserIdHandler = async (): Promise<IUserProgressEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/user-progress",
      method: "GET",
    })

    const { data }: { data: IUserProgressEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
