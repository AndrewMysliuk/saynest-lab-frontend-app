import { axios } from "../config"
import { AxiosResponse } from "axios"
import { IConversationPayload, IConversationHistory, IConversationHistoryGPT, IConversationHistoryTTS, IConversationResponse, IGPTRequest, IGPTMessage } from "@/shared/types"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export const conversationMethod = async (
  payload: IConversationPayload,
  onData: (data: IConversationHistory | IConversationHistoryGPT | IConversationHistoryTTS) => void
): Promise<IConversationResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([payload.whisper.audioFile], "audio.wav", { type: "audio/wav" }))
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
          } else if (parsedData.role === "assistant" && "audioChunk" in parsedData) {
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

export const tasksByGptModelMethod = async (payload: IGPTRequest): Promise<IGPTMessage> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/gpt",
      method: "POST",
      data: {
        ...payload,
      },
    })

    const toolCalls = response.data.choices?.[0]?.message?.tool_calls

    if (!toolCalls || !Array.isArray(toolCalls)) {
      throw new Error("No tools found in the response")
    }

    const firstTool = toolCalls[0]
    const argumentsParsed = JSON.parse(firstTool.function.arguments)

    return {
      role: "assistant",
      content: JSON.stringify(argumentsParsed),
    }
  } catch (error: unknown) {
    throw error
  }
}
