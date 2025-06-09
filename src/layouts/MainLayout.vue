<template>
  <div class="main-layout">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
}
</style>
