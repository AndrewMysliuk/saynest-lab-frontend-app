<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <form class="w-full max-w-md bg-surface p-8 rounded-xl shadow-soft space-y-6" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-semibold text-text-base text-center">Sign Up</h2>

      <div ref="googleDiv" class="flex justify-center" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="first_name" class="block text-sm font-medium text-text-muted">First Name</label>
          <input
            id="first_name"
            v-model="sigupPayload.first_name"
            type="text"
            placeholder="Enter your first name"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errorMessages.first_name" class="mt-1 text-sm text-red-600">{{ errorMessages.first_name }}</p>
        </div>

        <div>
          <label for="last_name" class="block text-sm font-medium text-text-muted">Last Name</label>
          <input
            id="last_name"
            v-model="sigupPayload.last_name"
            type="text"
            placeholder="Enter your last name"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errorMessages.last_name" class="mt-1 text-sm text-red-600">{{ errorMessages.last_name }}</p>
        </div>
      </div>

      <div>
        <label for="country" class="block text-sm font-medium text-text-muted">Country</label>
        <div class="relative">
          <select
            id="country"
            v-model="sigupPayload.country"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
          >
            <option value="" disabled>Select your country</option>
            <option v-for="country in countryOptions" :key="country.alpha_2" :value="country.alpha_2">
              {{ country.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p v-if="errorMessages.country" class="mt-1 text-sm text-red-600">{{ errorMessages.country }}</p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-text-muted">Email</label>
        <input
          id="email"
          v-model="sigupPayload.email"
          type="email"
          placeholder="Enter your email"
          required
          class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p v-if="errorMessages.email" class="mt-1 text-sm text-red-600">{{ errorMessages.email }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="password" class="block text-sm font-medium text-text-muted">Password</label>
          <input
            id="password"
            v-model="sigupPayload.password"
            type="password"
            placeholder="Enter your password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errorMessages.password" class="mt-1 text-sm text-red-600">{{ errorMessages.password }}</p>
        </div>

        <div>
          <label for="repeat_password" class="block text-sm font-medium text-text-muted">Repeat Password</label>
          <input
            id="repeat_password"
            v-model="repeatPassword"
            type="password"
            placeholder="Repeat your password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errorMessages.repeat_password" class="mt-1 text-sm text-red-600">{{ errorMessages.repeat_password }}</p>
        </div>
      </div>

      <div v-if="isProduction">
        <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
      </div>

      <div v-if="errorMessages?._global" class="text-sm text-red-600 bg-red-100 border border-red-200 rounded-md p-3">
        {{ errorMessages._global }}
      </div>

      <div class="flex justify-between gap-4">
        <button
          type="button"
          @click="$router.push({ name: 'auth.login' })"
          :disabled="isGoogleProcessing"
          class="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-text-muted bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log In
        </button>

        <button
          type="submit"
          :disabled="isGoogleProcessing"
          class="w-1/2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primaryDark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
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
import { IRegisterRequest } from "@/shared/types"
import CountryList from "@/shared/json_data/countries.json"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string

export default defineComponent({
  components: {
    VueHcaptcha,
  },

  setup() {
    const googleDiv = ref<HTMLDivElement | null>(null)
    const loginCaptchaRef = ref<any>()
    const sigupPayload = ref<IRegisterRequest>({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      country: "",
      hcaptcha_token: "default",
    })
    const repeatPassword = ref<string>("")
    const countryOptions = CountryList.map(({ name, alpha_2 }) => ({
      name,
      alpha_2,
    }))
    const errorMessages = ref<Record<string, string>>({})
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
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(googleDiv.value, {
          theme: "outline",
          size: "large",
        })

        return true
      }
      return false
    }

    const handleCredentialResponse = async (response: any) => {
      try {
        isGoogleProcessing.value = true
        errorMessages.value = {}

        await authStore.fetchGoogle(response.credential)
      } catch (error: unknown) {
        errorMessages.value._global = "Something went wrong. Please try again."
      } finally {
        setTimeout(() => {
          isGoogleProcessing.value = false
          errorMessages.value = {}
        }, 3000)
      }
    }

    const loginCodeCaptcha = (token: string) => {
      sigupPayload.value.hcaptcha_token = token
    }

    const onSubmit = async () => {
      if (isGoogleProcessing.value) return

      try {
        errorMessages.value = {}

        if (sigupPayload.value.password !== repeatPassword.value) {
          errorMessages.value.password = "Passwords must match"
          errorMessages.value.repeat_password = "Passwords must match"
          return
        }

        await authStore.fetchRegister(sigupPayload.value)
      } catch (error: any) {
        if (error.response?.status === 400 && error.response.data?.error?.fieldErrors) {
          const fields = error.response.data.error.fieldErrors
          for (const key in fields) {
            errorMessages.value[key] = fields[key][0]
          }
        } else if (error.response?.status === 400) {
          errorMessages.value._global = "Email already exists"
        } else {
          errorMessages.value._global = "Something went wrong. Please try again later."
        }
      } finally {
        setTimeout(() => {
          errorMessages.value = {}
        }, 3000)
      }
    }

    return {
      googleDiv,
      loginCaptchaRef,
      isGoogleProcessing,
      sigupPayload,
      repeatPassword,
      countryOptions,
      errorMessages,
      onSubmit,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
