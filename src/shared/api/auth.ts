import { axios, publicAxios } from "../config"
import { AxiosResponse } from "axios"
import { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from "../types"

export const registerHandler = async (payload: IRegisterRequest): Promise<IRegisterResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/auth/register",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IRegisterResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const loginHandler = async (payload: ILoginRequest): Promise<ILoginResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/auth/login",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: ILoginResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const refreshAccessTokenHandler = async (): Promise<string> => {
  try {
    const response: AxiosResponse = await publicAxios({
      url: "/api/auth/refresh",
      method: "GET",
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const logoutHandler = async (): Promise<void> => {
  try {
    await axios({
      url: "/api/auth/logout",
      method: "GET",
    })

    return
  } catch (error: unknown) {
    throw error
  }
}
