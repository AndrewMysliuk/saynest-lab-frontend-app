export type GPTModelType = "gpt-4-turbo" | "gpt-4" | "gpt-4o" | "gpt-4o-mini"

export type GPTRoleType = "user" | "system" | "assistant"

export interface IGPTPayload {
  model: GPTModelType
  temperature?: number
  max_tokens?: number
}

export interface IGPTMessage {
  role: GPTRoleType
  content: string
}

export interface IGPTRequest {
  model: GPTModelType
  messages: IGPTMessage[]
  temperature?: number
  max_tokens?: number
}
