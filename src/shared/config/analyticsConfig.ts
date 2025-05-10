export const gtmConfig = {
  id: import.meta.env.VITE_GTM_ID,
  enabled: import.meta.env.MODE !== "development",
  debug: import.meta.env.MODE === "development",
}
