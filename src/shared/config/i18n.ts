import { createI18n } from "vue-i18n"

export const SUPPORT_LOCALES = ["en", "es", "fr", "pt", "de", "it", "pl", "uk", "bg"] as const

export type AppLocale = (typeof SUPPORT_LOCALES)[number]

const DEFAULT_LOCALE: AppLocale = "en"

function loadLocaleMessages() {
  const messages: Record<string, any> = {}
  const locales = import.meta.glob("../locales/*.json", { eager: true })
  for (const path in locales) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i)
    if (matched && matched[1]) {
      const locale = matched[1]
      messages[locale] = (locales[path] as any).default
    }
  }
  return messages
}

function getStartLocale(): AppLocale {
  const saved = localStorage.getItem("locale") as AppLocale | null
  if (saved && SUPPORT_LOCALES.includes(saved)) return saved

  const browserLang = navigator.language.split("-")[0] as AppLocale
  if (SUPPORT_LOCALES.includes(browserLang)) return browserLang

  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getStartLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: loadLocaleMessages(),
})

document.documentElement.setAttribute("lang", i18n.global.locale.value)
