<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 relative">
    <!-- ========== MAIN CONTENT ========== -->
    <main id="content" class="pb-24 sm:pb-16 w-full max-w-[540px] mx-auto">
      <div class="py-10 lg:py-20 w-full max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="w-full max-w-sm mx-auto">
          <!-- Log In Details -->
          <div class="space-y-8">
            <div class="text-center">
              <h2 class="font-medium text-xl text-gray-800">{{ t("auth.login.title") }}</h2>
            </div>

            <div class="space-y-3">
              <div ref="googleDiv" class="flex justify-center" />

              <!-- Divider -->
              <div class="flex items-center my-4">
                <hr class="flex-grow border-gray-200" />
                <span class="mx-3 text-sm text-gray-400">{{ t("auth.login.or") }}</span>
                <hr class="flex-grow border-gray-200" />
              </div>
              <!-- End Divider -->

              <!-- Email -->
              <div>
                <label for="email" class="sr-only">{{ t("auth.login.email") }}</label>
                <input
                  id="email"
                  v-model="loginPayload.email"
                  type="email"
                  autocomplete="email"
                  required
                  :placeholder="t('auth.login.email_placeholder')"
                  class="py-3 px-4 relative w-full inline-flex justify-center items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="sr-only">{{ t("auth.login.password") }}</label>

                <div class="relative">
                  <input
                    :type="isPasswordVisible ? 'text' : 'password'"
                    id="password"
                    v-model="loginPayload.password"
                    required
                    autocomplete="current-password"
                    :placeholder="t('auth.login.password_placeholder')"
                    class="py-3 px-4 relative w-full inline-flex justify-center items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-[#4F46E5]"
                  />

                  <button
                    type="button"
                    :aria-label="isPasswordVisible ? t('auth.login.hide_password') : t('auth.login.show_password')"
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 hover:text-[#4F46E5] focus:outline-none"
                  >
                    <i :class="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                  </button>
                </div>
              </div>

              <!-- Forgot (optional) -->
              <!--
              <div class="flex flex-wrap justify-between items-center gap-3">
                <a class="text-[13px] text-gray-500 underline underline-offset-4 hover:text-[#4F46E5] focus:outline-none focus:text-[#4F46E5]" href="/forgot-password">
                  {{ t('auth.login.forgot') }}
                </a>
              </div>
              -->
            </div>

            <div class="space-y-4">
              <!-- CAPTCHA -->
              <div v-if="isProduction">
                <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="text-sm text-red-600 bg-[#FFFAFA] border border-red-200 rounded-md p-3 shadow-sm">
                {{ errorMessage }}
              </div>
            </div>

            <div class="space-y-4">
              <!-- Log In -->
              <button
                type="button"
                @click="onSubmit"
                :disabled="isGoogleProcessing"
                class="py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 sm:text-sm font-medium rounded-lg border border-transparent bg-[#4F46E5] text-white hover:bg-[#4338CA] disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              >
                {{ t("auth.login.submit") }}
              </button>

              <!-- Create Account -->
              <button
                type="button"
                @click="$router.push({ name: 'auth.signup' })"
                :disabled="isGoogleProcessing"
                class="py-3 px-4 w-full inline-flex justify-center items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              >
                {{ t("auth.login.create") }}
              </button>
            </div>
          </div>
          <!-- End Log In Details -->
        </div>
      </div>
    </main>
    <!-- ========== END MAIN CONTENT ========== -->

    <TheFooter />
  </div>
</template>

<script lang="ts">
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import { authStore } from "@/app"
import { defineComponent, onMounted, ref } from "vue"
import { isProduction } from "@/shared/utils"
import { ILoginRequest } from "@/shared/types"
import { TheFooter } from "@/shared/components"
import { useI18n } from "vue-i18n"

const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY as string
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

export default defineComponent({
  components: {
    VueHcaptcha,
    TheFooter,
  },

  setup() {
    const { t } = useI18n()

    const googleDiv = ref<HTMLDivElement | null>(null)
    const loginCaptchaRef = ref<any>()
    const loginPayload = ref<ILoginRequest>({
      email: "",
      password: "",
      hcaptcha_token: "",
    })
    const errorMessage = ref<string | null>(null)
    const isGoogleProcessing = ref<boolean>(false)
    const isPasswordVisible = ref<boolean>(false)

    onMounted(() => {
      const interval = setInterval(() => {
        if (tryInitGoogle()) clearInterval(interval)
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
        errorMessage.value = t("auth.login.errors.generic")
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

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    const onSubmit = async () => {
      if (isGoogleProcessing.value) return

      try {
        errorMessage.value = null
        await authStore.fetchLogin(loginPayload.value)

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: "BASIC_LOGIN_CLICK",
          method: "login_button",
          location: "login_form",
        })
      } catch (error: any) {
        if (error?.response?.status === 401) {
          errorMessage.value = t("auth.login.errors.invalid_credentials")
        } else {
          errorMessage.value = t("auth.login.errors.generic")
        }
      } finally {
        setTimeout(() => {
          errorMessage.value = null
        }, 3000)
      }
    }

    return {
      t,
      googleDiv,
      isPasswordVisible,
      isGoogleProcessing,
      loginCaptchaRef,
      loginPayload,
      errorMessage,
      onSubmit,
      loginCodeCaptcha,
      togglePasswordVisibility,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
