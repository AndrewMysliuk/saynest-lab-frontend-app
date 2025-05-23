<template>
  <div>
    <TheLoader v-if="getIsPageLoading" />

    <div class="pt-16" v-else>
      <div v-if="isModules" class="px-6 py-10">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-text-base">Modules</h1>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(prompt, index) in getModuleList"
            :key="index"
            @click="openScenarios(prompt.id)"
            class="cursor-pointer bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-semibold text-gray-800">
                {{ prompt.title }}
              </h3>
              <span class="text-sm font-medium text-gray-400"> ({{ prompt.level.join(", ") }}) </span>
            </div>

            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              {{ prompt.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span v-for="tag in prompt.tags" :key="tag" class="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-10" v-else>
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-text-base">Scenarios</h1>
          <button type="button" class="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primaryDark transition-colors" @click="isModules = true">← Back to Modules</button>
        </div>

        <div class="space-y-8">
          <div
            v-for="(scenario, index) in getPromptList"
            :key="index"
            @click="selectPrompt(scenario)"
            class="bg-stone-50 hover:bg-stone-100 transition-colors duration-200 rounded-xl p-6 border border-stone-200 shadow-sm cursor-pointer relative"
            :class="expandedScenario === index ? 'ring-2 ring-primary/30' : ''"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 class="text-xl font-semibold text-gray-800">
                {{ scenario.title }}
              </h3>
              <div class="flex flex-wrap gap-3 text-xs text-gray-500">
                <span><b>Module:</b> {{ scenario.module }}</span>
                <span><b>Level:</b> {{ scenario.level }}</span>
              </div>
            </div>

            <p class="text-sm text-text-muted mb-5">
              {{ scenario.description }}
            </p>

            <button @click.prevent.stop="toggleExpand(index)" class="text-sm text-primary font-medium hover:underline">
              {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
            </button>

            <transition name="fade">
              <div v-if="expandedScenario === index" class="mt-6 border-t border-gray-100 pt-5 space-y-6">
                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                    <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                      {{ goal.phrase }} — <i>{{ goal.translation[getUserTranslateLanguage] }}</i>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Dictionary</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                    <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                      <b>{{ word.word }}</b> ({{ word.translation[getUserTranslateLanguage] }}) — {{ word.meaning }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Phrases</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                    <li v-for="phrase in scenario.user_content.phrases" :key="phrase.phrase">
                      "{{ phrase.phrase }}" — <i>{{ phrase.translation[getUserTranslateLanguage] }}</i>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import { commonStore, promptStore, userStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { IPromptScenario } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const router = useRouter()
    const isModules = ref<boolean>(true)
    const expandedScenario = ref<number | null>(null)

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getModuleList = computed(() => promptStore.getModuleList)
    const getPromptList = computed(() => promptStore.getPromptList)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "uk")

    const toggleExpand = (index: number) => {
      expandedScenario.value = expandedScenario.value === index ? null : index
    }

    const openScenarios = async (module_id: string) => {
      try {
        await promptStore.fetchModuleScenarios(module_id)

        isModules.value = false
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const selectPrompt = (prompt: IPromptScenario) => {
      promptStore.setPrompt(prompt)

      router.push({ name: "platform.conversation" })
    }

    return {
      getIsPageLoading,
      isModules,
      expandedScenario,
      getModuleList,
      getPromptList,
      getUserTranslateLanguage,
      toggleExpand,
      openScenarios,
      selectPrompt,
    }
  },
})
</script>
