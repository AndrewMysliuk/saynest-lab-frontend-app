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
