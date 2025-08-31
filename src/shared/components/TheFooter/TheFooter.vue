<template>
  <!-- ========== FOOTER ========== -->
  <footer :class="['mt-auto inset-x-0 bg-white border-t border-gray-200', isStatic ? 'relative' : 'absolute bottom-0']">
    <div class="w-full py-6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex flex-col md:flex-row items-center justify-center gap-4">
        <!-- Centered Links -->
        <ul class="flex flex-wrap justify-center items-center whitespace-nowrap gap-3">
          <li class="text-xs text-gray-500">© {{ currentYear }} {{ t("footer.copyright") }}</li>
          <li class="text-xs">
            <a href="https://saynestlab.com/terms-and-conditions" target="_blank" class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800">
              {{ t("footer.terms") }}
            </a>
          </li>
          <li class="text-xs">
            <a href="https://saynestlab.com/privacy-policy" target="_blank" class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800">
              {{ t("footer.privacy") }}
            </a>
          </li>
          <li class="text-xs">
            <a href="https://saynestlab.com/refund-policy" target="_blank" class="text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800">
              {{ t("footer.refund") }}
            </a>
          </li>
        </ul>

        <!-- Social Icons -->
        <ul :class="['flex gap-4 items-center md:top-1/2 md:-translate-y-1/2 md:absolute', !isStatic ? 'md:right-0' : 'md:left-0']">
          <li>
            <a href="https://x.com/andrii_mysliuk" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-800">
              <i class="fab fa-x-twitter text-lg"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@SaynestLab" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-800">
              <i class="fab fa-youtube text-lg"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
  <!-- ========== END FOOTER ========== -->
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useI18n } from "vue-i18n"

export default defineComponent({
  props: {
    isStatic: { type: Boolean, default: false },
  },
  setup() {
    const { t } = useI18n()
    const currentYear = new Date().getFullYear()

    return { t, currentYear }
  },
})
</script>
