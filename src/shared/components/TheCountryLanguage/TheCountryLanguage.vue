<template>
  <div class="relative w-full">
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700">{{ label }}</label>

    <button
      class="flex items-center bg-white justify-between w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-2">
        <span v-if="selectedCountry" :class="['country-flag', selectedCountry.code === 'en' ? 'gb' : selectedCountry.code]" />
        <span>{{ selectedCountry ? getName(selectedCountry.code) : t("moduleLang.select") }}</span>
      </div>
      <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="isOpen" class="absolute mt-2 z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      <ul>
        <li v-for="country in countries" :key="country.code" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2" @click="selectCountry(country)">
          <span :class="['country-flag', country.code === 'en' ? 'gb' : country.code]" />
          {{ getName(country.code) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

type ICountryLanguage = { code: string }

export default defineComponent({
  name: "TheCountryLanguage",

  props: {
    modelValue: { type: String, default: "" },

    label: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const { t, locale } = useI18n()

    const isOpen = ref(false)
    const countries = ref<ICountryLanguage[]>([{ code: "en" }, { code: "es" }, { code: "fr" }, { code: "pt" }, { code: "de" }, { code: "it" }, { code: "pl" }, { code: "uk" }, { code: "bg" }])

    const getName = (code: string) => t(`moduleLang.countries.${code}`)

    const selectedCountry = ref<{ code: string } | null>(null)

    const initSelected = () => {
      const byCode = countries.value.find((c) => c.code === props.modelValue)
      if (byCode) {
        selectedCountry.value = byCode
        return
      }

      const byName = countries.value.find((c) => getName(c.code) === props.modelValue)
      selectedCountry.value = byName || null
    }
    initSelected()

    watch(
      () => locale.value,
      () => {
        if (!selectedCountry.value && props.modelValue) initSelected()
      }
    )

    function toggleDropdown() {
      isOpen.value = !isOpen.value
    }

    function selectCountry(country: ICountryLanguage) {
      if (country.code === props.modelValue) {
        isOpen.value = false
        return
      }

      selectedCountry.value = country
      emit("update:modelValue", country.code)
      isOpen.value = false
    }

    return { t, isOpen, selectedCountry, countries, toggleDropdown, selectCountry, getName }
  },
})
</script>
