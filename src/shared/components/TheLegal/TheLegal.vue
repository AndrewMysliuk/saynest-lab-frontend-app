<template>
  <div class="mt-0 sm:w-full sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center justify-center">
    <div class="relative sm:w-[480px] max-h-full overflow-hidden flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl" role="dialog" aria-modal="true">
      <!-- Body -->
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-800">
          {{ t("legal.title") }}
        </h3>

        <!-- Terms -->
        <div class="mt-4">
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptTerms" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                {{ t("legal.accept_prefix") }}
                <a href="https://saynestlab.com/terms-and-conditions" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                  {{ t("footer.terms") }}
                </a>
              </span>
            </label>
          </div>
        </div>

        <!-- Privacy -->
        <div>
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptPrivacy" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                {{ t("legal.accept_prefix") }}
                <a href="https://saynestlab.com/privacy-policy" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                  {{ t("footer.privacy") }}
                </a>
              </span>
            </label>
          </div>
        </div>

        <!-- Refund -->
        <div>
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptRefund" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                {{ t("legal.accept_prefix") }}
                <a href="https://saynestlab.com/refund-policy" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                  {{ t("footer.refund") }}
                </a>
              </span>
            </label>
          </div>
        </div>

        <!-- Button Group -->
        <div class="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            @click="onDone"
            :disabled="!allAccepted"
            class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#4F46E5] text-white hover:bg-[#4338CA] disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ t("legal.done") }}
          </button>
        </div>
        <!-- End Button Group -->
      </div>
      <!-- End Body -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { userStore } from "@/app"

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const isAcceptTerms = ref(false)
    const isAcceptPrivacy = ref(false)
    const isAcceptRefund = ref(false)

    const allAccepted = computed(() => isAcceptTerms.value && isAcceptPrivacy.value && isAcceptRefund.value)

    const onDone = async () => {
      if (!allAccepted.value) return
      try {
        await userStore.fetchUserLegal({
          is_accept_terms_and_conditions: isAcceptTerms.value,
          is_accept_privacy_policy: isAcceptPrivacy.value,
          is_accept_refund_policy: isAcceptRefund.value,
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      t,
      isAcceptTerms,
      isAcceptPrivacy,
      isAcceptRefund,
      allAccepted,
      onDone,
    }
  },
})
</script>
