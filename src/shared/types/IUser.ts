export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export enum UserStatusEnum {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
  DEACTIVATED = "DEACTIVATED",
  DELETED = "DELETED",
}

export interface IUserSettings {
  phone?: string
  avatar_url?: string
  is_accept_terms_and_conditions: boolean
  is_accept_privacy_policy: boolean
  is_accept_refund_policy: boolean
}

export interface IUserEntity {
  _id: string
  organization_id: string
  email: string
  password: string
  is_email_confirmed: boolean
  first_name: string
  last_name: string
  explanation_language: string | null
  country: string
  role: UserRoleEnum
  status: UserStatusEnum
  settings: IUserSettings
  updated_at: Date
  created_at: Date
}

export interface IUserCreateRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  country: string
  role: UserRoleEnum
  organization_id: string
}

export interface IUserSettingsUpdate {
  phone?: string
  avatar_url?: string
}

export interface IUserUpdateRequest {
  first_name?: string
  last_name?: string
  email?: string
  explanation_language?: string
  country?: string
  role?: UserRoleEnum
  status?: UserStatusEnum
  settings?: Partial<IUserSettingsUpdate>
}

export interface IUserLegalRequest {
  is_accept_terms_and_conditions: boolean
  is_accept_privacy_policy: boolean
  is_accept_refund_policy: boolean
}
