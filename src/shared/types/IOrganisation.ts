export enum OrganizationStatusEnum {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface IOrganizationSettings {
  locale?: string
  timezone?: string
}

export interface IOrganizationTrialUsage {
  session_count: number
  review_count: number
  task_count: number
}

export interface IOrganizationEntity {
  _id: string
  owner_id: string
  name: string
  subscription_id: string | null
  status: OrganizationStatusEnum
  settings: IOrganizationSettings
  trial_usage: IOrganizationTrialUsage
  updated_at: Date
  created_at: Date
}
