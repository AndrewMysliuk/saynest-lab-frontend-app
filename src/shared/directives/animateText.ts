import { DirectiveBinding, watchEffect } from "vue"

export const animateTextDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<{ text: string }>) {
    const { text } = binding.value
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

    watchEffect(() => {
      const instance = binding.instance as any
      const audioElementRef = instance?.audioElementRef

      if (audioElementRef) {
        updateAnimation(audioElementRef)
      }
    })

    el._cleanup = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  },

  unmounted(el: HTMLElement) {
    el._cleanup?.()
  },
}
