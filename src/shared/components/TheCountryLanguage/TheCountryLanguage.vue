<template>
  <div class="relative w-full sm:max-w-xs">
    <button
      class="flex items-center bg-white justify-between w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-2">
        <span v-if="selectedCountry" :class="['country-flag', `${selectedCountry.code}`]" />
        <span>{{ selectedCountry ? selectedCountry.name : "Select language" }}</span>
      </div>
      <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="isOpen" class="absolute mt-2 z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      <ul>
        <li v-for="country in countries" :key="country.code" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2" @click="selectCountry(country)">
          <span :class="['country-flag', `${country.code}`]" />
          {{ country.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

type ICountryLanguage = {
  code: string
  name: string
}

export default defineComponent({
  name: "TheCountryLanguage",

  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const isOpen = ref<boolean>(false)
    const countries = ref<ICountryLanguage[]>([
      { code: "gb", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "pt", name: "Portuguese" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pl", name: "Polish" },
      { code: "uk", name: "Ukrainian" },
      { code: "bg", name: "Bulgarian" },
    ])
    const selectedCountry = ref<ICountryLanguage | null>(countries.value.find((item) => item.name === props.modelValue) || null)

    function toggleDropdown() {
      isOpen.value = !isOpen.value
    }

    function selectCountry(country: ICountryLanguage) {
      if (country.name === props.modelValue) {
        isOpen.value = false
        return
      }

      selectedCountry.value = country
      emit("update:modelValue", country.name)

      isOpen.value = false
    }

    return {
      isOpen,
      selectedCountry,
      countries,
      toggleDropdown,
      selectCountry,
    }
  },
})
</script>
