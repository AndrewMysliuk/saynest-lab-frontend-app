<template>
  <div class="v-switch">
    <div class="v-switch__label" :class="{ '--active': index === selectedIndex }" v-for="(label, index) in labels" :key="index" @click="toggleValue(index)">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "VSwitch",

  props: {
    labels: {
      type: Array as () => string[],
      required: true,
    },
    values: {
      type: Array as () => string[],
      required: true,
    },
  },

  setup(props, { emit }) {
    const selectedIndex = ref(0)

    const toggleValue = (index: number) => {
      selectedIndex.value = index
      emit("update:values", props.values[index])
    }

    return {
      selectedIndex,
      toggleValue,
    }
  },
})
</script>

<style lang="scss" src="./VSwitch.scss" />
