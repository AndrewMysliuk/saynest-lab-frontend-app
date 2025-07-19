export enum SessionTypeEnum {
  SPEACKING = "SPEACKING",
  WRITING = "WRITING",
  READING = "READING",
  LISETNING = "LISETNING",
}

export enum SessionStatusEnum {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  DELETED = "DELETED",
}

export enum SessionIeltsPartEnum {
  PART_1 = 1,
  PART_2 = 2,
  PART_3 = 3,
}

export interface ISessionEntity {
  _id: string
  prompt_id: string
  user_id: string | null
  organization_id: string | null
  active_ielts_part?: SessionIeltsPartEnum
  type: SessionTypeEnum
  status: SessionStatusEnum
  system_prompt: string
  session_directory: string
  updated_at: Date
  created_at: Date
  ended_at: Date
}

export interface ISessionCreateRequest {
  type: SessionTypeEnum
  prompt_id: string
  active_ielts_part?: SessionIeltsPartEnum
}
