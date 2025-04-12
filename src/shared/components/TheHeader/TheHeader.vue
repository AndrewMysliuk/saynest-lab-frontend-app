<template>
  <header class="header">
    <nav class="header__nav">
      <ul>
        <router-link v-for="(tab, index) in tabList" :key="index" :to="tab.router">
          {{ tab.label }}
        </router-link>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { IHeaderTabs } from "@/shared/types"
import { defineComponent, ref } from "vue"

export default defineComponent({
  setup() {
    const tabList = ref<IHeaderTabs[]>([
      { label: "Conversation", router: { name: "sendbox.conversation-dashboard" } },
      { label: "Conversation History", router: { name: "sendbox.conversation-history" } },
      { label: "Speaking Scenario", router: { name: "sendbox.scenario-dashboard" } },
      { label: "Grammar Practice", router: { name: "sendbox.grammar-dashboard" } },
    ])

    return {
      tabList,
    }
  },
})
</script>

<style lang="scss" src="./TheHeader.scss" />
