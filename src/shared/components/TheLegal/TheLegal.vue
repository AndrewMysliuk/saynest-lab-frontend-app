<template>
  <div class="mt-0 sm:w-full sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center justify-center">
    <div class="relative w-[480px] max-h-full overflow-hidden flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl">
      <!-- Close Button -->
      <!-- <div class="absolute top-3 end-3 z-10">
        <button
          type="button"
          class="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="shrink-0 size-4"
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
      </div> -->
      <!-- End Close Button -->

      <!-- Body -->
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-800">Accept Policies</h3>
        <!-- <p class="mt-1 text-sm text-gray-600">Are you sure you want to delete this message?</p> -->

        <div class="mt-4">
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptTerms" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                I accept the
                <router-link :to="{ name: 'terms-and-conditions' }" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                  Terms and Conditions
                </router-link>
              </span>
            </label>
          </div>
        </div>

        <div>
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptPrivacy" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                I accept the
                <router-link :to="{ name: 'privacy-policy' }" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"> Privacy Policy </router-link>
              </span>
            </label>
          </div>
        </div>

        <div>
          <div class="inline-flex items-center">
            <label class="flex w-full items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors">
              <input type="checkbox" v-model="isAcceptRefund" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" />
              <span class="text-sm text-gray-800">
                I accept the
                <router-link :to="{ name: 'refund-policy' }" class="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"> Refund Policy </router-link>
              </span>
            </label>
          </div>
        </div>

        <!-- Button Group -->
        <div class="mt-5 flex flex-wrap justify-end gap-2">
          <!-- <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
          >
            Yes, I’m sure
          </button> -->
          <button
            type="button"
            @click="onDone"
            :disabled="!allAccepted"
            class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#4F46E5] text-white hover:bg-[#4338CA] disabled:opacity-50 disabled:pointer-events-none"
          >
            Done
          </button>
        </div>
        <!-- End Button Group -->
      </div>
      <!-- End Body -->
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
