<template>
  <button type="button" class="v-button" :class="classList" v-bind="attrs">
    <span class="v-button__label">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue"

export default defineComponent({
  name: "VButton",

  props: {
    label: {
      type: String,
      default: "",
    },

    buttonStyle: {
      type: String as PropType<"regular" | "action" | "alert" | "flush">,
      default: "regular",
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const classList = computed(() => {
      const classes = []
      classes.push(`--v-button-style-${props.buttonStyle}`)

      return classes.join(" ")
    })

    return {
      classList,
      attrs,
    }
  },
})
</script>

<style lang="scss" src="./VButton.scss" />
