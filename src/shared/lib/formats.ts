import { ICorrection } from "../types"

// Input: 2023-01-01T00:01:05.340Z
// Output: 01:05.34
export const formatTimeForLogs = (start_time: string, timestamp: string): string => {
  const t0 = new Date(start_time).valueOf()
  const t1 = new Date(timestamp).valueOf()
  const delta = t1 - t0

  const hs = Math.floor(delta / 10) % 100
  const s = Math.floor(delta / 1000) % 60
  const m = Math.floor(delta / 60_000) % 60

  const pad = (n: number) => {
    let s = n.toString()
    while (s.length < 2) {
      s = "0" + s
    }
    return s
  }

  return `${pad(m)}:${pad(s)}.${pad(hs)}`
}

export const parseData = (input: string) => {
  return input
    .split("||")
    .filter(Boolean)
    .map((pair) => {
      const [question, answer] = pair.split("|").map((item) => item.trim().replace(/^"|"$/g, ""))
      return { question, answer }
    })
}

export function formatCorrections(corrections: ICorrection[]): string {
  return corrections
    .map((correction) => {
      const variations = correction.variations.map((variation) => `<span class="--wrong">${variation.wrong}</span> -> <span class="--properly">${variation.properly}</span>`).join(", ")
      return `<b>Corrections:</b> ${variations}. <b>Original:</b>  <i>${correction.original}</i>`
    })
    .join("<br>")
}
