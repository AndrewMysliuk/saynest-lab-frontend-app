<template>
  <transition name="fade" @enter="startEnterAnimation" @afterEnter="endEnterAnimation" @leave="startLeaveAnimation" @afterLeave="endLeaveAnimation">
    <div v-if="modelValue" class="v-modal" :class="{ '--is-open': modelValue, '--is-curtain': isCurtain, '--is-info': isInfo, '--is-standart': !isCurtain && !isInfo }">
      <div class="v-modal__content">
        <slot />
      </div>

      <div class="v-modal__background" @click="closeModal" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue"

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

    isSlideOutBottom: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const closeModal = () => {
      emit("update:modelValue", false)
    }

    const toggleAnimationClass = (el: Element, action: "add" | "remove", animationType: string) => {
      el.classList[action](animationType)
    }

    const getAnimationClass = (action: "enter" | "leave"): string => {
      if (props.isSlideOutBottom) {
        return action === "enter" ? "--slide-from-bottom" : "--slide-out-bottom"
      }

      return props.isCurtain || props.isInfo ? (action === "enter" ? "--slide-from-right" : "--slide-out-right") : action === "enter" ? "--fade-in-enter" : "--fade-out"
    }

    const updateBodyOverflow = async () => {
      await nextTick()
      const openModals = document.querySelectorAll(".v-modal.--is-open").length

      if (openModals > 0) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    const startEnterAnimation = (el: Element, done: () => void) => {
      updateBodyOverflow()
      toggleAnimationClass(el, "add", getAnimationClass("enter"))

      setTimeout(done, 300)
      return
    }

    const endEnterAnimation = (el: Element) => {
      toggleAnimationClass(el, "remove", getAnimationClass("enter"))
    }

    const startLeaveAnimation = (el: Element, done: () => void) => {
      toggleAnimationClass(el, "add", getAnimationClass("leave"))

      setTimeout(done, 300)
      return
    }

    const endLeaveAnimation = (el: Element) => {
      toggleAnimationClass(el, "remove", getAnimationClass("leave"))
      updateBodyOverflow()
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
