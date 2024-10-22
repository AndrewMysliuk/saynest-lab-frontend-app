<template>
  <div class="room" :class="{ '--sidebar-opened': isSidebarOpen }">
    <transition name="slide-left">
      <RoomSidebar v-if="isSidebarOpen" />
    </transition>

    <div class="room__body">
      <h1>Room</h1>

      <br /><br />

      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae cupiditate vel fuga deleniti! Maiores ipsum veniam, similique minus magni eum et? Blanditiis laborum laboriosam labore
        asperiores quo nam debitis eos!
      </p>

      <br /><br />

      <button type="button" @click="isSidebarOpen = !isSidebarOpen">Toggle History</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { RoomSidebar } from "./ui"

export default defineComponent({
  components: {
    RoomSidebar,
  },

  setup() {
    const isSidebarOpen = ref<boolean>(false)

    return {
      isSidebarOpen,
    }
  },
})
</script>
