export type GPTModelType = "gpt-5" | "gpt-4o"

export type GPTRoleType = "user" | "system" | "assistant"

export interface IGPTPayload {
  model: GPTModelType
  temperature?: number
  max_tokens?: number
  messages?: Array<{ role: GPTRoleType; content: string }>
}
