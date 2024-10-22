<template>
  <transition name="fade" @enter="startEnterAnimation" @afterEnter="endEnterAnimation" @leave="startLeaveAnimation" @afterLeave="endLeaveAnimation">
    <div v-if="modelValue" class="omg-modal">
      <div class="omg-modal__background" @click="closeModal" />

      <div class="omg-modal__content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "VModal",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, { emit }) {
    const closeModal = () => {
      emit("update:modelValue", false)
    }

    const startEnterAnimation = (el: Element, done: () => void) => {
      document.body.style.overflow = "hidden"

      el.classList.add("--slide-from-right")
      setTimeout(done, 300)
    }

    const endEnterAnimation = (el: Element) => {
      el.classList.remove("--slide-from-right")
    }

    const startLeaveAnimation = (el: Element, done: () => void) => {
      el.classList.add("--slide-out-right")
      setTimeout(done, 300)
    }

    const endLeaveAnimation = (el: Element) => {
      el.classList.remove("--slide-out-right")

      document.body.style.overflow = ""
    }

    return {
      closeModal,
      startEnterAnimation,
      endEnterAnimation,
      startLeaveAnimation,
      endLeaveAnimation,
    }
  },
})
</script>

<style lang="scss" src="./VModal.scss" scoped />
