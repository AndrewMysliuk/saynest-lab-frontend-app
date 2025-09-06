import { z } from "zod"
import { objectIdSchema } from "./utils"

export const ModuleScenariosFlatSchema = z.object({
  scenarios: z.array(objectIdSchema).min(1, { message: "At least one scenario is required" }).max(100, { message: "You can provide at most 100 scenarios" }),
})

export type WorkshopModuleScenariosFlat = z.infer<typeof ModuleScenariosFlatSchema>
