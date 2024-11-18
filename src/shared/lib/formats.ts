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

export const removeCorrections = (originalText: string): string => {
  if (!originalText) return ""

  let result = ""
  let startIndex = 0

  while (true) {
    const correctionStart = originalText.indexOf("[CORRECTION:", startIndex)
    if (correctionStart === -1) break

    result += originalText.slice(startIndex, correctionStart)

    const correctionEnd = originalText.indexOf('"]', correctionStart)
    if (correctionEnd === -1) break

    startIndex = correctionEnd + 2
  }

  result += originalText.slice(startIndex)

  return result.trim()
}

const processCorrectionContent = (input: string): string => {
  const wrongPattern = /\[WRONG:\s*([^\]]+)\]/g
  const properlyPattern = /\[PROPERLY:\s*([^\]]+)\]/g

  const withWrongSpans = input.replace(wrongPattern, (_, word) => `<span class="--wrong">${word}</span>`)
  const withProperlySpans = withWrongSpans.replace(properlyPattern, (_, word) => `<span class="--properly">${word}</span>`)

  return withProperlySpans
}

export const parseCorrection = (originalText: string): string => {
  if (!originalText) return ""

  let result = ""
  let startIndex = 0

  while (true) {
    const correctionStart = originalText.indexOf("[CORRECTION:", startIndex)

    if (correctionStart === -1) break

    const correctionEnd = originalText.indexOf('"]', correctionStart)
    if (correctionEnd === -1) break

    const correctionContent = originalText.slice(correctionStart + 12, correctionEnd)

    const processedCorrection = processCorrectionContent(correctionContent)

    result += processedCorrection
    startIndex = correctionEnd + 2
  }

  return result.trim()
}
