import { DirectiveBinding } from "vue"

export const animateTextDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const text: string = binding.value
    const speed: number = 67
    let index = 0

    el.innerHTML = text
      .split("")
      .map((char) => `<span class="--black">${char}</span>`)
      .join("")

    const interval = setInterval(() => {
      if (index < text.length) {
        el.innerHTML = text
          .split("")
          .map((char, i) => (i <= index ? `<span class="--black">${char}</span>` : `<span class="--gray">${char}</span>`))
          .join("")
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
  },
}
