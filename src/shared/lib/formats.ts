import { IErrorAnalysisEntity } from "../types"

export function formatCorrections(data: IErrorAnalysisEntity): string {
  if (!data.has_errors || !data.issues.length) return ""

  let fixedSentence = data.last_user_message
  const explanations: string[] = []

  const sortedIssues = [...data.issues].sort((a, b) => b.original_text.length - a.original_text.length)

  sortedIssues.forEach((issue) => {
    const { original_text, corrected_text, explanation } = issue

    const escapedOriginal = original_text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(escapedOriginal, "i")

    fixedSentence = fixedSentence.replace(regex, `<span class="ea-highlight">${corrected_text}</span>`)

    if (!explanations.includes(explanation)) {
      explanations.push(explanation)
    }
  })

  const explanationHtml = explanations.map((explanation) => `<li>${explanation}</li>`).join("")

  return `
    <div class="ea-container" onclick="this.classList.toggle('ea-expanded')">
      <p class="ea-corrected"><b>Suggestion:</b> ${fixedSentence}</p>
      <div class="ea-explanation-block">
        <ul class="ea-explanation-list">${explanationHtml}</ul>
      </div>
    </div>
  `
}
