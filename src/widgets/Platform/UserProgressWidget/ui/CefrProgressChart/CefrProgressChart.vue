<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h2 class="text-lg font-semibold mb-4">CEFR Level Over Time</h2>
    <div class="h-64" v-if="chartData">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-gray-400 text-sm">No CEFR progress data available yet.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { Line } from "vue-chartjs"
import type { ChartOptions } from "chart.js"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js"
import { userProgressStore } from "@/app"

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

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
    const userProgress = computed(() => userProgressStore.getCurrentUserProgress)

    const chartData = computed(() => {
      const history = userProgress.value?.cefr_history
      if (!history || history.length === 0) return null

      const labels = history.map((h) => new Date(h.date).toLocaleDateString())
      const data = history.map((h) => LEVEL_MAP[h.level] ?? 0)

      return {
        labels,
        datasets: [
          {
            label: "CEFR Level",
            data,
            fill: false,
            borderColor: "#6366f1",
            backgroundColor: "#6366f1",
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      }
    })

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
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
          min: 0.5,
          max: 6.5,
          ticks: {
            stepSize: 1,
            callback: (value: string | number) => {
              const LEVELS = ["", "A1", "A2", "B1", "B2", "C1", "C2"]
              const numericValue = typeof value === "number" ? value : parseInt(value)
              return LEVELS[numericValue]
            },
          },
          title: {
            display: true,
            text: "CEFR Level",
          },
          grid: {
            color: "#e5e7eb",
          },
        },
        x: {
          grid: {
            color: "#f3f4f6",
          },
        },
      },
    }

    return {
      chartData,
      chartOptions,
    }
  },
})
</script>
