import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IOrganizationEntity } from "../types"

export const getOrgByIdHandler = async (): Promise<IOrganizationEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/org/info",
      method: "GET",
    })

    const { data }: { data: IOrganizationEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
