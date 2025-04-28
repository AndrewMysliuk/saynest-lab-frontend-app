export enum OrganizationStatusEnum {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface IOrganizationSettings {
  locale?: string
  timezone?: string
}

export interface IOrganizationEntity {
  _id: string
  owner_id: string
  name: string
  plan_id: string | null
  status: OrganizationStatusEnum
  settings: IOrganizationSettings
  updated_at: Date
  created_at: Date
}
