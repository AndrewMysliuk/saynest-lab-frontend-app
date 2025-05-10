<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <form class="w-full max-w-md bg-surface p-8 rounded-xl shadow-soft space-y-6" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-semibold text-text-base text-center">Login</h2>

      <div ref="googleDiv" class="flex justify-center" />

      <div>
        <label for="email" class="block text-sm font-medium text-text-muted">Email</label>
        <input
          id="email"
          v-model="loginPayload.email"
          type="email"
          placeholder="Enter your email"
          required
          class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-text-muted">Password</label>
        <input
          id="password"
          v-model="loginPayload.password"
          type="password"
          placeholder="Enter your password"
          required
          class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div v-if="isProduction">
        <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
      </div>

      <div v-if="errorMessage" class="text-sm text-red-600 bg-red-100 border border-red-200 rounded-md p-3">
        {{ errorMessage }}
      </div>

      <div class="flex justify-between gap-4">
        <button
          type="button"
          @click="$router.push({ name: 'auth.signup' })"
          :disabled="isGoogleProcessing"
          class="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-text-muted bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>

        <button
          type="submit"
          :disabled="isGoogleProcessing"
          class="w-1/2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primaryDark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log In
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import { authStore } from "@/app"
import { defineComponent, onMounted, ref } from "vue"
import { isProduction } from "@/shared/utils"
import { ILoginRequest } from "@/shared/types"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

export default defineComponent({
  components: {
    VueHcaptcha,
  },

  setup() {
    const googleDiv = ref<HTMLDivElement | null>(null)
    const loginCaptchaRef = ref<any>()
    const loginPayload = ref<ILoginRequest>({
      email: "",
      password: "",
      hcaptcha_token: "",
    })
    const errorMessage = ref<string | null>(null)
    const isGoogleProcessing = ref<boolean>(false)

    onMounted(() => {
      const interval = setInterval(() => {
        if (tryInitGoogle()) {
          clearInterval(interval)
        }
      }, 100)
    })

    const tryInitGoogle = () => {
      if (window.google?.accounts?.id && googleDiv.value) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(googleDiv.value, {
          theme: "outline",
          size: "large",
        })

        setTimeout(() => {
          const button = googleDiv.value?.querySelector('div[role="button"]')

          if (button) {
            button.addEventListener("click", () => {
              window.dataLayer = window.dataLayer || []
              window.dataLayer.push({
                event: "GOOGLE_LOGIN_CLICK",
                method: "google_button",
                location: "login_form",
              })
            })
          }
        }, 500)

        return true
      }
      return false
    }

    const handleCredentialResponse = async (response: any) => {
      try {
        isGoogleProcessing.value = true
        errorMessage.value = null

        await authStore.fetchGoogle(response.credential)
      } catch (error: unknown) {
        errorMessage.value = "Something went wrong. Please try again."
      } finally {
        setTimeout(() => {
          isGoogleProcessing.value = false
          errorMessage.value = null
        }, 3000)
      }
    }

    const loginCodeCaptcha = (token: string) => {
      loginPayload.value.hcaptcha_token = token
    }

    const onSubmit = async () => {
      if (isGoogleProcessing.value) return

      try {
        errorMessage.value = null
        await authStore.fetchLogin(loginPayload.value)
      } catch (error: any) {
        if (error?.response?.status === 401) {
          errorMessage.value = "Invalid email or password"
        } else {
          errorMessage.value = "Something went wrong. Please try again."
        }
      } finally {
        setTimeout(() => {
          errorMessage.value = null
        }, 3000)
      }
    }

    return {
      googleDiv,
      isGoogleProcessing,
      loginCaptchaRef,
      loginPayload,
      errorMessage,
      onSubmit,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
