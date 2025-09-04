import { App } from "vue"

import inputmaskDirective from "./InputMask"

// register all directives
const directives = (app: App<Element>) => {
  inputmaskDirective(app)
}

export default directives
