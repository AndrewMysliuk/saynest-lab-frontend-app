import { IConversationPayload, IConversationHistory, IConversationHistoryGPT, IConversationHistoryTTS, IConversationResponse } from "@/shared/types"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export const createConversationHandler = async (
  payload: IConversationPayload,
  onData: (data: IConversationHistory | IConversationHistoryGPT | IConversationHistoryTTS) => void
): Promise<IConversationResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([payload.whisper.audio_file], "audio.wav", { type: "audio/wav" }))
    formData.append("whisper", JSON.stringify(payload.whisper))
    formData.append("gpt_model", JSON.stringify(payload.gpt_model))
    formData.append("tts", JSON.stringify(payload.tts))
    formData.append("system", JSON.stringify(payload.system))

    const response = await fetch(`${VITE_API_CORE_URL}/api/conversation`, {
      method: "POST",
      body: formData,
    })

    if (!response.body) {
      throw new Error("ReadableStream not supported by the response")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let fullResponse = {} as IConversationResponse

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })

      const lines = chunk.split("\n").filter((line) => line.trim() !== "")
      for (const line of lines) {
        try {
          const parsedData = JSON.parse(line)

          if ("session_id" in parsedData) {
            fullResponse = {
              ...parsedData,
            }
          }

          if (parsedData.role === "user" && "content" in parsedData) {
            const userResponse = parsedData as IConversationHistory
            onData(userResponse)
          } else if (parsedData.role === "assistant" && "content" in parsedData) {
            const gptResponse = parsedData as IConversationHistoryGPT
            onData(gptResponse)
          } else if (parsedData.role === "assistant" && "audio_chunk" in parsedData) {
            const ttsResponse = parsedData as IConversationHistoryTTS
            onData(ttsResponse)
          }
        } catch (error: unknown) {
          console.error(`Error parsing JSON line: ${error}`)
        }
      }
    }

    return fullResponse
  } catch (error: unknown) {
    throw error
  }
}
