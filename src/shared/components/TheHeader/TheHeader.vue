<template>
  <header class="fixed top-0 left-0 right-0 inset-x-0 z-50 bg-white border-b border-gray-200" :class="[getIsExpiredVisible || getIsTrialVisible ? 'top-[64px]' : '']">
    <nav class="basis-full w-full py-4 px-4 sm:px-6 lg:px-8 lg:mx-auto">
      <div class="flex flex-wrap lg:flex-nowrap basis-full justify-between gap-x-2 w-full">
        <!-- Row 1: Button Group / Mobile -->
        <div class="order-1 w-full lg:order-3 lg:w-auto flex items-center gap-x-2 flex-shrink-0">
          <!-- Hamburger (mobile only) -->
          <button
            type="button"
            :aria-label="t('header.menu')"
            :title="t('header.menu')"
            @click="isMenuOpen = !isMenuOpen"
            class="lg:hidden flex justify-center items-center size-9 rounded-lg shadow bg-white border border-gray-200 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
          >
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          <!-- Spacer убран: не нужен на мобиле -->
          <!-- <div class="flex-1 lg:hidden" /> -->

          <div class="ml-auto flex items-center gap-x-2">
            <!-- Language Switcher: MOBILE (click) -->
            <div class="relative lg:hidden" ref="langRef">
              <button class="text-sm px-3 py-2 rounded-md font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50 transition min-w-[56px]" @click="isLangOpen = !isLangOpen">
                {{ currentLang.toUpperCase() }}
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="isLangOpen" class="absolute right-0 mt-2 flex flex-col bg-white border border-gray-200 rounded-md shadow-md w-24 z-50 p-1 max-h-60 overflow-y-auto">
                  <button
                    v-for="code in localeCodes"
                    :key="code"
                    @click="switchLang(code)"
                    class="w-full text-center px-3 py-2 rounded text-sm"
                    :class="code === currentLang ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-100 text-gray-800'"
                  >
                    {{ code.toUpperCase() }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Language Switcher: DESKTOP (hover) -->
            <div class="relative hidden lg:block" @mouseenter="handleMouseLangEnter" @mouseleave="handleMouseLangLeave">
              <button
                aria-haspopup="menu"
                :aria-expanded="isLangOpen ? 'true' : 'false'"
                class="text-sm px-2 py-2 lg:px-3 lg:py-2 rounded-md font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50 transition min-w-[64px]"
                @keydown.enter.prevent="toggleLangMenu"
                @keydown.space.prevent="toggleLangMenu"
                @keydown.esc.prevent="closeLangMenu"
              >
                {{ currentLang.toUpperCase() }}
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="isLangOpen" class="absolute right-0 mt-2 flex flex-col bg-white border border-gray-200 rounded-md shadow-md w-28 z-50 p-1 max-h-72 overflow-y-auto" role="menu">
                  <button
                    v-for="code in localeCodes"
                    :key="code"
                    @click="switchLang(code)"
                    class="w-full text-center px-3 py-2 rounded text-sm"
                    :class="code === currentLang ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-100 text-gray-800'"
                    role="menuitem"
                  >
                    {{ code.toUpperCase() }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Avatar -->
            <div
              v-if="getIsLogged"
              id="USER_PROFILE_INFO_CLICK"
              class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
              @click="isUserModalOpen = true"
            >
              {{ getUserInitials }}
            </div>

            <!-- Logout -->
            <button
              type="button"
              @click="onSubmit"
              class="py-2 px-2 lg:px-3 flex items-center gap-x-2 text-[13px] lg:text-base text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
            >
              <i class="fas fa-arrow-right-from-bracket text-base lg:text-lg" />
              <span class="hidden lg:inline">{{ t("header.logout") }}</span>
            </button>
          </div>
        </div>
        <!-- End Row 1 -->

        <!-- Row 2: Collapse / Menu -->
        <transition
          enter-active-class="transition-all duration-100 ease-out"
          enter-from-class="opacity-0 scale-y-95 max-h-0"
          enter-to-class="opacity-100 scale-y-100 max-h-[500px]"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-y-100 max-h-[500px]"
          leave-to-class="opacity-0 scale-y-95 max-h-0"
        >
          <div v-if="isMenuOpen || isDesktop" class="order-3 w-full lg:order-2 lg:flex-1 overflow-hidden transition-all duration-100 bg-white">
            <div class="overflow-hidden overflow-y-auto max-h-[75vh]">
              <div class="flex flex-col lg:flex-row lg:gap-x-1 mt-4 lg:mt-0 lg:p-0">
                <router-link
                  v-for="(tab, index) in tabList"
                  :key="index"
                  @click="isMenuOpen = false"
                  :to="tab!.router"
                  class="py-2 px-3 flex items-center gap-x-1.5 text-base rounded-lg transition"
                  :class="{
                    'bg-primary text-white': $route.name === tab!.router.name,
                    'text-gray-800 hover:bg-gray-100': $route.name !== tab!.router.name,
                  }"
                >
                  {{ tab!.label }}
                </router-link>
              </div>
            </div>
          </div>
        </transition>
        <!-- End Row 2 -->
      </div>
    </nav>

    <v-modal v-model="isUserModalOpen" is-curtain :is-slide-out-bottom="!isDesktop">
      <UserProfile @close="isUserModalOpen = false" />
    </v-modal>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { authStore, subscriptionStore, userStore } from "@/app"
import { isLg } from "@/shared/lib"
import { UserProfile } from "./ui"
import { AppLocale, SUPPORT_LOCALES } from "@/shared/config"

export default defineComponent({
  components: {
    UserProfile,
  },

  setup() {
    const { t, locale } = useI18n()
    const isUserModalOpen = ref<boolean>(false)
    const isMenuOpen = ref<boolean>(false)
    const isDesktop = ref<boolean>(isLg())
    const isLangOpen = ref(false)
    const localeCodes = SUPPORT_LOCALES
    const langRef = ref<HTMLElement | null>(null)
    let langTimeout: ReturnType<typeof setTimeout> | null = null

    const currentLang = computed(() => locale.value as AppLocale)
    const getIsExpiredVisible = computed(() => subscriptionStore.getIsExpiredVisible)
    const getIsTrialVisible = computed(() => subscriptionStore.getIsTrialVisible)
    const getIsLogged = computed(() => authStore.getIsLogged)
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getUserInitials = computed(() => {
      const user = getCurrentUser.value
      if (!user) return ""
      const first = user.first_name?.[0] || ""
      const last = user.last_name?.[0] || ""
      return `${first}${last}`.toUpperCase()
    })
    const tabList = computed(() =>
      [
        { label: t("header.conversation"), router: { name: "platform.dashboard" } },
        getIsLogged.value ? { label: t("header.history"), router: { name: "platform.history" } } : null,
        getIsLogged.value ? { label: t("header.progress"), router: { name: "platform.user-progress" } } : null,
        getIsLogged.value ? { label: t("header.vocabulary"), router: { name: "platform.vocabulary" } } : null,
        { label: t("header.pricing"), router: { name: "platform.tariff-plans" } },
      ].filter(Boolean)
    )

    onMounted(() => {
      window.addEventListener("resize", updateIsDesktop)
      document.addEventListener("click", handleClickOutside)
    })

    const toggleLangMenu = () => {
      isLangOpen.value = !isLangOpen.value
    }

    const closeLangMenu = () => {
      isLangOpen.value = false
    }

    const handleMouseLangEnter = () => {
      if (langTimeout) clearTimeout(langTimeout)
      isLangOpen.value = true
    }
    const handleMouseLangLeave = () => {
      langTimeout = setTimeout(() => {
        isLangOpen.value = false
      }, 300)
    }

    const switchLang = (code: AppLocale) => {
      locale.value = code
      document.documentElement.setAttribute("lang", code)
      localStorage.setItem("locale", code)
      isLangOpen.value = false
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (!langRef.value) return
      if (!langRef.value.contains(e.target as Node)) {
        isLangOpen.value = false
      }
    }

    const updateIsDesktop = () => {
      isDesktop.value = window.innerWidth >= 768
    }

    const onSubmit = async () => {
      try {
        await authStore.fetchLogout()
      } catch (error: unknown) {
        console.log(error)
      }
    }

    onUnmounted(() => {
      window.removeEventListener("resize", updateIsDesktop)
      document.removeEventListener("click", handleClickOutside)
    })

    return {
      langRef,
      isUserModalOpen,
      isMenuOpen,
      isDesktop,
      localeCodes,
      isLangOpen,
      currentLang,
      tabList,
      getIsExpiredVisible,
      getIsTrialVisible,
      getIsLogged,
      getCurrentUser,
      getUserInitials,
      onSubmit,
      handleMouseLangEnter,
      handleMouseLangLeave,
      toggleLangMenu,
      closeLangMenu,
      switchLang,
      t,
    }
  },
})
</script>
