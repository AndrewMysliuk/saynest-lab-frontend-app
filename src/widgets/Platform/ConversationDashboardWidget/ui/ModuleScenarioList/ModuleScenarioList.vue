<template>
  <div class="px-6 py-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-text-base">Scenarios</h1>
      <button type="button" class="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primaryDark transition-colors" @click="$emit('overview')">← Back to Modules</button>
    </div>

    <div v-if="isStructuredModule" class="space-y-12">
      <div v-for="(submodule, subIndex) in getCurrentModule.submodules" :key="submodule.id" class="relative pl-6 border-l-4 border-primary space-y-6">
        <!-- Timeline indicator -->
        <div class="absolute -left-3.5 top-0 w-6 h-6 bg-white border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold">
          {{ subIndex + 1 }}
        </div>

        <!-- Подмодуль -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-1">{{ submodule.title }}</h2>
          <p class="text-sm text-gray-600 max-w-3xl mb-3">{{ submodule.description }}</p>

          <ul v-if="submodule.tips?.length" class="list-disc list-inside text-xs text-gray-500 mb-1 space-y-1">
            <li v-for="tip in submodule.tips" :key="tip">💡 {{ tip }}</li>
          </ul>
        </div>

        <!-- Сценарии -->
        <div class="space-y-6">
          <div
            v-for="scenario in getScenariosForSubmodule(submodule.id)"
            :key="scenario._id"
            @click="selectPrompt(scenario)"
            class="ml-2 bg-stone-50 hover:bg-stone-100 transition-colors duration-200 rounded-xl p-6 border border-stone-200 shadow-sm cursor-pointer relative"
            :class="expandedScenario === scenario._id ? 'ring-2 ring-primary/30' : ''"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 class="text-lg font-semibold text-gray-800">{{ scenario.title }}</h3>
              <div class="flex flex-wrap gap-2 text-xs items-center">
                <span class="bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full"> Level: {{ scenario.level }} </span>

                <span v-if="getCurrentUserProgress[scenario.name]" class="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                  Completed {{ getPartProgress(getCurrentUserProgress, scenario.name, "FULL_SCENARIO") }}x
                </span>
                <span v-else class="bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-full"> Not completed </span>
              </div>
            </div>

            <p class="text-sm text-text-muted mb-4">{{ scenario.description }}</p>

            <button
              @click.prevent.stop="toggleExpand(scenario._id)"
              class="text-sm text-primary font-medium hover:underline"
              v-if="scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length"
            >
              {{ expandedScenario === scenario._id ? "Hide Details" : "Show Details" }}
            </button>

            <transition name="fade">
              <div
                v-if="expandedScenario === scenario._id && (scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length)"
                class="mt-6 border-t border-gray-100 pt-5 space-y-6"
              >
                <!-- Goals -->
                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                    <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                      {{ goal.phrase }} — <i>{{ goal.translation[getUserTranslateLanguage] }}</i>
                    </li>
                  </ul>
                </div>

                <!-- Dictionary -->
                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Dictionary</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                    <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                      <b>{{ word.word }}</b> ({{ word.translation[getUserTranslateLanguage] }}) — {{ word.meaning }}
                    </li>
                  </ul>
                </div>

                <!-- Phrases -->
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

    <div v-else class="space-y-8">
      <div
        v-for="(scenario, index) in getModulePromptList"
        :key="index"
        @click="selectPrompt(scenario)"
        class="bg-stone-50 hover:bg-stone-100 transition-colors duration-200 rounded-xl p-6 border border-stone-200 shadow-sm cursor-pointer relative"
        :class="expandedScenario === index ? 'ring-2 ring-primary/30' : ''"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ scenario.title }}</h3>
          <div class="flex flex-wrap gap-2 text-xs items-center">
            <span class="bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full"> Level: {{ scenario.level }} </span>

            <span v-if="getCurrentUserProgress[scenario.name]" class="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
              Completed {{ getPartProgress(getCurrentUserProgress, scenario.name, "FULL_SCENARIO") }}x
            </span>
            <span v-else class="bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-full"> Not completed </span>
          </div>
        </div>

        <p class="text-sm text-text-muted mb-5">{{ scenario.description }}</p>

        <button
          @click.prevent.stop="toggleExpand(index)"
          class="text-sm text-primary font-medium hover:underline"
          v-if="scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length"
        >
          {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
        </button>

        <transition name="fade">
          <div
            v-if="expandedScenario === index && (scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length)"
            class="mt-6 border-t border-gray-100 pt-5 space-y-6"
          >
            <!-- Goals -->
            <div>
              <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
              <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                  {{ goal.phrase }} — <i>{{ goal.translation[getUserTranslateLanguage] }}</i>
                </li>
              </ul>
            </div>

            <!-- Dictionary -->
            <div>
              <h4 class="text-md font-semibold text-text-base mb-2">Dictionary</h4>
              <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
                <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                  <b>{{ word.word }}</b> ({{ word.translation[getUserTranslateLanguage] }}) — {{ word.meaning }}
                </li>
              </ul>
            </div>

            <!-- Phrases -->
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
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, userProgressStore, userStore } from "@/app"
import { IPromptScenarioEntity, ModuleTypeEnum } from "@/shared/types"
import { getPartProgress } from "@/shared/lib"

export default defineComponent({
  props: {
    expandedScenario: {
      type: [String, Number, null],
      default: "",
    },
  },

  setup(_, { emit }) {
    const getCurrentModule = computed(() => promptStore.getCurrentModule)
    const getModulePromptList = computed(() => promptStore.getModulePromptList)
    const isStructuredModule = computed(() => getCurrentModule.value?.type === ModuleTypeEnum.STRUCTURED)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")
    const getCurrentUserProgress = computed(() => userProgressStore.getCurrentUserProgress?.completed_prompts ?? {})

    const getScenariosForSubmodule = (submoduleId: string) => {
      const submodule = getCurrentModule.value?.submodules.find((sm) => sm.id === submoduleId)
      if (!submodule) return []

      return submodule.scenarios.map((scenarioId) => getModulePromptList.value.find((s) => s._id === scenarioId)).filter((s): s is IPromptScenarioEntity => s !== undefined)
    }

    const selectPrompt = (prompt: IPromptScenarioEntity) => {
      emit("selectPrompt", prompt)
    }

    const toggleExpand = (index: number | string) => {
      emit("toggleExpand", index)
    }

    return {
      isStructuredModule,
      getCurrentModule,
      getModulePromptList,
      getUserTranslateLanguage,
      getCurrentUserProgress,
      selectPrompt,
      toggleExpand,
      getPartProgress,
      getScenariosForSubmodule,
    }
  },
})
</script>
