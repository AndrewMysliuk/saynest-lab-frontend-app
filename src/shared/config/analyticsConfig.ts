import { isProduction } from "../utils"

export const gtmConfig = {
  id: import.meta.env.VITE_GTM_ID,
  enabled: isProduction,
  debug: !isProduction,
  // enabled: true,
}
