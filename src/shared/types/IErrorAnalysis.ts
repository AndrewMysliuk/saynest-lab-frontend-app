import { IGPTPayload } from "./IGPT"
import { VocabularyFrequencyLevelEnum } from "./IVocabulary"

export interface IWord {
  id: number
  value: string
}

export interface IssueItem {
  original_text: string
  corrected_text: string
  error_words: IWord[]
  corrected_words: IWord[]
  explanation: string
  topic_titles: string
}

export interface IErrorImproveUserAnswer {
  corrected_text: string
  cefr_level: VocabularyFrequencyLevelEnum
  explanation: string
}

export interface IErrorAnalysisEntity {
  session_id: string
  user_id: string | null
  organization_id: string | null
  prompt_id: string
  issues: IssueItem[]
  has_errors: boolean
  is_end: boolean
  improve_user_answer: IErrorImproveUserAnswer
  detected_language: string
  is_target_language: boolean
  last_user_message: string
  updated_at: Date
  created_at: Date
}

export interface IErrorAnalysisRequest {
  gpt_payload: IGPTPayload
  session_id: string
  target_language: string
  explanation_language: string
  prompt_id: string
}
