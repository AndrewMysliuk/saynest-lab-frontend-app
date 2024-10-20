export const useMicrophone = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return stream
  } catch (err) {
    console.error("Ошибка доступа к микрофону:", err)
    return null
  }
}

export const animateText = (text: string, updateFn: (text: string) => void, speed: number = 50) => {
  let index = 0
  let currentText = ""

  updateFn("")

  const interval = setInterval(() => {
    if (index < text.length) {
      currentText += text[index]
      updateFn(currentText)
      index++
    } else {
      clearInterval(interval)
    }
  }, speed)
}
