import Inputmask from "inputmask"
import { App } from "vue"

const useInputmask = (app: App<Element>) => {
  app.directive("input-mask", {
    mounted(el, binding) {
      const options = typeof binding.value === "string" ? { alias: binding.value } : binding.value
      Inputmask(options).mask(el)
    },
    unmounted(el) {
      if (el) {
        Inputmask.remove(el)
      }
    },
  })
}

export default useInputmask
