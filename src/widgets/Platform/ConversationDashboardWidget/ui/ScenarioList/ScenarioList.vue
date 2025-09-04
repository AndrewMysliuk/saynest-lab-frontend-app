<template>
  <div class="space-y-6">
    <div
      v-for="(scenario, index) in getPromptList"
      :key="index"
      class="relative bg-white border-l-4 rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-[1px]"
      :class="[
        scenario.level === 'A1'
          ? 'border-l-sky-200'
          : scenario.level === 'A2'
            ? 'border-l-blue-200'
            : scenario.level === 'B1'
              ? 'border-l-indigo-200'
              : scenario.level === 'B2'
                ? 'border-l-violet-200'
                : scenario.level === 'C1'
                  ? 'border-l-purple-200'
                  : scenario.level === 'C2'
                    ? 'border-l-rose-200'
                    : 'border-l-gray-200',
      ]"
      @click="!isLocked || AVAILABLE_SCENARIOS.includes(scenario._id) ? selectPrompt(scenario) : $router.push('/platform/tariff-plans')"
    >
      <div v-if="isLocked && !AVAILABLE_SCENARIOS.includes(scenario._id)" class="absolute inset-0 z-10 bg-gray-400/50 flex items-center justify-center cursor-pointer rounded-2xl">
        <i class="fas fa-lock text-gray-600 text-3xl" :title="t('dashboard.scenarioList.lockedTitle')" />
      </div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h3 class="text-xl font-semibold text-gray-900 truncate">
          {{ scenario.title }}
        </h3>

        <!-- Unified badge -->
        <div class="w-fit mb-2">
          <span
            :class="[
              'text-xs font-medium px-3 py-1 rounded-full border',
              'inline-block',
              getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200',
            ]"
          >
            {{ scenario.level }} ·
            <span v-if="getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO')">
              {{ t("dashboard.scenarioList.status.completed", { count: getPartProgress(getCurrentUserProgress, scenario.name, "FULL_SCENARIO") }) }}
            </span>
            <span v-else>
              {{ t("dashboard.scenarioList.status.notCompleted") }}
            </span>
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-3 w-full sm:w-4/5">
        {{ scenario.description }}
      </p>

      <!-- Show Details -->
      <div class="text-right sm:flex sm:justify-end">
        <button
          @click.prevent.stop="toggleExpand(index)"
          class="text-sm text-primary font-medium inline-flex items-center gap-1 group"
          v-if="scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length"
        >
          <i :class="expandedScenario === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-base" />
          <span class="sm:group-hover:underline">
            {{ expandedScenario === index ? t("dashboard.scenarioList.details.hide") : t("dashboard.scenarioList.details.show") }}
          </span>
        </button>
      </div>

      <!-- Expanded content -->
      <transition name="fade">
        <div v-if="expandedScenario === index" class="mt-4 border-t pt-4 space-y-4">
          <!-- Goals -->
          <div v-if="scenario.user_content.goals?.length">
            <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <i class="fas fa-bullseye text-gray-500" />
              {{ t("dashboard.scenarioList.sections.goals") }}
            </h4>
            <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
              <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                <b>{{ goal.phrase }}</b> — <i class="text-gray-600">{{ resolveTranslation(goal.translation) }}</i>
              </li>
            </ul>
          </div>

          <!-- Dictionary -->
          <div v-if="scenario.user_content.dictionary?.length">
            <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <i class="fas fa-book text-gray-500" />
              {{ t("dashboard.scenarioList.sections.dictionary") }}
            </h4>
            <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
              <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                <b>{{ word.word }}</b>
                <span class="text-gray-500">({{ resolveTranslation(word.translation) }})</span>
                — {{ word.meaning }}
              </li>
            </ul>
          </div>

          <!-- Phrases -->
          <div v-if="scenario.user_content.phrases?.length">
            <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <i class="fas fa-comment-dots text-gray-500" />
              {{ t("dashboard.scenarioList.sections.phrases") }}
            </h4>
            <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
              <li v-for="phrase in scenario.user_content.phrases" :key="phrase.phrase">
                <b>"{{ phrase.phrase }}"</b> — <i class="text-gray-600">{{ resolveTranslation(phrase.translation) }}</i>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <p v-if="!getPromptList.length" class="text-sm text-center text-gray-400 italic">
      {{ t("dashboard.scenarioList.empty") }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useI18n } from "vue-i18n"
import { promptStore, subscriptionStore, userProgressStore, userStore, urlAudioPlayer } from "@/app"
import { IPromptScenarioEntity } from "@/shared/types"
import { getPartProgress } from "@/shared/lib"
import { AVAILABLE_SCENARIOS } from "@/shared/utils"

export default defineComponent({
  props: {
    expandedScenario: {
      type: [String, Number, null],
      default: "",
    },
  },

  setup(_, { emit }) {
    const { t, locale } = useI18n()

    const getPromptList = computed(() => promptStore.getPromptList)
    const getUserTranslateLanguage = computed(() => (locale.value ? locale.value : userStore.getCurrentUser?.explanation_language || "en"))
    const getCurrentUserProgress = computed(() => userProgressStore.getCurrentUserProgress?.completed_prompts ?? {})
    const isLocked = computed(() => subscriptionStore.getIsExpiredVisible || !subscriptionStore.getIsHasSubscription)

    const selectPrompt = (prompt: IPromptScenarioEntity) => {
      urlAudioPlayer.unlockAudio()
      emit("selectPrompt", prompt)
    }

    const toggleExpand = (index: number | string) => {
      emit("toggleExpand", index)
    }

    const resolveTranslation = (t: string | Record<string, string> | undefined) => {
      if (!t) return ""
      if (typeof t === "string") return t
      return t[getUserTranslateLanguage.value] || ""
    }

    return {
      isLocked,
      getPromptList,
      getCurrentUserProgress,
      getPartProgress,
      selectPrompt,
      toggleExpand,
      resolveTranslation,
      t,
      AVAILABLE_SCENARIOS,
    }
  },
})
</script>
