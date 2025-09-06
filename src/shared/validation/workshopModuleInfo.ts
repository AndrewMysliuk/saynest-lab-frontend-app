import { z } from "zod"

export const ModuleInfoSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).max(120, { message: "Title must be at most 120 characters" }),
  description: z.string().min(1, { message: "Description cannot be empty" }).max(600, { message: "Description must be at most 600 characters" }),
  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .max(10, { message: "You can provide at most 10 tags" })
    .default([]),
})

export type WorkshopModuleInfo = z.infer<typeof ModuleInfoSchema>
