import { z } from "zod"

export const WorkshopScenarioBasicInformationSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).max(120, { message: "Title must be at most 120 characters" }),
  description: z.string().min(1, { message: "Description cannot be empty" }).max(600, { message: "Description must be at most 600 characters" }),
})

export type WorkshopScenarioBasicInformation = z.infer<typeof WorkshopScenarioBasicInformationSchema>
