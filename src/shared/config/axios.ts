import axios from "axios"
import { authStore } from "@/app"

const baseURL = import.meta.env.VITE_API_CORE_URL ?? ""

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL,
})

const refreshAxios = axios.create({
  withCredentials: true,
  baseURL,
})

let isRefreshing = false
let failedQueue: any[] = []
let refreshRetryCount = 0
const MAX_REFRESH_RETRIES = 2

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

axiosInstance.interceptors.request.use((config) => {
  const token = authStore.getAccessToken

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && authStore.getIsLogged) {
      if (!originalRequest._retry) {
        if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
          authStore.fetchLogout()
          return Promise.reject(error)
        }

        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`
              return axiosInstance(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        isRefreshing = true
        refreshRetryCount++

        try {
          await authStore.fetchRefreshAccessToken()

          const token = authStore.getAccessToken
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`

          processQueue(null, token)

          return axiosInstance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          authStore.fetchLogout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }
    }

    return Promise.reject(error)
  }
)

export { axiosInstance as axios, refreshAxios as refreshAxios }
