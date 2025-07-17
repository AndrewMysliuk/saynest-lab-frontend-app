<template>
  <div class="space-y-8">
    <div
      v-for="(scenario, index) in getPromptList"
      :key="scenario._id"
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

    <p v-if="!getPromptList.length" class="text-sm text-center text-gray-400 italic">No scenarios found.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, userProgressStore, userStore } from "@/app"
import { IPromptScenarioEntity } from "@/shared/types"
import { getPartProgress } from "@/shared/lib"

export default defineComponent({
  props: {
    expandedScenario: {
      type: [String, Number, null],
      default: "",
    },
  },

  setup(_, { emit }) {
    const getPromptList = computed(() => promptStore.getPromptList)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")
    const getCurrentUserProgress = computed(() => userProgressStore.getCurrentUserProgress?.completed_prompts ?? {})

    const selectPrompt = (prompt: IPromptScenarioEntity) => {
      emit("selectPrompt", prompt)
    }

    const toggleExpand = (index: number | string) => {
      emit("toggleExpand", index)
    }

    return {
      getPromptList,
      getUserTranslateLanguage,
      getCurrentUserProgress,
      getPartProgress,
      selectPrompt,
      toggleExpand,
    }
  },
})
</script>
