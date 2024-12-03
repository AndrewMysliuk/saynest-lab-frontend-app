import { DirectiveBinding, watchEffect } from "vue"

export const animateTextDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<{ text: string }>) {
    const { text } = binding.value
    const instance = binding.instance as any
    const audioElementRef = instance?.audioElementRef
    let index = 0
    let animationFrameId: number

    const animationSpeedPerChar = 50

    const updateAnimation = (audioElement: HTMLAudioElement) => {
      if (!audioElement) return

      const animate = () => {
        const currentTime = audioElement.currentTime

        const targetIndex = Math.floor((currentTime * 1000) / animationSpeedPerChar)

        if (index < targetIndex && index < text.length) {
          index++
          el.innerHTML = text
            .split("")
            .map((char, i) => (i <= index ? `<span class="--black">${char}</span>` : `<span class="--gray">${char}</span>`))
            .join("")
        }

        if (index < text.length) {
          animationFrameId = requestAnimationFrame(animate)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const resetAnimation = (audioElement: HTMLAudioElement) => {
      if (audioElement.currentTime === 0) {
        cancelAnimationFrame(animationFrameId)
        index = 0
        el.innerHTML = text
          .split("")
          .map((char) => `<span class="--gray">${char}</span>`)
          .join("")
        updateAnimation(audioElement)
      }
    }

    watchEffect(() => {
      if (audioElementRef) {
        updateAnimation(audioElementRef)

        audioElementRef.addEventListener("timeupdate", () => resetAnimation(audioElementRef))
      }
    })

    el._cleanup = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)

      if (audioElementRef) {
        audioElementRef.removeEventListener("timeupdate", () => resetAnimation(audioElementRef))
      }
    }
  },

  unmounted(el: HTMLElement) {
    el._cleanup?.()
  },
}
