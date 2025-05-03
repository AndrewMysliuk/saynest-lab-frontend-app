<template>
  <div class="auth">
    <form class="auth__form" @submit.prevent="onSubmit">
      <h2 class="auth__title">Login</h2>

      <div class="auth__field">
        <label for="email" class="auth__label">Email</label>
        <input id="email" v-model="email" type="email" placeholder="Enter your email" class="auth__input" required />
      </div>

      <div class="auth__field">
        <label for="password" class="auth__label">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Enter your password" class="auth__input" required />
      </div>

      <div class="auth__field" v-if="isProduction">
        <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
      </div>

      <div class="auth__footer">
        <button type="button" class="auth__button --back" @click="$router.push({ name: 'sendbox.conversation-dashboard' })">Back</button>
        <button type="submit" class="auth__button --submit">Sign In</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import { authStore } from "@/app"
import { defineComponent, ref } from "vue"
import { isProduction } from "@/shared/utils"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string

export default defineComponent({
  components: {
    VueHcaptcha,
  },

  setup() {
    const loginCaptchaRef = ref<any>()
    const email = ref<string>("")
    const password = ref<string>("")
    const captchaToken = ref<string>("")

    const loginCodeCaptcha = (token: string) => {
      captchaToken.value = token
    }

    const onSubmit = async () => {
      try {
        await authStore.fetchLogin({
          email: email.value,
          password: password.value,
          hcaptcha_token: captchaToken.value,
        })
      } catch (error: unknown) {
        alert("Something Went Wrong")
      }
    }

    return {
      loginCaptchaRef,
      email,
      password,
      onSubmit,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
