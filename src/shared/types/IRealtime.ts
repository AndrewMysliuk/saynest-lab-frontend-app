export enum RealtimeEventSourceEnum {
  CLIENT = "client",
  SERVER = "server",
}

export interface IRealtimeEvent {
  time: string
  source: RealtimeEventSourceEnum
  count?: number
  event: { [key: string]: any }
}

export type RealtimeSessionModalitiesType = "text" | "audio"

export interface IRealtimeSessionInputAudioTranscription {
  model: "whisper-1"
}

export interface IRealtimeSessionTurnDetection {
  type: "server_vad"
  threshold: number
  prefix_padding_ms: number
  silence_duration_ms: number
}

export interface IRealtimeSessionTools {
  type: "function"
  name: string
  description: string
  parameters: any
}

export interface IRealtimeSessionUpdate {
  modalities?: RealtimeSessionModalitiesType[]
  instructions?: string
  voice?: "alloy" | "ash" | "ballad" | "coral" | "echo" | "sage" | "shimmer" | "verse"
  input_audio_format?: "pcm16" | "g711_ulaw" | "g711_alaw"
  output_audio_format?: "pcm16" | "g711_ulaw" | "g711_alaw"
  input_audio_transcription?: IRealtimeSessionInputAudioTranscription
  turn_detection?: IRealtimeSessionTurnDetection
  tools?: IRealtimeSessionTools[]
  tool_choice?: "auto" | "none" | "required"
  temperature?: number
  max_response_output_tokens?: number
}

export enum RealtimeAPIServerEventsEnum {
  ERROR = "error",
  SESSION_CREATED = "session.created",
  SESSION_UPDATED = "session.updated",
  CONVERSATION_CREATED = "conversation.created",
  INPUT_AUDIO_BUFFER_COMMITTED = "input_audio_buffer.committed",
  INPUT_AUDIO_BUFFER_CLEARED = "input_audio_buffer.cleared",
  INPUT_AUDIO_BUFFER_SPEECH_STARTED = "input_audio_buffer.speech_started",
  INPUT_AUDIO_BUFFER_SPEECH_STOPPED = "input_audio_buffer.speech_stopped",
  CONVERSATION_ITEM_CREATED = "conversation.item.created",
  CONVERSATION_ITEM_INPUT_AUDIO_TRANSCRIPTION_COMPLETED = "conversation.item.input_audio_transcription.completed",
  CONVERSATION_ITEM_INPUT_AUDIO_TRANSCRIPTION_FAILED = "conversation.item.input_audio_transcription.failed",
  CONVERSATION_ITEM_TRUNCATED = "conversation.item.truncated",
  CONVERSATION_ITEM_DELETED = "conversation.item.deleted",
  RESPONSE_CREATED = "response.created",
  RESPONSE_DONE = "response.done",
  RESPONSE_OUTPUT_ITEM_ADDED = "response.output_item.added",
  RESPONSE_OUTPUT_ITEM_DONE = "response.output_item.done",
  RESPONSE_CONTENT_PART_ADDED = "response.content_part.added",
  RESPONSE_CONTENT_PART_DONE = "response.content_part.done",
  RESPONSE_TEXT_DELTA = "response.text.delta",
  RESPONSE_TEXT_DONE = "response.text.done",
  RESPONSE_AUDIO_TRANSCRIPT_DELTA = "response.audio_transcript.delta",
  RESPONSE_AUDIO_TRANSCRIPT_DONE = "response.audio_transcript.done",
  RESPONSE_AUDIO_DELTA = "response.audio.delta",
  RESPONSE_AUDIO_DONE = "response.audio.done",
  RESPONSE_FUNCTION_CALL_ARGUMENTS_DELTA = "response.function_call_arguments.delta",
  RESPONSE_FUNCTION_CALL_ARGUMENTS_DONE = "response.function_call_arguments.done",
  RATE_LIMITS_UPDATED = "rate_limits.updated",
}

export enum RealtimeAPIClientEventsEnum {
  SESSION_UPDATE = "session.update",
  INPUT_AUDIO_BUFFER_APPEND = "input_audio_buffer.append",
  INPUT_AUDIO_BUFFER_COMMIT = "input_audio_buffer.commit",
  INPUT_AUDIO_BUFFER_CLEAR = "input_audio_buffer.clear",
  CONVERSATION_ITEM_CREATE = "conversation.item.create",
  CONVERSATION_ITEM_TRUNCATE = "conversation.item.truncate",
  CONVERSATION_ITEM_DELETE = "conversation.item.delete",
  RESPONSE_CREATE = "response.create",
  RESPONSE_CANCEL = "response.cancel",
}
