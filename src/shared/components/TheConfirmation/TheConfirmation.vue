<template>
  <div class="mt-0 sm:w-full sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center justify-center">
    <div class="relative sm:w-[420px] max-h-full overflow-hidden flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl" role="dialog" aria-modal="true">
      <!-- Close Button -->
      <div class="absolute top-3 end-3 z-10">
        <button
          @click="$emit('cancel')"
          type="button"
          class="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
        >
          <span class="sr-only">{{ t("confirmation.close") }}</span>
          <svg
            class="shrink-0 size-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <!-- End Close Button -->

      <!-- Body -->
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-800">{{ title }}</h3>
        <p class="mt-3 text-sm text-gray-600">{{ description }}</p>

        <!-- Button Group -->
        <div class="mt-5 flex flex-wrap justify-end gap-2">
          <button
            @click="$emit('cancel')"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
          >
            {{ t("confirmation.cancel") }}
          </button>
          <button
            @click="$emit('accept')"
            type="button"
            :class="[
              'py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none',
              isInfo ? 'bg-primary hover:bg-primary/90' : 'bg-red-500 hover:bg-red-600',
            ]"
          >
            {{ t("confirmation.accept") }}
          </button>
        </div>
        <!-- End Button Group -->
      </div>
      <!-- End Body -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useI18n } from "vue-i18n"

export default defineComponent({
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isInfo: { type: Boolean, default: false },
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
})
</script>
