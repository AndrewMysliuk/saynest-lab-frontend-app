<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[400px] max-w-full">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Accept Policies</h2>

      <form @submit.prevent="onDone">
        <div class="flex flex-col gap-4 mb-6 text-[15px]">
          <label class="flex items-start gap-2 text-gray-700 cursor-pointer">
            <input type="checkbox" v-model="isAcceptTerms" class="rounded border-gray-300 focus:ring-indigo-500 cursor-pointer mt-1" />
            <span>
              I accept the
              <a href="https://saynestlab.com/terms-and-conditions" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                Terms and Conditions
              </a>
            </span>
          </label>

          <label class="flex items-start gap-2 text-gray-700 cursor-pointer">
            <input type="checkbox" v-model="isAcceptPrivacy" class="rounded border-gray-300 focus:ring-indigo-500 cursor-pointer mt-1" />
            <span>
              I accept the
              <a href="https://saynestlab.com/privacy-policy" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"> Privacy Policy </a>
            </span>
          </label>

          <label class="flex items-start gap-2 text-gray-700 cursor-pointer">
            <input type="checkbox" v-model="isAcceptRefund" class="rounded border-gray-300 focus:ring-indigo-500 cursor-pointer mt-1" />
            <span>
              I accept the
              <a href="https://saynestlab.com/refund-policy" target="_blank" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"> Refund Policy </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="!allAccepted"
          class="w-full bg-indigo-600 text-white font-semibold rounded-md py-2 transition-colors duration-300 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Done
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { userStore } from "@/app"
import { defineComponent, ref, computed } from "vue"

export default defineComponent({
  setup() {
    const isAcceptTerms = ref(false)
    const isAcceptPrivacy = ref(false)
    const isAcceptRefund = ref(false)

    const allAccepted = computed(() => {
      return isAcceptTerms.value && isAcceptPrivacy.value && isAcceptRefund.value
    })

    const onDone = async () => {
      if (!allAccepted.value) return

      try {
        await userStore.fetchUserLegal({
          is_accept_terms_and_conditions: isAcceptTerms.value,
          is_accept_privacy_policy: isAcceptPrivacy.value,
          is_accept_refund_policy: isAcceptRefund.value,
        })
      } catch (error: unknown) {
        console.log(error)
      }
    }

    return {
      isAcceptTerms,
      isAcceptPrivacy,
      isAcceptRefund,
      allAccepted,
      onDone,
    }
  },
})
</script>
