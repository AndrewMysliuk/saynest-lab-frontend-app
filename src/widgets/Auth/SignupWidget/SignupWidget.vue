<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <!-- @submit.prevent="onSubmit" -->
    <form class="w-full max-w-md bg-surface p-8 rounded-xl shadow-soft space-y-6">
      <h2 class="text-2xl font-semibold text-text-base text-center">Sign Up</h2>

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
        </div>
      </div>

      <div>
        <label for="country" class="block text-sm font-medium text-text-muted">Country</label>
        <input
          id="country"
          v-model="sigupPayload.country"
          type="text"
          placeholder="Enter your country"
          required
          class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
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
        </div>
      </div>

      <div v-if="isProduction">
        <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
      </div>

      <div class="flex justify-between gap-4">
        <button type="button" @click="$router.push({ name: 'auth.login' })" class="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-text-muted bg-white hover:bg-gray-100 transition">
          Log In
        </button>
        <button type="submit" class="w-1/2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primaryDark transition-colors duration-200">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import { authStore } from "@/app"
import { defineComponent, ref } from "vue"
import { isProduction } from "@/shared/utils"
import { IRegisterRequest } from "@/shared/types"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string

export default defineComponent({
  components: {
    VueHcaptcha,
  },

  setup() {
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

    const loginCodeCaptcha = (token: string) => {
      sigupPayload.value.hcaptcha_token = token
    }

    const onSubmit = async () => {
      try {
        if (sigupPayload.value.password !== repeatPassword.value) {
          alert("passwords must match")
          return
        }

        await authStore.fetchRegister(sigupPayload.value)
      } catch (error: unknown) {
        alert("Something Went Wrong")
      }
    }

    return {
      loginCaptchaRef,
      sigupPayload,
      repeatPassword,
      onSubmit,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
