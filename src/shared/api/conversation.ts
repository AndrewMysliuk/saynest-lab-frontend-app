import { IConversationPayload, IConversationResponse, ConversationStreamEvent, StreamEventEnum } from "@/shared/types"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export const createConversationHandler = async (payload: IConversationPayload, onData: (data: ConversationStreamEvent) => void, abortSignal: AbortSignal): Promise<IConversationResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([payload.whisper.audio_file], "audio.wav", { type: "audio/wav" }))
    formData.append("whisper", JSON.stringify(payload.whisper))
    formData.append("gpt_model", JSON.stringify(payload.gpt_model))
    formData.append("tts", JSON.stringify(payload.tts))
    formData.append("system", JSON.stringify(payload.system))
    formData.append("target_language", JSON.stringify(payload.target_language))
    formData.append("explanation_language", JSON.stringify(payload.explanation_language))

    const response = await fetch(`${VITE_API_CORE_URL}/api/conversation`, {
      method: "POST",
      body: formData,
      signal: abortSignal,
    })

    if (!response.body) {
      throw new Error("ReadableStream not supported")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let buffer = ""
    let fullResponse: IConversationResponse | null = null

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        try {
          const parsed = JSON.parse(trimmed)

          if (parsed.type === StreamEventEnum.COMPLETE) {
            fullResponse = parsed
            continue
          }

          if (parsed.type === StreamEventEnum.ERROR) {
            onData({ type: StreamEventEnum.ERROR, role: "system", content: `AI Error: ${parsed.text}` })
            continue
          }

          onData(parsed)
        } catch (err) {
          throw new Error(`Stream parse error: ${err}, \nRaw line: ${line}`)
        }
      }
    }

    if (!fullResponse) {
      throw new Error("Missing final response")
    }

    return fullResponse
  } catch (error: any) {
    if (error?.name === "AbortError") {
      console.warn("Request was aborted. Possibly user navigated away mid-conversation. Shrug.")
    }

    throw error
  }
}
