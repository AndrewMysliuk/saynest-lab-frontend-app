import { IDictionaryEntry, IPhraseEntry, IPromptGoal, IPromptScenario, VocabularyFrequencyLevelEnum } from "../types"

export function generatePromptFromScenario(raw: any): string {
  const scenario: IPromptScenario = transformSingleScenarioJson(raw)
  const { title, description, level, scenario: sc, prompt, meta } = scenario

  const stepsList = sc.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")

  return `
 You are in a scenario titled "${title}".
 Description: ${description}
 User proficiency level: ${level}
 
 Context:
 - Setting: ${sc.setting}
 - Situation: ${sc.situation}
 - Goal: ${sc.goal}
 
 Instructions:
 - ${prompt}
 - Always keep the conversation within the topic of "${title}".
 - Do not allow the user to switch to another language unless it's in the allowed list: [${sc.allowed_languages.join(", ")}].
 - Gently guide the user back to the topic if they go off-topic.
 - If the user doesn't initiate the conversation, you start it.
 - Follow these suggested conversation steps:
 ${stepsList}
 
 Meta:
 - This scenario is expected to last around ${meta.estimated_duration_minutes} minutes.
 - Try to wrap things up around ${meta.max_turns} turns, but be flexible.
 - When the conversation seems complete, use this closing message: "${meta.end_behavior}"
 `.trim()
}

export function transformSingleScenarioJson(item: any): IPromptScenario {
  const level = item.level?.toUpperCase?.() as keyof typeof VocabularyFrequencyLevelEnum
  const safeLevel = VocabularyFrequencyLevelEnum[level] || VocabularyFrequencyLevelEnum.B2

  return {
    title: item.title,
    description: item.description,
    level: safeLevel,
    goals: (item.goals || []).map(
      (goal: any): IPromptGoal => ({
        phrase: goal.phrase,
        translation: goal.translation,
        transcription_language: goal.transcription_language || undefined,
      })
    ),
    scenario: {
      allowed_languages: item.scenario.allowed_languages || ["English"],
      force_topic_focus: !!item.scenario.force_topic_focus,
      use_for: item.scenario.use_for || "model_guidance_only",
      setting: item.scenario.setting,
      situation: item.scenario.situation,
      goal: item.scenario.goal,
      steps: item.scenario.steps || [],
    },
    prompt: item.prompt,
    dictionary: (item.dictionary || []).map(
      (entry: any): IDictionaryEntry => ({
        word: entry.word,
        translation: entry.translation,
        meaning: entry.meaning,
      })
    ),
    phrases: (item.phrases || []).map(
      (entry: any): IPhraseEntry => ({
        phrase: entry.phrase,
        translation: entry.translation,
        meaning: entry.meaning,
      })
    ),
    meta: {
      estimated_duration_minutes: item.meta?.estimated_duration_minutes || 5,
      max_turns: item.meta?.max_turns || 10,
      end_behavior: item.meta?.end_behavior || "",
    },
    finally_prompt: "",
  }
}
