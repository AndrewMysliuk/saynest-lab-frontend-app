import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { userStore } from "@/app"
import router from "@/app/router"
import { registerHandler, loginHandler, refreshAccessTokenHandler, logoutHandler, googleHandler } from "../api"
import { ILoginRequest, IRegisterRequest } from "../types"

export const useAuthStore = defineStore("authStore", () => {
  const isLogged = ref<boolean>(false)
  const accessToken = ref<string | null>(null)

  const getIsLogged = computed(() => isLogged.value)
  const getAccessToken = computed(() => accessToken.value)

  const initializeAuthStore = () => {
    const token = localStorage.getItem("access_token")

    if (token) {
      accessToken.value = token
      isLogged.value = true
    }
  }

  const fetchGoogle = async (id_token: string) => {
    try {
      const response = await googleHandler(id_token)

      accessToken.value = response.access_token
      localStorage.setItem("access_token", response.access_token)

      userStore.setUserData(response.user)

      isLogged.value = true

      router.push({ name: "platform.conversation-dashboard" })
    } catch (error: unknown) {
      throw error
    }
  }

  const fetchRegister = async (payload: IRegisterRequest) => {
    try {
      const response = await registerHandler(payload)

      accessToken.value = response.access_token
      localStorage.setItem("access_token", response.access_token)

      userStore.setUserData(response.user)

      isLogged.value = true

      router.push({ name: "platform.conversation-dashboard" })
    } catch (error: unknown) {
      throw error
    }
  }

  const fetchLogin = async (payload: ILoginRequest) => {
    try {
      const response = await loginHandler(payload)

      accessToken.value = response.access_token
      localStorage.setItem("access_token", response.access_token)

      userStore.setUserData(response.user)

      isLogged.value = true

      router.push({ name: "platform.conversation-dashboard" })
    } catch (error: unknown) {
      throw error
    }
  }

  const fetchRefreshAccessToken = async () => {
    try {
      const token = await refreshAccessTokenHandler()
      accessToken.value = token
      localStorage.setItem("access_token", token)
      isLogged.value = true
    } catch (error: unknown) {
      throw error
    }
  }

  const fetchLogout = async () => {
    try {
      await logoutHandler()
    } catch (error: unknown) {
      throw error
    } finally {
      accessToken.value = null
      localStorage.removeItem("access_token")
      isLogged.value = false

      router.push({ name: "auth.login" })
    }
  }

  return {
    getIsLogged,
    getAccessToken,
    initializeAuthStore,
    fetchRegister,
    fetchLogin,
    fetchRefreshAccessToken,
    fetchLogout,
    fetchGoogle,
  }
})
