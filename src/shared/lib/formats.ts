import { IErrorAnalysisEntity, IWord } from "../types"

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

      // <b>Explanation:</b> <i>${issue.explanation}</i><br>
      return `
        <div class="issue-block">
          <b>Original:</b> ${highlightedOriginal}<br>
          <b>Corrected:</b> ${highlightedCorrected}<br>
        </div>
      `
    })
    .join("")
}
