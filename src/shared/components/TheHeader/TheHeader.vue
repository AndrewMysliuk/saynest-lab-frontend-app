<template>
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

    <div>
      <button v-if="!getIsLogged" @click="$router.push({ name: 'auth.login' })" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition-all duration-200 ease-in-out">
        Log In
      </button>
      <button v-else @click="onSubmit" class="px-4 py-2 bg-gray-200 text-text-base rounded-md hover:bg-gray-300 transition-all duration-200 ease-in-out">Log Out</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { authStore } from "@/app"

export default defineComponent({
  setup() {
    const getIsLogged = computed(() => authStore.getIsLogged)
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
      tabList,
      getIsLogged,
      onSubmit,
    }
  },
})
</script>
