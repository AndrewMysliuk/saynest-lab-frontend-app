export enum VocabularyFrequencyLevelEnum {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

export enum PartOfSpeechEnum {
  noun = "noun", // существительное
  pronoun = "pronoun", // местоимение
  verb = "verb", // глагол
  adjective = "adjective", // прилагательное
  adverb = "adverb", // наречие
  preposition = "preposition", // предлог
  conjunction = "conjunction", // союз
  interjection = "interjection", // междометие
  article = "article", // артикль (в английском)
  numeral = "numeral", // числительное
  particle = "particle", // частица (в некоторых языках, напр. в русском)
  determiner = "determiner", // определяющее слово (например, this, those)
}

export interface IGlobalWordSenses {
  translations: string[] // краткий перевод
  definitions: string[] // пояснение/описание
  examples: string[] // примеры предложений
  synonyms: string[] // опционально
}

export interface IGlobalWord {
  _id: string
  word: string // само слово
  target_language: string // язык слова (ISO 639-1)
  native_language: string // язык перевода (ISO 639-1)
  part_of_speech?: PartOfSpeechEnum
  senses: IGlobalWordSenses[]
  audio_url: string | null // ссылка на аудио (CDN или TTS)
  audio_url_request: string | null // запрос ссылки на бакете
  used_fallback: boolean // был ли использован en как промежуточный
  created_at: Date
  updated_at: Date
}

export enum IUserWordTierEnum {
  UNKNOWN = 1, // Впервые видит слово
  RECOGNIZABLE = 2, // Что-то знакомое, но неуверен
  CONTEXTUAL = 3, // Понимает в контексте, но не использует
  MASTERED = 4, // Уверенно знает и использует
}

export interface IUserWordPublic {
  _id: string
  user_id: string | null
  global_word_entity: Partial<IGlobalWord>
  tier: IUserWordTierEnum | null
  created_at: Date
  updated_at: Date
}

export interface IUserWordLookUpRequest {
  word: string
  target_language: string
  native_language: string
}

export interface IUserWordAddWordToUserRequest {
  global_word_id: string
  tier: IUserWordTierEnum
}

export interface IUserWordUpdateUserWordTierRequest {
  user_word_id: string
  tier: IUserWordTierEnum
}

export interface IUserWordFilters {
  target_language?: string
  native_language?: string
  limit?: number
  offset?: number
}

export interface IUserWordParams {
  offset: number
  limit: number
  hasMore: boolean
  isLoading: boolean
}
