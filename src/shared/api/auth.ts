import { axios, publicAxios } from "../config"
import { AxiosResponse } from "axios"
import { ILoginRequest, IRegisterRequest, IAuthResponse } from "../types"

export const googleHandler = async (id_token: string): Promise<IAuthResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/auth/google",
      method: "POST",
      data: {
        id_token,
      },
    })

    const { data }: { data: IAuthResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const registerHandler = async (payload: IRegisterRequest): Promise<IAuthResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/auth/register",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IAuthResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const loginHandler = async (payload: ILoginRequest): Promise<IAuthResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/auth/login",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const { data }: { data: IAuthResponse } = response

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
