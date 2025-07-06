import { IConversationHistory } from "./IConversation"
import { IErrorAnalysisEntity } from "./IErrorAnalysis"
import { VocabularyFrequencyLevelEnum } from "./IVocabulary"

export interface ICommunicationReviewHistory {
  start_time: Date // Время начала сессии
  duration_seconds: number // Продолжительность
  user_utterances_count: number // Сколько реплик у пользователя
  model_utterances_count: number // Сколько — у модели
  messages: IConversationHistory[] // Вся история сообщений с аудио
}

export interface ILevelDiagnosis {
  level: VocabularyFrequencyLevelEnum
  reasons: string // например: "used mostly B1-level vocabulary", "few complex sentence structures", "frequent errors with A2 grammar"
}

export interface IUserGoalEvaluation {
  goal: string
  is_covered: boolean
  quote_from_dialogue?: string
}

export interface IVocabularyUsage {
  word: string
  is_used: boolean
  quote_from_dialogue?: string
}

export interface IExpressionUsage {
  phrase: string
  is_used: boolean
  quote_from_dialogue?: string
}

export interface IInconsistentTurns {
  question: string
  user_response: string
  comment: string // объяснение, почему ответ не соответствует вопросу
}

export interface IConsistencyReview {
  consistency_score: number // от 0 до 100
  summary: string // краткое ревью, на explanation_language
  inconsistent_turns: IInconsistentTurns[]
}

export interface ICommunicationReview {
  _id: string
  prompt_id: string
  user_id: string
  organization_id: string
  session_id: string
  public_id: string | null
  topic_title: string
  target_language: string
  explanation_language: string
  history: ICommunicationReviewHistory
  error_analysis: IErrorAnalysisEntity[]
  suggestion: string[]
  conclusion: string
  user_cefr_level: ILevelDiagnosis | null
  goals_coverage: IUserGoalEvaluation[] | null
  vocabulary_used: IVocabularyUsage[] | null
  phrases_used: IExpressionUsage[] | null
  consistency_review: IConsistencyReview | null
  user_ielts_mark: number | null // общий балл от 0 до 9
  band_breakdown: IBandBreakdown | null
  part1: IPartReview | null
  part2: IPartReview | null
  part3: IPartReview | null
  updated_at: Date
  created_at: Date
}

export interface IBandBreakdown {
  fluency: number
  lexical: number
  grammar: number
}

export interface IPartReview {
  summary: string // текстовое описание
  highlights: string[] | null // ключевые моменты (опционально)
}

export interface ICommunicationReviewGenerateRequest {
  session_id: string
  prompt_id: string
  topic_title: string
  target_language: string
  explanation_language: string
}

export interface ICommunicationReviewUpdateAudioUrl {
  id: string
  session_id: string
  pair_id: string
  role: string
}

export interface ICommunicationReviewFilters {
  from_date?: Date
  to_date?: Date
  limit?: number
  offset?: number
}

export interface ICommunicationReviewParams {
  offset: number
  limit: number
  hasMore: boolean
  isLoading: boolean
}
