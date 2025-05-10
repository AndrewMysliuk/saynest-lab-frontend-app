import { IUserEntity } from "./IUser"

export interface IRegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  country: string
  organization_name?: string
  hcaptcha_token: string
}

export interface ILoginRequest {
  email: string
  password: string
  hcaptcha_token: string
}

export interface IAuthResponse {
  access_token: string
  refresh_token: string
  user: IUserEntity
}
