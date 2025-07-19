<template>
  <div class="px-6 py-10">
    <div class="flex items-center justify-between gap-3 sm:gap-6 mb-8 flex-nowrap overflow-x-auto min-w-0">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Scenarios</h1>

      <button type="button" class="inline-flex shrink-0 items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primaryDark transition-colors" @click="$emit('overview')">
        <i class="fas fa-arrow-left text-sm" />
        <span>Back to Modules</span>
      </button>
    </div>

    <div v-if="isStructuredModule" class="space-y-12">
      <div v-for="(submodule, subIndex) in getCurrentModule.submodules" :key="submodule.id" class="relative pl-6 border-l-4 border-[#4F46E5] space-y-6">
        <!-- Timeline marker -->
        <div class="absolute -left-3 sm:-left-3.5 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-primary rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
          {{ subIndex + 1 }}
        </div>

        <!-- Submodule content -->
        <div class="pl-2 sm:pl-6">
          <h2 class="text-lg sm:text-2xl font-semibold text-gray-800 mb-1">
            {{ submodule.title }}
          </h2>
          <p class="text-sm text-gray-600 max-w-none sm:max-w-3xl mb-3">
            {{ submodule.description }}
          </p>

          <ul v-if="submodule.tips?.length" class="list-disc list-inside text-xs text-gray-500 mb-2 space-y-1">
            <li v-for="tip in submodule.tips" :key="tip">💡 {{ tip }}</li>
          </ul>
        </div>

        <!-- Сценарии внутри подмодуля -->
        <div class="space-y-6">
          <div
            v-for="scenario in getScenariosForSubmodule(submodule.id)"
            :key="scenario._id"
            @click="selectPrompt(scenario)"
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
              expandedScenario === scenario._id ? 'ring-2 ring-primary/30' : '',
            ]"
          >
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:mb-3 mb-2">
              <h3 class="text-xl font-semibold text-gray-900 truncate">{{ scenario.title }}</h3>

              <!-- Unified badge -->
              <div class="w-fit mb-2">
                <span
                  :class="[
                    'text-xs font-medium px-3 py-1 rounded-full border inline-block',
                    getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200',
                  ]"
                >
                  {{ scenario.level }} ·
                  <span v-if="getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO')"> Completed {{ getPartProgress(getCurrentUserProgress, scenario.name, "FULL_SCENARIO") }}x </span>
                  <span v-else> Not completed </span>
                </span>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-3 w-full sm:w-4/5">
              {{ scenario.description }}
            </p>

            <!-- Toggle -->
            <div class="text-right sm:flex sm:justify-end">
              <button
                @click.prevent.stop="toggleExpand(scenario._id)"
                class="text-sm text-primary font-medium inline-flex items-center gap-1 group"
                v-if="scenario.user_content.goals?.length || scenario.user_content.dictionary?.length || scenario.user_content.phrases?.length"
              >
                <i :class="expandedScenario === scenario._id ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-base" />
                <span class="sm:group-hover:underline">{{ expandedScenario === scenario._id ? "Hide Details" : "Show Details" }}</span>
              </button>
            </div>

            <!-- Expandable -->
            <transition name="fade">
              <div v-if="expandedScenario === scenario._id" class="mt-4 border-t pt-4 space-y-4">
                <!-- Goals -->
                <div v-if="scenario.user_content.goals?.length">
                  <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2"><i class="fas fa-bullseye text-gray-500" /> Goals</h4>
                  <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                    <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                      <b>{{ goal.phrase }}</b> — <i class="text-gray-600">{{ goal.translation[getUserTranslateLanguage] }}</i>
                    </li>
                  </ul>
                </div>

                <!-- Dictionary -->
                <div v-if="scenario.user_content.dictionary?.length">
                  <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2"><i class="fas fa-book text-gray-500" /> Dictionary</h4>
                  <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                    <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                      <b>{{ word.word }}</b> <span class="text-gray-500">({{ word.translation[getUserTranslateLanguage] }})</span> — {{ word.meaning }}
                    </li>
                  </ul>
                </div>

                <!-- Phrases -->
                <div v-if="scenario.user_content.phrases?.length">
                  <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2"><i class="fas fa-comment-dots text-gray-500" /> Phrases</h4>
                  <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                    <li v-for="phrase in scenario.user_content.phrases" :key="phrase.phrase">
                      <b>"{{ phrase.phrase }}"</b> — <i class="text-gray-600">{{ phrase.translation[getUserTranslateLanguage] }}</i>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(scenario, index) in getModulePromptList"
        :key="index"
        @click="selectPrompt(scenario)"
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
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:mb-3 mb-2">
          <h3 class="text-xl font-semibold text-gray-900 truncate">{{ scenario.title }}</h3>

          <!-- Unified badge -->
          <div class="w-fit mb-2">
            <span
              :class="[
                'text-xs font-medium px-3 py-1 rounded-full border inline-block',
                getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200',
              ]"
            >
              {{ scenario.level }} ·
              <span v-if="getPartProgress(getCurrentUserProgress, scenario.name, 'FULL_SCENARIO')"> Completed {{ getPartProgress(getCurrentUserProgress, scenario.name, "FULL_SCENARIO") }}x </span>
              <span v-else> Not completed </span>
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-600 mb-4 line-clamp-3 sm:w-4/5">
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
              {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
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
                Goals
              </h4>
              <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                <li v-for="goal in scenario.user_content.goals" :key="goal.phrase">
                  <b>{{ goal.phrase }}</b> — <i class="text-gray-600">{{ goal.translation[getUserTranslateLanguage] }}</i>
                </li>
              </ul>
            </div>

            <!-- Dictionary -->
            <div v-if="scenario.user_content.dictionary?.length">
              <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                <i class="fas fa-book text-gray-500" />
                Dictionary
              </h4>
              <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                <li v-for="word in scenario.user_content.dictionary" :key="word.word">
                  <b>{{ word.word }}</b> <span class="text-gray-500">({{ word.translation[getUserTranslateLanguage] }})</span> — {{ word.meaning }}
                </li>
              </ul>
            </div>

            <!-- Phrases -->
            <div v-if="scenario.user_content.phrases?.length">
              <h4 class="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                <i class="fas fa-comment-dots text-gray-500" />
                Phrases
              </h4>
              <ul class="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-4 list-disc">
                <li v-for="phrase in scenario.user_content.phrases" :key="phrase.phrase">
                  <b>"{{ phrase.phrase }}"</b> — <i class="text-gray-600">{{ phrase.translation[getUserTranslateLanguage] }}</i>
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
