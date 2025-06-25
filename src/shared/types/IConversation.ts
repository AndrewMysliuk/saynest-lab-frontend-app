import { GPTRoleType, IGPTPayload } from "./IGPT"

export type TTSVoiceType = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"

export type TTSModelType = "tts-1" | "tts-1-hd"

export type TTSModelFormatsType = "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm"

export interface ITTSPayload {
  model: TTSModelType
  voice: TTSVoiceType
  response_format?: TTSModelFormatsType
  speed?: number
}

export interface IVoiceSettings {
  stability?: number
  similarity_boost?: number
}

export interface ITTSElevenLabsPayload {
  input?: string
  voice: string
  model?: string
  voice_settings?: IVoiceSettings
}

export interface ITTSGooglePayload {
  input?: string
  language_code: string
  response_format: string
}

export interface IConversationWhisper {
  audio_file: Blob
  prompt?: string
}

export interface IConversationPayload {
  whisper: IConversationWhisper
  gpt_model: IGPTPayload
  // tts: ITTSPayload
  // tts: ITTSElevenLabsPayload
  tts: ITTSGooglePayload
  system: {
    session_id: string
    prompt_id: string
  }
  target_language: string
  explanation_language: string
}

export enum StreamEventEnum {
  TRANSCRIPTION = "TRANSCRIPTION",
  GPT_RESPONSE = "GPT_RESPONSE",
  GPT_FULL_RESPONSE = "GPT_FULL_RESPONSE",
  TTS_CHUNK = "TTS_CHUNK",
  TTS_LINK = "TTS_LINK",
  ERROR = "ERROR",
  COMPLETE = "COMPLETE",
  HEARTBEAT = "HEARTBEAT",
}

export interface IHistoryStreamEvent {
  type: StreamEventEnum.TRANSCRIPTION
  role: "user"
  content: string
  audio_url: string
}

export interface IGptResponseStreamEvent {
  type: StreamEventEnum.GPT_RESPONSE | StreamEventEnum.GPT_FULL_RESPONSE
  role: "assistant"
  content: string
}

// ElevenLabs + OpenAI TTS
export interface ITtsChunkStreamEvent {
  type: StreamEventEnum.TTS_CHUNK
  role: "assistant"
  audioChunk: string
}

// Only Google TTS
export interface ITtsLinkStreamEvent {
  type: StreamEventEnum.TTS_LINK
  role: "assistant"
  audioUrl: string
}

export interface IErrorStreamEvent {
  type: StreamEventEnum.ERROR
  role: "system"
  content: string
}

export interface IHeartbeatStreamEvent {
  type: StreamEventEnum.HEARTBEAT
}

export type ConversationShortResponse = IGptResponseStreamEvent | IHistoryStreamEvent

export type ConversationStreamEvent = IHistoryStreamEvent | IGptResponseStreamEvent | ITtsChunkStreamEvent | ITtsLinkStreamEvent | IErrorStreamEvent | IHeartbeatStreamEvent

export interface IConversationHistory {
  session_id: string
  user_id: string | null
  organization_id: string | null
  pair_id: string
  role: GPTRoleType
  content: string
  audio_url: string
  audio_path: string
  updated_at: Date
  created_at: Date
}

export interface IConversationResponse {
  session_id: string
  conversation_history: IConversationHistory[]
  last_model_response: string
}
