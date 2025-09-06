import { z } from "zod"

export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80)

export const norm = (s: string) => s.normalize("NFKC").trim()
export const canon = (s: string) => norm(s).toLowerCase().replace(/\s+/g, " ")

export const enumValues = <T extends Record<string, string>>(e: T) => Object.values(e) as [T[keyof T], ...T[keyof T][]]

export function validatePartial<TSchema extends z.ZodTypeAny, K extends readonly (keyof z.infer<TSchema>)[]>(schema: TSchema, keys: K, payload: Pick<z.infer<TSchema>, K[number]>) {
  const mask: Record<string, true> = {}
  for (const k of keys) mask[k as string] = true

  const picked = (schema as any).pick(mask) as z.ZodType<Pick<z.infer<TSchema>, K[number]>>

  const res = picked.safeParse(payload)

  if (res.success) {
    return { ok: true as const, data: res.data, errors: {} as Record<string, string> }
  }

  const errors: Record<string, string> = {}
  for (const issue of res.error.issues) {
    const pathKey = String(issue.path[0] ?? "")
    if (pathKey && !errors[pathKey]) errors[pathKey] = issue.message
  }
  return { ok: false as const, errors }
}

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" })
