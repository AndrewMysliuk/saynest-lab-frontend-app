<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <form class="w-full max-w-md bg-surface p-8 rounded-xl shadow-soft space-y-6" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-semibold text-text-base text-center">Login</h2>

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

      <div class="flex justify-between gap-4">
        <!-- <button type="button" @click="$router.push({ name: 'auth.signup' })" class="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-text-muted bg-white hover:bg-gray-100 transition">
          Sign Up
        </button> -->
        <button type="submit" class="w-1/2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primaryDark transition-colors duration-200">Log In</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import { authStore } from "@/app"
import { defineComponent, ref } from "vue"
import { isProduction } from "@/shared/utils"
import { ILoginRequest } from "@/shared/types"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string

export default defineComponent({
  components: {
    VueHcaptcha,
  },

  setup() {
    const loginCaptchaRef = ref<any>()
    const loginPayload = ref<ILoginRequest>({
      email: "",
      password: "",
      hcaptcha_token: "",
    })

    const loginCodeCaptcha = (token: string) => {
      loginPayload.value.hcaptcha_token = token
    }

    const onSubmit = async () => {
      try {
        await authStore.fetchLogin(loginPayload.value)
      } catch (error: unknown) {
        alert("Something Went Wrong")
      }
    }

    return {
      loginCaptchaRef,
      loginPayload,
      onSubmit,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
