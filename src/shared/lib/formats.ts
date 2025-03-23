import { IErrorAnalysisEntity, IWord } from "../types"

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

export function formatCorrections(correction: IErrorAnalysisEntity): string {
  if (!correction.has_errors || !correction.issues.length) return ""

  const highlightWords = (text: string, words: IWord[], className: string) => {
    let result = text
    for (const word of words) {
      const escaped = word.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${escaped}\\b`, "gi")
      result = result.replace(regex, `<span class="${className}">${word.value}</span>`)
    }
    return result
  }

  return correction.issues
    .map((issue) => {
      const highlightedOriginal = highlightWords(issue.original_text, issue.error_words, "--wrong")
      const highlightedCorrected = highlightWords(issue.corrected_text, issue.corrected_words, "--properly")

      return `
        <div class="issue-block">
          <b>Original:</b> ${highlightedOriginal}<br>
          <b>Corrected:</b> ${highlightedCorrected}<br>
          <b>Explanation:</b> <i>${issue.explanation}</i><br>
          <hr>
        </div>
      `
    })
    .join("")
}
