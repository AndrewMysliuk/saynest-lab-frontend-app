import { z } from "zod"
import { objectIdSchema } from "./utils"

export const SubmoduleSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).max(120, { message: "Title must be at most 120 characters" }),
  description: z.string().min(1, { message: "Description cannot be empty" }).max(600, { message: "Description must be at most 600 characters" }),
  tips: z
    .array(z.string().min(1, { message: "Tip cannot be empty" }))
    .max(10, { message: "You can provide at most 10 tips" })
    .default([]),
  scenarios: z.array(objectIdSchema).min(1, { message: "At least one scenario is required" }).max(100, { message: "You can provide at most 100 scenarios" }),
})

export const ModuleStructureComplexSchema = z.object({
  submodules: z.array(SubmoduleSchema).min(1, { message: "At least one submodule is required" }),
})

export type WorkshopSubmodule = z.infer<typeof SubmoduleSchema>
export type WorkshopModuleStructureComplex = z.infer<typeof ModuleStructureComplexSchema>
