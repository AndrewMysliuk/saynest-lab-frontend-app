<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h2 class="text-lg font-semibold mb-4">Your Day Streak</h2>

    <div class="space-y-2">
      <div class="flex justify-between text-sm text-stone-500">
        <span>Current Streak: {{ currentStreak }}d</span>
        <span>Longest: {{ longestStreak }}d</span>
      </div>

      <div class="w-full bg-stone-200 rounded-full h-3">
        <div class="bg-orange-400 h-3 rounded-full transition-all duration-500" :style="{ width: percentage + '%' }" />
      </div>

      <div class="mt-6 border-t pt-4">
        <h3 class="text-sm font-medium mb-2 text-stone-500 text-center">
          {{ monthYear }}
        </h3>

        <div class="grid grid-cols-7 gap-2 text-xs text-center text-stone-400 mb-2">
          <span v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
            {{ day }}
          </span>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-xs text-stone-500">
          <div v-for="day in daysOfMonth" :key="day.date" class="flex flex-col items-center">
            <div class="w-6 h-6 rounded-full" :class="day.active ? 'bg-orange-400' : 'bg-stone-200'" :title="day.date" />
            <span class="mt-1">{{ day.dayNumber }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { userProgressStore } from "@/app"
import type { IUserProgressEntity } from "@/shared/types"

export default defineComponent({
  setup() {
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
    }
  },
})
</script>
