export type GPTModelType = "gpt-4-turbo" | "gpt-4" | "gpt-4o" | "gpt-4o-mini"

export type GPTRoleType = "user" | "system" | "assistant"

export interface IGPTPayload {
  model: GPTModelType
  temperature?: number
  max_tokens?: number
}

export type TTSVoiceType = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"

export type TTSModelType = "tts-1" | "tts-1-hd"

export type TTSModelFormatsType = "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm"

export interface ITTSPayload {
  model: TTSModelType
  voice: TTSVoiceType
  response_format?: TTSModelFormatsType
  speed?: number
}

export interface IConversationWhisper {
  audioFile: Blob
  prompt?: string
}

export interface IConversationPayload {
  whisper: IConversationWhisper
  gpt_model: IGPTPayload
  tts: ITTSPayload
  system: {
    sessionId?: string
    globalPrompt: string
  }
}

export interface IConversationHistoryGPT {
  role: GPTRoleType
  content: string
}

export interface IConversationHistoryTTS {
  role: GPTRoleType
  audioChunk: string
}

export interface IConversationHistory {
  role: GPTRoleType
  content: string
  audioUrl?: string
}

export interface IConversationResponse {
  session_id: string
  conversation_history: IConversationHistory[]
}
