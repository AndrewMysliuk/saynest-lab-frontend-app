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

  const setVisitor = (name: string, email: string) => {
    whenReady(() => {
      window.Tawk_API.setAttributes(
        {
          name,
          email,
        },
        (err: unknown) => {
          if (err) console.error("Tawk setAttributes error:", err)
        }
      )
    })
  }

  const show = () => whenReady(() => window.Tawk_API.showWidget())
  const hide = () => whenReady(() => window.Tawk_API.hideWidget())
  const open = () => whenReady(() => window.Tawk_API.maximize())
  const close = () => whenReady(() => window.Tawk_API.minimize())

  return {
    setVisitor,
    show,
    hide,
    open,
    close,
  }
}
