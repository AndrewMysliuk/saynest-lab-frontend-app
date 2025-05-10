<template>
  <div class="platform-layout">
    <router-view />
  </div>
</template>

<script lang="ts">
import { userStore } from "@/app"
import { computed, defineComponent, onMounted } from "vue"

export default defineComponent({
  setup() {
    const getCurrentUser = computed(() => userStore.getCurrentUser)

    onMounted(() => {
      hotjarUserData()
    })

    const hotjarUserData = () => {
      if (typeof window !== "undefined" && window.hj && getCurrentUser.value) {
        window.hj("identify", getCurrentUser.value._id, {
          explanation_language: getCurrentUser.value.explanation_language,
          country: getCurrentUser.value.country,
        })
      }
    }

    return {}
  },
})
</script>

<style lang="scss" scoped>
.platform-layout {
  min-height: 100vh;
}
</style>
