let tawkScriptLoading: Promise<void> | null = null

const loadTawk = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve()

  if (window.Tawk_API) return Promise.resolve()

  if (tawkScriptLoading) return tawkScriptLoading

  tawkScriptLoading = new Promise((resolve, reject) => {
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement("script")
    script.src = "https://embed.tawk.to/686a41b7a86aec190ca6a887/1ivfh1dcp"
    script.async = true
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")

    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Tawk script load failed"))

    document.body.appendChild(script)
  })

  return tawkScriptLoading
}

export const useTawk = () => {
  const isReady = () => typeof window !== "undefined" && !!window.Tawk_API && typeof window.Tawk_API.showWidget === "function"

  const whenReady = (cb: () => void) => {
    if (isReady()) return cb()

    const interval = setInterval(() => {
      if (isReady()) {
        clearInterval(interval)
        cb()
      }
    }, 100)
  }

  const init = async () => {
    await loadTawk()
  }

  const setVisitor = (name: string, email: string) => {
    whenReady(() => {
      window.Tawk_API.setAttributes({ name, email }, (err: unknown) => {
        if (err) console.error("Tawk setAttributes error:", err)
      })
    })
  }

  const show = () => whenReady(() => window.Tawk_API.showWidget())
  const hide = () => whenReady(() => window.Tawk_API.hideWidget())
  const open = () => whenReady(() => window.Tawk_API.maximize())
  const close = () => whenReady(() => window.Tawk_API.minimize())

  return {
    init,
    setVisitor,
    show,
    hide,
    open,
    close,
  }
}
