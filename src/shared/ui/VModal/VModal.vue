<template>
  <transition name="fade" @enter="startEnterAnimation" @afterEnter="endEnterAnimation" @leave="startLeaveAnimation" @afterLeave="endLeaveAnimation">
    <div v-if="modelValue" class="v-modal" :class="{ '--is-curtain': isCurtain, '--is-info': isInfo, '--is-standart': !isCurtain && !isInfo }">
      <div class="v-modal__background" @click="closeModal" />

      <div class="v-modal__content">
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

    isCurtain: {
      type: Boolean,
      default: false,
    },

    isInfo: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const closeModal = () => {
      emit("update:modelValue", false)
    }

    const startEnterAnimation = (el: Element, done: () => void) => {
      document.body.style.overflow = "hidden"

      if (props.isCurtain || props.isInfo) {
        el.classList.add("--slide-from-right")
        setTimeout(done, 300)

        return
      }

      done()
    }

    const endEnterAnimation = (el: Element) => {
      if (props.isCurtain || props.isInfo) {
        el.classList.remove("--slide-from-right")
      }
    }

    const startLeaveAnimation = (el: Element, done: () => void) => {
      if (props.isCurtain || props.isInfo) {
        el.classList.add("--slide-out-right")
        setTimeout(done, 300)

        return
      }

      done()
    }

    const endLeaveAnimation = (el: Element) => {
      if (props.isCurtain || props.isInfo) {
        el.classList.remove("--slide-out-right")
      }

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
