<template>
  <div class="p-5 flex flex-col bg-white border border-stone-200 shadow-sm rounded-xl">
    <h2 class="font-medium text-stone-800 text-base md:text-lg">
      {{ t("progress.cefr.title") }}
    </h2>

    <div class="min-h-[215px] md:min-h-[300px] mt-5 relative" v-if="chartData">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="text-gray-400 text-sm mt-4">
      {{ t("progress.cefr.empty") }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useI18n } from "vue-i18n"
import { Line } from "vue-chartjs"
import type { ChartOptions, ScriptableContext } from "chart.js"
import { Chart as ChartJS, Filler, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js"
import { userProgressStore } from "@/app"

ChartJS.register(Title, Tooltip, Legend, Filler, LineElement, PointElement, CategoryScale, LinearScale)

const LEVEL_MAP: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
}

export default defineComponent({
  components: {
    Line,
  },

  setup() {
    const { t } = useI18n()
    const userProgress = computed(() => userProgressStore.getCurrentUserProgress)

    const chartData = computed(() => {
      const history = userProgress.value?.cefr_history
      if (!history || history.length === 0) return null

      const labels = history.map((h) => new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      const data = history.map((h) => LEVEL_MAP[h.level.toUpperCase().trim()] ?? 0)

      return {
        labels,
        datasets: [
          {
            label: "CEFR Level",
            data,
            borderColor: "#4F46E5",
            backgroundColor: (ctx: ScriptableContext<"line">) => {
              const chart = ctx.chart
              const { ctx: canvasCtx, chartArea } = chart
              if (!chartArea) return

              const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
              gradient.addColorStop(0, "rgba(79, 70, 229, 0.4)")
              gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.2)")
              gradient.addColorStop(1, "rgba(79, 70, 229, 0)")
              return gradient
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      }
    })

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "white",
          titleColor: "#1f2937",
          bodyColor: "#374151",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          titleFont: { weight: 600 },
          bodyFont: { weight: 500 },
          callbacks: {
            label: (context: any) => {
              const level = context.parsed.y
              const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
              return `Level: ${LEVELS[level - 1]}`
            },
          },
        },
      },
      scales: {
        y: {
          min: 1,
          max: 6,
          ticks: {
            padding: 8,
            stepSize: 1,
            callback: (tickValue: number | string) => {
              const LEVELS = ["", "A1", "A2", "B1", "B2", "C1", "C2"]
              const val = Number(tickValue)

              return LEVELS[val] || ""
            },
            color: "#6b7280",
            font: {
              size: 12,
              weight: 500,
              family: "Inter, sans-serif",
            },
          },
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
      },
    }

    return {
      chartData,
      chartOptions,
      t,
    }
  },
})
</script>
