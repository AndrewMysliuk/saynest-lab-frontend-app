<template>
  <div class="p-5 bg-white border border-stone-200 shadow-sm rounded-xl">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      {{ t("progress.streak.title") }}
    </h2>

    <!-- Header streak stats -->
    <div class="flex items-center justify-between text-sm text-gray-500 font-medium mb-4">
      <span>
        {{ t("progress.streak.current") }}:
        <span class="text-gray-800 font-semibold">{{ currentStreak }}d</span>
      </span>
      <span>
        {{ t("progress.streak.longest") }}:
        <span class="text-gray-800 font-semibold">{{ longestStreak }}d</span>
      </span>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div class="bg-[#4F46E5] h-2.5 rounded-full transition-all duration-500" :style="{ width: percentage + '%' }" />
    </div>

    <!-- Calendar -->
    <div class="pt-4 border-t border-gray-100">
      <h3 class="text-sm font-semibold text-gray-600 text-center mb-3">
        {{ monthYear }}
      </h3>

      <!-- Weekday headers -->
      <div class="grid grid-cols-7 text-[11px] text-gray-400 text-center mb-1 tracking-wide">
        <span v-for="day in t('progress.streak.weekdays', { returnObjects: true })" :key="day">
          {{ day }}
        </span>
      </div>

      <!-- Days of month -->
      <div class="grid grid-cols-7 gap-2 text-center text-xs text-gray-600">
        <div v-for="day in daysOfMonth" :key="day.date" class="flex flex-col items-center justify-center gap-1">
          <div class="w-6 h-6 rounded-full border transition" :class="day.active ? 'bg-[#4F46E5] border-[#4F46E5]' : 'bg-gray-200 border-gray-300'" :title="day.date"></div>
          <span class="text-[10px]">{{ day.dayNumber }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useI18n } from "vue-i18n"
import { userProgressStore } from "@/app"
import type { IUserProgressEntity } from "@/shared/types"

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const today = new Date()

    const progress = computed(() => userProgressStore.getCurrentUserProgress as IUserProgressEntity)
    const monthYear = computed(() => today.toLocaleString("default", { month: "long", year: "numeric" }))
    const currentStreak = computed(() => progress.value?.current_day_streak || 0)
    const longestStreak = computed(() => progress.value?.longest_day_streak || 1)
    const percentage = computed(() => Math.min(100, Math.round((currentStreak.value / longestStreak.value) * 100)))
    const daysOfMonth = computed(() => getDaysOfCurrentMonth(progress.value.activity_log))

    const getDaysOfCurrentMonth = (activity_log: Record<string, boolean>) => {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const days: { date: string; dayNumber: number; active: boolean }[] = []

      const totalDays = new Date(year, month + 1, 0).getDate()

      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i)
        const formatted = date.toLocaleDateString("sv-SE")

        days.push({
          date: formatted,
          dayNumber: i,
          active: !!activity_log?.[formatted],
        })
      }

      return days
    }

    return {
      monthYear,
      currentStreak,
      longestStreak,
      percentage,
      daysOfMonth,
      t,
    }
  },
})
</script>
