<template>
  <header class="header">
    <nav class="header__nav">
      <ul>
        <router-link v-for="(tab, index) in tabList" :key="index" :to="tab!.router">
          {{ tab?.label }}
        </router-link>
      </ul>
    </nav>

    <v-button v-if="!getIsLogged" label="Log In" button-style="info" @click="$router.push({ name: 'auth.login' })" />
    <v-button v-if="getIsLogged" label="Log Out" button-style="info" @click="onSubmit" />
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
        { label: "Conversation", router: { name: "sendbox.conversation-dashboard" } },
        getIsLogged.value ? { label: "Conversation History", router: { name: "sendbox.conversation-history" } } : null,
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

<style lang="scss" src="./TheHeader.scss" />
