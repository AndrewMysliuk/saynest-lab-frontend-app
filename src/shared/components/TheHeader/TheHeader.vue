<template>
  <header class="fixed top-0 left-0 right-0 inset-x-0 z-50 bg-white border-b border-gray-200">
    <nav class="basis-full w-full py-4 px-4 sm:px-6 lg:px-8 lg:mx-auto">
      <div class="flex flex-wrap md:flex-nowrap basis-full justify-between gap-x-2 w-full">
        <!-- Button Group -->
        <div class="flex items-center w-full md:order-3 gap-x-1">
          <!-- Collapse Button Trigger -->
          <button
            type="button"
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden flex justify-center items-center size-9 rounded-lg shadow bg-white border border-gray-200 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <!-- End Collapse Button Trigger -->

          <div class="flex-1 md:hidden" />

          <div class="flex items-center gap-x-2 ml-auto">
            <div
              v-if="getIsLogged"
              id="USER_PROFILE_INFO_CLICK"
              class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
              @click="isUserModalOpen = true"
            >
              {{ getUserInitials }}
            </div>

            <button
              type="button"
              @click="onSubmit"
              class="py-2 px-3 flex items-center gap-x-2 text-[13px] md:text-base text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
            >
              <i class="fas fa-arrow-right-from-bracket text-base md:text-lg" />
              <span class="hidden md:inline">Log out</span>
            </button>
          </div>
        </div>
        <!-- End Button Group -->

        <!-- Collapse -->
        <transition
          enter-active-class="transition-all duration-100 ease-out"
          enter-from-class="opacity-0 scale-y-95 max-h-0"
          enter-to-class="opacity-100 scale-y-100 max-h-[500px]"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-y-100 max-h-[500px]"
          leave-to-class="opacity-0 scale-y-95 max-h-0"
        >
          <div v-if="isMenuOpen || isDesktop" class="overflow-hidden transition-all duration-100 basis-full grow md:block bg-white">
            <div
              class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-white/30"
            >
              <div class="flex flex-col md:flex-row md:gap-y-0 md:gap-x-1 mt-6 md:mt-0 md:p-0">
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

        <!-- End Collapse -->
      </div>
    </nav>

    <v-modal v-model="isUserModalOpen" is-curtain>
      <UserProfile @close="isUserModalOpen = false" />
    </v-modal>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue"
import { authStore, subscriptionStore, userStore } from "@/app"
import { UserProfile } from "./ui"

export default defineComponent({
  components: {
    UserProfile,
  },

  setup() {
    const isUserModalOpen = ref<boolean>(false)
    const isMenuOpen = ref<boolean>(false)
    const isDesktop = ref<boolean>(window.innerWidth >= 768)

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
        { label: "Conversation", router: { name: "platform.dashboard" } },
        getIsLogged.value ? { label: "History", router: { name: "platform.history" } } : null,
        getIsLogged.value ? { label: "Progress", router: { name: "platform.user-progress" } } : null,
        getIsLogged.value ? { label: "Vocabulary", router: { name: "platform.vocabulary" } } : null,
        { label: "Pricing", router: { name: "platform.tariff-plans" } },
      ].filter(Boolean)
    )

    onMounted(() => {
      window.addEventListener("resize", updateIsDesktop)
    })

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
    })

    return {
      isUserModalOpen,
      isMenuOpen,
      isDesktop,
      tabList,
      getIsExpiredVisible,
      getIsTrialVisible,
      getIsLogged,
      getCurrentUser,
      getUserInitials,
      onSubmit,
    }
  },
})
</script>
