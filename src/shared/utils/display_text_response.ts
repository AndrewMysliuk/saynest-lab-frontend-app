type TypewriterOptions = {
  delayPerChar?: number
  onChar: (char: string) => void
  onChunkComplete?: () => void
}

export function createTypewriterStream({ delayPerChar = 20, onChar, onChunkComplete }: TypewriterOptions) {
  let queue: string[] = []
  let isTyping = false

  const processQueue = async () => {
    if (isTyping) return
    isTyping = true

    while (queue.length > 0) {
      const char = queue.shift()!
      onChar(char)
      await new Promise((r) => setTimeout(r, delayPerChar))
    }

    isTyping = false
    onChunkComplete?.()
  }

  return function feedChunk(chunk: string) {
    queue.push(...chunk.split(""))
    processQueue()
  }
}

export const normalizeTrim = (str: string) =>
  str
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/[\u00A0\u200B]+/g, "") // remove non-breaking and zero-width spaces
    .replace(/[.,!?;:"'()\[\]{}\-–—…]/g, "") // remove common punctuation
    .trim()
    .toLowerCase()
