interface IHighlighted {
  incorrect_parts: string[]
  corrected_parts: string[]
}

interface IGrammarError {
  original: string
  highlighted: IHighlighted
  corrected_sentence: string
}

interface IGrammar {
  errors: IGrammarError[]
  summary: string
}

interface IConfidence {
  score: number
  examples: string[]
  suggestions: string[]
}

interface ICoherence {
  score: number
  examples: string[]
  suggestions: string[]
  corrected_sentence: string
}

interface ILevelThresholds {
  current_level: string
  next_level: string
  current_level_words: number
  next_level_threshold: number
}

interface IActiveVocabulary {
  total: number
  evaluation: string
  level_thresholds: ILevelThresholds
}

interface IUniqueWords {
  list: string[]
  count: number
}

interface IRareWords {
  percentage: string
  examples: string[]
}

interface IFrequentlyUsedWords {
  percentage: string
  examples: string[]
}

interface IWordsByLevel {
  words: string[]
  synonyms: string[]
}

interface IWordSampleByLevel {
  A1: IWordsByLevel
  A2: IWordsByLevel
  B1: IWordsByLevel
  B2: IWordsByLevel
  C1: IWordsByLevel
  C2: IWordsByLevel
}

interface IVocabulary {
  active_vocab: IActiveVocabulary
  unique_words: IUniqueWords
  rare_words: IRareWords
  frequently_used_words: IFrequentlyUsedWords
  word_sample_by_level: IWordSampleByLevel
  suggestions: string[]
}

export interface IAnalysisResult {
  confidence: IConfidence
  coherence: ICoherence
  grammar: IGrammar
  vocabulary: IVocabulary
}
