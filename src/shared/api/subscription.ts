import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ISubscriptionEntity } from "../types"

export const getSubsByOrgIdHandler = async (): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/org-info",
      method: "GET",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
