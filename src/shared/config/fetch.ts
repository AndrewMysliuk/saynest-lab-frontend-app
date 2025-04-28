import { authStore } from "@/app"

export const authenticatedFetch = async (input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> => {
  const token = authStore.getAccessToken

  const headers = new Headers(init.headers || {})
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  try {
    const response = await fetch(input, { ...init, headers })

    if (response.status === 401 && authStore.getIsLogged && retry) {
      try {
        await authStore.fetchRefreshAccessToken()
        const newToken = authStore.getAccessToken

        const newHeaders = new Headers(init.headers || {})
        if (newToken) {
          newHeaders.set("Authorization", `Bearer ${newToken}`)
        }

        return fetch(input, { ...init, headers: newHeaders })
      } catch (refreshError) {
        authStore.fetchLogout()
        throw refreshError
      }
    }

    return response
  } catch (error) {
    throw error
  }
}
