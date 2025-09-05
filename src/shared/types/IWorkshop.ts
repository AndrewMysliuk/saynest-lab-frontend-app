import { IDictionaryEntry, IIELTSScenarioDetails, IPhraseEntry, IPromptGoal, IScenarioDetails } from "./IPromt"
import { VocabularyFrequencyLevelEnum } from "./IVocabulary"

export interface IWorkshopSelectFieldOptions {
  label: string
  value: string
}

export type WorkshopEntryType = "goals" | "dictionary" | "phrases"

export type WorkshopItemMap = {
  goals: IPromptGoal
  dictionary: IDictionaryEntry
  phrases: IPhraseEntry
}

export interface IWorkshopFieldDef {
  key: keyof IPromptGoal | keyof IDictionaryEntry | keyof IPhraseEntry
  placeholder: string
  class?: string
}

export enum WorkshopScenarioTypeEnum {
  DIALOG = "DIALOG",
  IELTS = "IELTS",
}

export enum WorkshopVisabilityEnum {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  TEAM_ONLY = "TEAM_ONLY",
}

export interface IWorkshopScenarioBasicInformation {
  title: string
  description: string
  target_language: string
  scenario_type: WorkshopScenarioTypeEnum
  difficulty_level: VocabularyFrequencyLevelEnum
  visibility: WorkshopVisabilityEnum
  allow_copying: boolean
  is_module_only: boolean
}

export interface IWorkshopScenarioContent {
  user_goals: IPromptGoal[]
  user_dictionary: IDictionaryEntry[]
  user_phrases: IPhraseEntry[]
  dialog_behavior: IScenarioDetails
  ielts_behavior: IIELTSScenarioDetails
}

export interface IWorkshopScenarioMetadataActions {
  model_end_behavior: string
}

export interface IWorkshopScenario {
  basic_information: IWorkshopScenarioBasicInformation
  scenario_content: IWorkshopScenarioContent
  metadata_actions: IWorkshopScenarioMetadataActions
}
