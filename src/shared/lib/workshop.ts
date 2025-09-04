import { IWorkshopScenarioBasicInformation, IWorkshopScenarioContent, IWorkshopScenarioMetadataActions, VocabularyFrequencyLevelEnum, WorkshopScenarioTypeEnum, WorkshopVisabilityEnum } from "../types"

export const DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION: IWorkshopScenarioBasicInformation = {
  title: "",
  description: "",
  target_language: sessionStorage.getItem("learning-language") ?? "en",
  scenario_type: WorkshopScenarioTypeEnum.DIALOG,
  difficulty_levels: VocabularyFrequencyLevelEnum.B1,
  tags: [],
  visibility: WorkshopVisabilityEnum.PRIVATE,
  allow_copying: true,
  is_module_only: false,
}

export const DEFAULT_WORKSHOP_SCENARIO_CONTENT: IWorkshopScenarioContent = {
  user_goals: [],
  user_dictionary: [],
  user_phrases: [],
  dialog_behavior: {
    setting: "",
    situation: "",
    goal: "",
    steps: [""],
    optional_steps: [],
  },
  ielts_behavior: {
    setting: "You are taking the IELTS Speaking test. The examiner will ask you questions in three parts.",
    part1: {
      topics: [
        {
          title: "",
          questions: [""],
        },
      ],
    },
    part2: {
      title: "",
      question: "",
      bullet_points: [""],
    },
    part3: {
      topics: [
        {
          title: "",
          questions: [""],
        },
      ],
    },
  },
}

export const DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS: IWorkshopScenarioMetadataActions = {
  estimated_duration_minutes: "",
  max_turns: "",
  model_end_behavior: "Great job! You've completed this scenario.",
  question_count_range: {
    min: "",
    max: "",
  },
  is_ielts: false,
}
