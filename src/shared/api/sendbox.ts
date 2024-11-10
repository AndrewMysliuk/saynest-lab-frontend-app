import { IConversationPayload, IConversationHistory, IConversationHistoryGPT, IConversationHistoryTTS, IConversationResponse, IGPTRequest, IGPTMessage } from "@/shared/types"

export const conversationMethod = async (
  payload: IConversationPayload,
  onData: (data: IConversationHistory | IConversationHistoryGPT | IConversationHistoryTTS | IConversationResponse) => void
): Promise<IConversationResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([payload.whisper.audioFile], "audio.wav", { type: "audio/wav" }))
    formData.append("whisper", JSON.stringify(payload.whisper))
    formData.append("gpt_model", JSON.stringify(payload.gpt_model))
    formData.append("tts", JSON.stringify(payload.tts))
    formData.append("system", JSON.stringify(payload.system))

    const response = await fetch("http://localhost:3001/api/conversation", {
      method: "POST",
      body: formData,
    })

    if (!response.body) {
      throw new Error("ReadableStream not supported by the response")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let fullResponse = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullResponse += chunk

      const lines = chunk.split("\n").filter((line) => line.trim() !== "")
      for (const line of lines) {
        try {
          const parsedData = JSON.parse(line)

          if ("session_id" in parsedData) {
            const fullHistoryData = parsedData as IConversationResponse
            return fullHistoryData
          } else if (parsedData.role === "user" && "content" in parsedData) {
            const userResponse = parsedData as IConversationHistory
            onData(userResponse)
          } else if (parsedData.role === "assistant" && "content" in parsedData) {
            const gptResponse = parsedData as IConversationHistoryGPT
            onData(gptResponse)
          } else if (parsedData.role === "assistant" && "audioChunk" in parsedData) {
            const ttsResponse = parsedData as IConversationHistoryTTS
            onData(ttsResponse)
          }
        } catch (error: unknown) {
          throw new Error(`Error parsing JSON line: ${error}`)
        }
      }
    }

    const fullData: IConversationResponse = JSON.parse(fullResponse.trim())
    return fullData
  } catch (error: unknown) {
    throw error
  }
}

export const tasksByGptModelMethod = async (payload: IGPTRequest, onData: (data: IGPTMessage) => void): Promise<IGPTMessage> => {
  try {
    const response = await fetch("http://localhost:3001/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.body) {
      throw new Error("ReadableStream not supported by the response")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let fullResponse = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullResponse += chunk

      const lines = chunk.split("\n").filter((line) => line.trim() !== "")
      for (const line of lines) {
        onData({ role: "assistant", content: line })
      }
    }

    return { role: "assistant", content: fullResponse.trim() }
  } catch (error: unknown) {
    throw error
  }
}
