import { z } from "zod"

export const TranslationSchema = z
  .union([
    z.string().min(1, { message: "Translation must not be empty" }),
    z.record(
      z.string().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, {
        message: "Key must be a valid language code (e.g. en, en-US)",
      }),
      z.string().min(1, { message: "Translation value must not be empty" })
    ),
    z.literal(""),
  ])
  .optional()

export const GoalSchema = z.object({
  phrase: z.string().min(1, { message: "Goal is required" }).max(180, { message: "Phrase must be at most 180 characters" }),
  translation: TranslationSchema,
})

export const DictionaryEntrySchema = z.object({
  word: z.string().min(1, { message: "Word is required" }).max(80, { message: "Word must be at most 80 characters" }),
  meaning: z.string().max(240, { message: "Meaning must be at most 240 characters" }).optional(),
  translation: TranslationSchema,
})

export const PhraseEntrySchema = z.object({
  phrase: z.string().min(1, { message: "Phrase is required" }).max(180, { message: "Phrase must be at most 180 characters" }),
  meaning: z.string().max(240, { message: "Meaning must be at most 240 characters" }).optional(),
  translation: TranslationSchema,
})

// ---- dialog ----
export const DialogBehaviorSchema = z.object({
  setting: z.string().min(1, { message: "Setting must not be negative length" }).max(120, { message: "Setting must be at most 120 characters" }),
  situation: z.string().min(1, { message: "Situation must not be negative length" }).max(200, { message: "Situation must be at most 200 characters" }),
  goal: z.string().min(1, { message: "Goal must not be negative length" }).max(200, { message: "Goal must be at most 200 characters" }),
  steps: z.array(z.string().min(1, { message: "Step must not be negative length" }).max(200, { message: "Step must be at most 200 characters" })).min(1, { message: "At least one step is required" }),
})

// ---- ielts ----
/** Part 1 */
export const IELTSPart1Schema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Title must not be negative length" }).max(120, { message: "Title must be at most 120 characters" }),
        questions: z
          .array(z.string().min(1, { message: "Question must not be negative length" }).max(200, { message: "Question must be at most 200 characters" }))
          .min(1, { message: "At least one question is required in each Part 1 topic" }),
      })
    )
    .min(1, { message: "At least one topic is required in Part 1" }),
})

/** Part 2 */
export const IELTSPart2Schema = z.object({
  title: z.string().min(1, { message: "Title must not be negative length" }).max(120, { message: "Title must be at most 120 characters" }),
  question: z.string().min(1, { message: "Question must not be negative length" }).max(240, { message: "Question must be at most 240 characters" }),
  bullet_points: z
    .array(z.string().min(1, { message: "Bullet point must not be negative length" }).max(200, { message: "Bullet point must be at most 200 characters" }))
    .min(1, { message: "At least one bullet point is required in Part 2" }),
})

/** Part 3 */
export const IELTSPart3Schema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Title must not be negative length" }).max(120, { message: "Title must be at most 120 characters" }),
        questions: z
          .array(z.string().min(1, { message: "Question must not be negative length" }).max(200, { message: "Question must be at most 200 characters" }))
          .min(1, { message: "At least one question is required in each Part 3 topic" }),
      })
    )
    .min(1, { message: "At least one topic is required in Part 3" }),
})

export const IeltsBehaviorSchema = z.object({
  setting: z.string().min(1, { message: "Setting must not be negative length" }).max(240, { message: "Setting must be at most 240 characters" }),
  part1: IELTSPart1Schema,
  part2: IELTSPart2Schema,
  part3: IELTSPart3Schema,
})

// ---- full content ----
export const WorkshopScenarioContentSchema = z.object({
  user_goals: z.array(GoalSchema).optional(),
  user_dictionary: z.array(DictionaryEntrySchema).optional(),
  user_phrases: z.array(PhraseEntrySchema).optional(),
  dialog_behavior: DialogBehaviorSchema,
  ielts_behavior: IeltsBehaviorSchema,
})

export type WorkshopScenarioContent = z.infer<typeof WorkshopScenarioContentSchema>

export type IIELTSBehaviorErrors = {
  setting?: string
  part1?: {
    topicsGeneral?: string
    topics?: Array<{
      title?: string
      questionsGeneral?: string
      questions?: string[]
    }>
  }
  part2?: {
    title?: string
    question?: string
    bulletsGeneral?: string
    bullet_points?: string[]
  }
  part3?: {
    topicsGeneral?: string
    topics?: Array<{
      title?: string
      questionsGeneral?: string
      questions?: string[]
    }>
  }
}
