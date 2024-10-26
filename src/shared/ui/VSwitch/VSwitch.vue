<template>
  <div class="v-switch" @click="toggleValue" :data-enabled="value.toString()">
    <div v-if="labels" class="v-switch__label --left">
      {{ labels[0] }}
    </div>
    <div v-if="labels" class="v-switch__label --right">
      {{ labels[1] }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue"

export default defineComponent({
  name: "VSwitch",

  props: {
    defaultValue: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: false,
    },

    values: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    labels: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    onChange: {
      type: Function as PropType<(isEnabled: boolean, value: string) => void>,
      default: () => {},
    },
  },

  setup(props) {
    const value = ref<boolean>(typeof props.defaultValue === "string" ? !!Math.max(0, (props.values || []).indexOf(props.defaultValue)) : props.defaultValue)

    const toggleValue = () => {
      const newValue = !value.value
      const index = +newValue
      value.value = newValue

      props.onChange(newValue, (props.values || [])[index] || "")
    }

    return {
      value,
      toggleValue,
    }
  },
})
</script>

<style lang="scss" src="./VSwitch.scss" />
