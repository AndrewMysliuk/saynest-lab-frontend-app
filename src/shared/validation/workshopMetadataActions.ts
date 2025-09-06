import { z } from "zod"

export const WorkshopScenarioMetadataActionsSchema = z.object({
  model_end_behavior: z.string().min(1, { message: "Closing phrase cannot be empty" }).max(240, { message: "Closing phrase must be at most 240 characters" }),
})

export type WorkshopScenarioMetadataActions = z.infer<typeof WorkshopScenarioMetadataActionsSchema>
