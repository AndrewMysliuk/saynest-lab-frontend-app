<template>
  <div>
    <header class="fixed top-0 left-0 w-full z-50 bg-background border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <nav>
        <ul class="flex space-x-4">
          <li v-for="(tab, index) in tabList" :key="index">
            <router-link
              :to="tab!.router"
              class="px-4 py-2 rounded-md transition-all duration-200 ease-in-out"
              :class="[$route.name === tab!.router.name ? 'bg-primary text-white' : 'text-text-muted hover:text-text-base hover:bg-gray-100']"
            >
              {{ tab!.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="flex items-center space-x-4">
        <div v-if="getIsLogged" id="USER_PROFILE_INFO_CLICK" class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold cursor-pointer" @click="isUserModalOpen = true">
          {{ getUserInitials }}
        </div>

        <button v-if="!getIsLogged" @click="$router.push({ name: 'auth.login' })" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition-all duration-200 ease-in-out">
          Log In
        </button>

        <button v-else @click="onSubmit" class="px-4 py-2 bg-gray-200 text-text-base rounded-md hover:bg-gray-300 transition-all duration-200 ease-in-out">Log Out</button>
      </div>
    </header>

    <v-modal v-model="isUserModalOpen" is-curtain>
      <UserProfile @close="isUserModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { authStore, userStore } from "@/app"
import { UserProfile } from "./ui"

export default defineComponent({
  components: {
    UserProfile,
  },

  setup() {
    const isUserModalOpen = ref<boolean>(false)

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
        { label: "Conversation", router: { name: "platform.conversation-dashboard" } },
        getIsLogged.value ? { label: "Conversation History", router: { name: "platform.conversation-history" } } : null,
      ].filter(Boolean)
    )

    const onSubmit = async () => {
      try {
        await authStore.fetchLogout()
      } catch (error: unknown) {
        console.log(error)
      }
    }

    return {
      isUserModalOpen,
      tabList,
      getIsLogged,
      getCurrentUser,
      getUserInitials,
      onSubmit,
    }
  },
})
</script>
