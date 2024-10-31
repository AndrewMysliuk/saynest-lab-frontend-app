import { axios } from "@/shared/config"
import { AxiosResponse } from "axios"
import { IConversationPayload, IConversationResponse, IWhisperResponse } from "@/shared/types"

export const whisperSpeachToTextMethod = async (audio: Blob, prompt?: string): Promise<IWhisperResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([audio], "audio.wav", { type: "audio/wav" }))

    if (prompt) {
      formData.append("prompt", prompt)
    }

    const response: AxiosResponse<IWhisperResponse> = await axios({
      url: "/api/whisper",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    const { data }: { data: IWhisperResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const conversationMethod = async (payload: IConversationPayload): Promise<IConversationResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([payload.whisper.audioFile], "audio.wav", { type: "audio/wav" }))

    formData.append("whisper", JSON.stringify(payload.whisper))
    formData.append("gpt_model", JSON.stringify(payload.gpt_model))
    formData.append("tts", JSON.stringify(payload.tts))

    const response: AxiosResponse<IConversationResponse> = await axios({
      url: "/api/conversation",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    const { data }: { data: IConversationResponse } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
