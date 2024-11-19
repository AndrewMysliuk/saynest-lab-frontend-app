interface IConfidence {
  score: number
  examples: string[]
  suggestions: string[]
}

interface ICoherence {
  score: number
  examples: string[]
  suggestions: string[]
  corrected_sentence?: string
}

interface IGrammarError {
  original: string
  highlighted: {
    incorrect_parts: string[]
    corrected_parts: string[]
  }
  corrected_sentence: string
}

interface IGrammar {
  errors: IGrammarError[]
  summary: string
}

interface IVocabularyLevel {
  words: string[]
  synonyms: string[]
}

interface IVocabularyActive {
  total: number
  evaluation: string
  level_thresholds: {
    current_level: string
    next_level: string
    current_level_words: number
    next_level_threshold: number
  }
}

interface IVocabularyUnique {
  list: string[]
  count: number
}

interface IVocabularyRareWords {
  percentage: string
  examples: string[]
}

interface IVocabularyFrequentWords {
  percentage: string
  examples: string[]
}

interface IVocabularyWordSampleByLevel {
  A1: IVocabularyLevel
  A2: IVocabularyLevel
  B1: IVocabularyLevel
  B2: IVocabularyLevel
  C1: IVocabularyLevel
  C2: IVocabularyLevel
}

interface IVocabulary {
  active_vocab: IVocabularyActive
  unique_words: IVocabularyUnique
  rare_words: IVocabularyRareWords
  frequently_used_words: IVocabularyFrequentWords
  word_sample_by_level: IVocabularyWordSampleByLevel
  suggestions: string[]
}

export interface IAnalysisResponse {
  confidence: IConfidence
  coherence: ICoherence
  grammar: IGrammar
  vocabulary: IVocabulary
}
