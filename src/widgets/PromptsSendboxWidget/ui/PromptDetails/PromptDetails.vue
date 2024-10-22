<template>
  <div class="sendbox__modal">
    <h3 class="sendbox__modal-title">Prompt Info</h3>
    <br /><br />
    <p class="sendbox__modal-desc">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident, odio minima. Labore quae earum accusantium esse perspiciatis, ipsam temporibus similique vitae repudiandae ab, omnis
      exercitationem? Animi atque perspiciatis illum at.
    </p>
    <br /><br />
    <router-link :to="{ name: 'sendbox.room' }" class="sendbox__modal-btn">Enter Room</router-link>
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
