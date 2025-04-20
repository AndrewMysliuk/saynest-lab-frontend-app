import { IErrorAnalysisEntity } from "../types"

export function formatCorrections(data: IErrorAnalysisEntity): string {
  if (!data.has_errors || !data.issues.length) return ""

  let fixedSentence = data.last_user_message
  const explanations: string[] = []

  const sortedIssues = [...data.issues].sort((a, b) => b.original_text.length - a.original_text.length)

  sortedIssues.forEach((issue) => {
    const { error_words, corrected_words, explanation } = issue

    error_words.forEach((errorWord, index) => {
      const correctedWord = corrected_words[index]?.value || errorWord.value
      const escapedWord = errorWord.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi")
      fixedSentence = fixedSentence.replace(regex, `<span class="ea-highlight">${correctedWord}</span>`)
    })

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
