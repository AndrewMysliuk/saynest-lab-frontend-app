import { IErrorAnalysisEntity } from "./IErrorAnalysis"
import { GPTRoleType, IGPTPayload, ITextAnalysisResponse } from "./IGPT"

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
  audio_file: Blob
  prompt?: string
}

export interface IConversationPayload {
  whisper: IConversationWhisper
  gpt_model: IGPTPayload
  tts: ITTSPayload
  system: {
    session_id?: string
    global_prompt: string
  }
}

export interface IConversationHistoryGPT {
  role: GPTRoleType
  content: string
}

export interface IConversationHistoryTTS {
  role: GPTRoleType
  audio_chunk: string
}

export interface IConversationHistory {
  role: GPTRoleType
  content: string
  audio_url?: string
}

export interface IConversationResponse {
  session_id: string
  conversation_history: IConversationHistory[]
  last_model_response: ITextAnalysisResponse
  error_analyser_response: IErrorAnalysisEntity | null
}
