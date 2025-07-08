<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 relative">
    <!-- ========== MAIN CONTENT ========== -->
    <main id="content" class="pb-24 sm:pb-16 w-full max-w-[540px] mx-auto">
      <div class="py-10 lg:py-20 w-full max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="w-full max-w-sm mx-auto">
          <!-- Log In Details -->
          <div class="space-y-8">
            <div class="text-center">
              <h2 class="font-medium text-xl text-gray-800">Sign Up</h2>
            </div>

            <div class="space-y-3">
              <div ref="googleDiv" class="w-full">
                <div class="mx-auto w-full max-w-[300px]" />
              </div>

              <!-- Divider -->
              <div class="flex items-center my-4">
                <hr class="flex-grow border-gray-200" />
                <span class="mx-3 text-sm text-gray-400">or</span>
                <hr class="flex-grow border-gray-200" />
              </div>
              <!-- End Divider -->

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="first_name" class="sr-only">First name</label>
                  <input
                    id="first_name"
                    v-model="signupPayload.first_name"
                    type="text"
                    required
                    placeholder="First name"
                    class="py-3 px-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <p v-if="errorMessages.first_name" class="mt-1 text-sm text-red-600">{{ errorMessages.first_name }}</p>
                </div>

                <div>
                  <label for="last_name" class="sr-only">Last name</label>
                  <input
                    id="last_name"
                    v-model="signupPayload.last_name"
                    type="text"
                    required
                    placeholder="Last name"
                    class="py-3 px-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <p v-if="errorMessages.last_name" class="mt-1 text-sm text-red-600">{{ errorMessages.last_name }}</p>
                </div>
              </div>

              <div>
                <label for="country" class="sr-only">Country</label>
                <div class="relative">
                  <select
                    id="country"
                    v-model="signupPayload.country"
                    required
                    class="py-3 px-4 w-full appearance-none rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] pr-10"
                  >
                    <option value="" disabled>Select your country</option>
                    <option v-for="country in countryOptions" :key="country.alpha_2" :value="country.alpha_2">
                      {{ country.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <i class="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
                <p v-if="errorMessages.country" class="mt-1 text-sm text-red-600">{{ errorMessages.country }}</p>
              </div>

              <div>
                <label for="email" class="sr-only">Email</label>
                <input
                  id="email"
                  v-model="signupPayload.email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="Email"
                  class="py-3 px-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5]"
                />
                <p v-if="errorMessages.email" class="mt-1 text-sm text-red-600">{{ errorMessages.email }}</p>
              </div>

              <div>
                <label for="password" class="sr-only">Password</label>
                <div class="relative">
                  <input
                    :type="isPasswordVisible ? 'text' : 'password'"
                    id="password"
                    v-model="signupPayload.password"
                    required
                    placeholder="Password"
                    autocomplete="new-password"
                    class="py-3 px-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-[#4F46E5] focus:outline-none">
                    <i :class="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                  </button>
                </div>
                <p v-if="errorMessages.password" class="mt-1 text-sm text-red-600">{{ errorMessages.password }}</p>
              </div>

              <div>
                <label for="repeat_password" class="sr-only">Repeat Password</label>
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  id="repeat_password"
                  v-model="repeatPassword"
                  required
                  placeholder="Repeat password"
                  autocomplete="new-password"
                  class="py-3 px-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5]"
                />
                <p v-if="errorMessages.repeat_password" class="mt-1 text-sm text-red-600">{{ errorMessages.repeat_password }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <!-- CAPTCHA -->
              <div v-if="isProduction">
                <VueHcaptcha :sitekey="CAPTCHA_SITE_KEY" @verify="loginCodeCaptcha" />
              </div>

              <!-- Error Message -->
              <div v-if="errorMessages._global" class="text-sm text-red-600 bg-[#FFFAFA] border border-red-200 rounded-md p-3 shadow-sm">
                {{ errorMessages._global }}
              </div>
            </div>

            <div class="space-y-4">
              <!-- Sign Up -->
              <button
                type="button"
                @click="onSubmit"
                :disabled="isGoogleProcessing"
                class="py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 sm:text-sm font-medium rounded-lg border border-transparent bg-[#4F46E5] text-white hover:bg-[#4338CA] disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              >
                Sign Up
              </button>

              <p class="text-center text-sm text-gray-500">
                Already have an account?
                <router-link :to="{ name: 'auth.login' }" class="text-[13px] text-gray-500 underline underline-offset-4 hover:text-[#4F46E5] focus:outline-hidden focus:text-[#4F46E5]">
                  Log in
                </router-link>
              </p>
            </div>
          </div>
          <!-- End Log In Details -->
        </div>
      </div>
    </main>
    <!-- ========== END MAIN CONTENT ========== -->
    <!-- ========== FOOTER ========== -->
    <footer class="mt-auto absolute bottom-0 inset-x-0 bg-white border-t border-gray-200">
      <div class="w-full max-w-5xl py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <!-- List -->
        <ul class="flex flex-wrap justify-center items-center whitespace-nowrap gap-3">
          <li
            class="inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2"
          >
            © 2025 Saynest Lab
          </li>
          <li
            class="inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2"
          >
            <router-link
              :to="{ name: 'terms-and-conditions' }"
              class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800"
            >
              Terms and Conditions
            </router-link>
          </li>
          <li
            class="inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2"
          >
            <router-link :to="{ name: 'privacy-policy' }" class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800">
              Privacy Policy
            </router-link>
          </li>
          <li
            class="inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2"
          >
            <router-link :to="{ name: 'refund-policy' }" class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800">
              Refund Policy
            </router-link>
          </li>
        </ul>
        <!-- End List -->
      </div>
    </footer>
    <!-- ========== END FOOTER ========== -->
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
    const signupPayload = ref<IRegisterRequest>({
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
    const isPasswordVisible = ref<boolean>(false)

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

        setTimeout(() => {
          const button = googleDiv.value?.querySelector('div[role="button"]')

          if (button) {
            button.addEventListener("click", () => {
              window.dataLayer = window.dataLayer || []
              window.dataLayer.push({
                event: "GOOGLE_SIGNUP_CLICK",
                method: "google_button",
                location: "signup_form",
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
      signupPayload.value.hcaptcha_token = token
    }

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    const onSubmit = async () => {
      if (isGoogleProcessing.value) return

      try {
        errorMessages.value = {}

        if (signupPayload.value.password !== repeatPassword.value) {
          errorMessages.value.password = "Passwords must match"
          errorMessages.value.repeat_password = "Passwords must match"
          return
        }

        await authStore.fetchRegister(signupPayload.value)

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: "BASIC_SIGNUP_CLICK",
          method: "signup_button",
          location: "signup_form",
        })
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
      isPasswordVisible,
      loginCaptchaRef,
      isGoogleProcessing,
      signupPayload,
      repeatPassword,
      countryOptions,
      errorMessages,
      onSubmit,
      togglePasswordVisibility,
      loginCodeCaptcha,
      CAPTCHA_SITE_KEY,
      isProduction,
    }
  },
})
</script>
