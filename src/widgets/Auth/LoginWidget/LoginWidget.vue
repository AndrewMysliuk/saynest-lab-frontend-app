<template>
  <div class="auth">
    <form class="auth__form" @submit.prevent="loginCaptchaExecute">
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
        <VueHcaptcha ref="loginCaptchaRef" :sitekey="CAPTCHA_SITE_KEY" size="invisible" @verify="loginCodeCaptcha" />
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

    const loginCaptchaExecute = () => {
      if (!isProduction) {
        return onSubmit("fake-dev-captcha-token")
      }

      if (email.value && password.value) {
        loginCaptchaRef.value?.execute()
      }
    }

    const loginCodeCaptcha = (token: string) => {
      if (token) {
        onSubmit(token)
      }
    }

    const onSubmit = async (token: string) => {
      try {
        await authStore.fetchLogin({
          email: email.value,
          password: password.value,
          hcaptcha_token: token,
        })
      } catch (error: unknown) {
        alert("Something Went Wrong")
      }
    }

    return {
      loginCaptchaRef,
      email,
      password,
      loginCaptchaExecute,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
