import { axios } from "@/shared/config"
import { AxiosResponse } from "axios"
import { IWhisperResponse } from "@/shared/types"

export const whisperSpeachToTextMethod = async (audio: Blob, prompt?: string): Promise<IWhisperResponse> => {
  try {
    const formData = new FormData()
    formData.append("audio", new File([audio], "audio.webm", { type: "audio/webm" }))

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
