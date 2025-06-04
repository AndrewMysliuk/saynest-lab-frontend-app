<template>
  <div class="main-layout">
    <router-view />

    <v-modal :model-value="!getUserLegalTC || !getUserLegalPP || !getUserLegalRP">
      <TheLegal />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { userStore } from "@/app"
import { TheLegal } from "@/shared/components"

export default defineComponent({
  components: {
    TheLegal,
  },

  setup() {
    const getUserLegalTC = computed(() => userStore.getUserLegal?.is_accept_terms_and_conditions)
    const getUserLegalPP = computed(() => userStore.getUserLegal?.is_accept_privacy_policy)
    const getUserLegalRP = computed(() => userStore.getUserLegal?.is_accept_refund_policy)

    return {
      getUserLegalTC,
      getUserLegalPP,
      getUserLegalRP,
    }
  },
})
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
}
</style>
