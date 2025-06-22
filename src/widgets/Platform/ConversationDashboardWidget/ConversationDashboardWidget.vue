<template>
  <div>
    <TheLoader v-if="getIsPageLoading || isLoading" />

    <div class="pt-16" v-else>
      <div v-if="isOverview" class="px-6 py-10">
        <div class="flex items-center gap-6 mb-6">
          <h1 :class="['text-3xl font-bold cursor-pointer', activeTab === PromptLibraryTabsEnum.MODULES ? 'text-primary' : 'text-gray-400']" @click="toggleTabs(PromptLibraryTabsEnum.MODULES)">
            Modules
          </h1>
          <h1 :class="['text-3xl font-bold cursor-pointer', activeTab === PromptLibraryTabsEnum.SCENARIOS ? 'text-primary' : 'text-gray-400']" @click="toggleTabs(PromptLibraryTabsEnum.SCENARIOS)">
            All Scenarios
          </h1>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            :value="activeTab === PromptLibraryTabsEnum.MODULES ? searchQueryModules : searchQueryScenarios"
            @input="onSearchInput"
            type="text"
            placeholder="Search..."
            class="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          <button
            v-if="activeTab === PromptLibraryTabsEnum.MODULES ? searchQueryModules.length : searchQueryScenarios.length"
            @click="clearSearch"
            class="text-gray-400 hover:text-gray-600 transition text-lg font-bold"
            title="Clear search"
            type="button"
          >
            Clear
          </button>
        </div>

        <div v-if="activeTab === PromptLibraryTabsEnum.MODULES" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(module, index) in getModuleList"
            :key="index"
            @click="openScenarios(module._id)"
            class="cursor-pointer bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
          >
            <div class="flex items-center justify-between mb-3 h-[32px]">
              <h3 class="text-xl font-semibold text-gray-800 truncate">
                {{ module.title }}
              </h3>
              <span class="text-sm font-medium text-gray-400"> ({{ module.level.join(", ") }}) </span>
            </div>

            <p class="text-sm text-gray-600 leading-relaxed mb-3 h-[64px] overflow-hidden">
              {{ module.description }}
            </p>

            <div class="mb-5 h-[28px] flex items-center">
              <span
                v-if="module.type === ModuleTypeEnum.STRUCTURED"
                class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-300"
              >
                Structured Module
              </span>
              <span v-else class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-300"> Open Practice </span>
            </div>

            <div class="flex flex-wrap gap-2 overflow-hidden">
              <span v-for="tag in module.tags" :key="tag" class="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                {{ formatTagLabel(tag) }}
              </span>
            </div>
          </div>

          <p v-if="!getModuleList.length" class="text-sm text-center text-gray-400 italic w-full col-span-full">No modules found.</p>
        </div>

        <div v-if="activeTab === PromptLibraryTabsEnum.SCENARIOS" class="space-y-8">
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
                  Completed {{ getCurrentUserProgress[scenario.name] }}x
                </span>
                <span v-else class="bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-full"> Not completed </span>
              </div>
            </div>

            <p class="text-sm text-text-muted mb-5">{{ scenario.description }}</p>

            <button @click.prevent.stop="toggleExpand(index)" class="text-sm text-primary font-medium hover:underline">
              {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
            </button>

            <transition name="fade">
              <div v-if="expandedScenario === index" class="mt-6 border-t border-gray-100 pt-5 space-y-6">
                <!-- Goals -->
                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1" v-if="scenario.user_content.goals">
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

        <div ref="loadMoreTrigger" class="h-1" />
      </div>

      <div class="px-6 py-10" v-else>
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-text-base">Scenarios</h1>
          <button type="button" class="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primaryDark transition-colors" @click="isOverview = true">← Back to Modules</button>
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
                      Completed {{ getCurrentUserProgress[scenario.name] }}x
                    </span>
                    <span v-else class="bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-full"> Not completed </span>
                  </div>
                </div>

                <p class="text-sm text-text-muted mb-4">{{ scenario.description }}</p>

                <button @click.prevent.stop="toggleExpand(scenario._id)" class="text-sm text-primary font-medium hover:underline">
                  {{ expandedScenario === scenario._id ? "Hide Details" : "Show Details" }}
                </button>

                <transition name="fade">
                  <div v-if="expandedScenario === scenario._id" class="mt-6 border-t border-gray-100 pt-5 space-y-6">
                    <!-- Goals -->
                    <div>
                      <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
                      <ul class="list-disc list-inside text-sm text-text-muted space-y-1" v-if="scenario.user_content.goals">
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
                  Completed {{ getCurrentUserProgress[scenario.name] }}x
                </span>
                <span v-else class="bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-full"> Not completed </span>
              </div>
            </div>

            <p class="text-sm text-text-muted mb-5">{{ scenario.description }}</p>

            <button @click.prevent.stop="toggleExpand(index)" class="text-sm text-primary font-medium hover:underline">
              {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
            </button>

            <transition name="fade">
              <div v-if="expandedScenario === index" class="mt-6 border-t border-gray-100 pt-5 space-y-6">
                <!-- Goals -->
                <div>
                  <h4 class="text-md font-semibold text-text-base mb-2">Goals</h4>
                  <ul class="list-disc list-inside text-sm text-text-muted space-y-1" scenario.user_content.goals>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { commonStore, promptStore, userProgressStore, userStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { IPromptScenarioEntity, ModuleTypeEnum } from "@/shared/types"
import { formatTagLabel } from "@/shared/lib"
import { PromptLibraryTabsEnum } from "./types"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const router = useRouter()
    const isLoading = ref<boolean>(false)
    const searchQueryModules = ref<string>("")
    const searchQueryScenarios = ref<string>("")
    const isOverview = ref<boolean>(true)
    const activeTab = ref<PromptLibraryTabsEnum>(PromptLibraryTabsEnum.MODULES)
    const expandedScenario = ref<string | number | null>(null)
    const loadMoreTrigger = ref<HTMLElement | null>(null)
    const observer = ref<IntersectionObserver | null>(null)
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getModuleList = computed(() => promptStore.getModuleList)
    const getPromptList = computed(() => promptStore.getPromptList)
    const getCurrentPrompt = computed(() => promptStore.getCurrentPrompt)
    const getModuleParams = computed(() => promptStore.getModuleParams)
    const getPromptParams = computed(() => promptStore.getPromptParams)
    const getModulePromptList = computed(() => promptStore.getModulePromptList)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getCurrentUserProgress = computed(() => userProgressStore.getCurrentUserProgress?.completed_prompts ?? {})
    const getCurrentModule = computed(() => promptStore.getCurrentModule)
    const isStructuredModule = computed(() => getCurrentModule.value?.type === ModuleTypeEnum.STRUCTURED)

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const hasSearch = activeTab.value === PromptLibraryTabsEnum.MODULES ? searchQueryModules.value.trim() !== "" : searchQueryScenarios.value.trim() !== ""

          if (hasSearch) return

          if (activeTab.value === PromptLibraryTabsEnum.MODULES && getModuleParams.value.hasMore) {
            promptStore.fetchModuleList(true)
          }

          if (activeTab.value === PromptLibraryTabsEnum.SCENARIOS && getPromptParams.value.hasMore) {
            promptStore.fetchScenariosList(true, { is_module_only: false })
          }
        }
      })

      if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value)
      }
    })

    const toggleExpand = (index: number | string) => {
      expandedScenario.value = expandedScenario.value === index ? null : index
    }

    const openScenarios = async (module_id: string) => {
      try {
        isLoading.value = true

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: "MODULE_OPENED",
          module_name: getCurrentModule.value.name,
          module_id: getCurrentModule.value._id,
          user_id: getCurrentUser.value?._id,
        })

        await Promise.all([promptStore.fetchModuleScenarios(module_id), userProgressStore.fetchCurrentUserProgress()])

        isOverview.value = false
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const getScenariosForSubmodule = (submoduleId: string) => {
      const submodule = getCurrentModule.value?.submodules.find((sm) => sm.id === submoduleId)
      if (!submodule) return []

      return submodule.scenarios.map((scenarioId) => getModulePromptList.value.find((s) => s._id === scenarioId)).filter((s): s is IPromptScenarioEntity => s !== undefined)
    }

    const selectPrompt = (prompt: IPromptScenarioEntity) => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: "SCENARIO_STARTED",
        scenario_name: getCurrentPrompt.value.name,
        scenario_id: getCurrentPrompt.value._id,
        user_id: getCurrentUser.value?._id,
      })

      promptStore.setPrompt(prompt)
      clearSearch()

      router.push({ name: "platform.conversation" })
    }

    const toggleTabs = (tab: PromptLibraryTabsEnum) => {
      activeTab.value = tab
    }

    const onSearchInput = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const val = target.value

      if (activeTab.value === PromptLibraryTabsEnum.MODULES) {
        searchQueryModules.value = val
      } else {
        searchQueryScenarios.value = val
      }

      if (debounceTimeout) clearTimeout(debounceTimeout)

      debounceTimeout = setTimeout(() => {
        handleSearchInput(val)
      }, 300)
    }

    const handleSearchInput = async (query: string) => {
      if (activeTab.value === PromptLibraryTabsEnum.MODULES) {
        promptStore.resetModuleParams()
        await promptStore.fetchModuleList(false, {
          search: query,
        })
      } else if (activeTab.value === PromptLibraryTabsEnum.SCENARIOS) {
        promptStore.resetPromptParams()
        await promptStore.fetchScenariosList(false, {
          search: query,
          is_module_only: false,
        })
      }
    }

    const clearSearch = () => {
      if (activeTab.value === PromptLibraryTabsEnum.MODULES) {
        searchQueryModules.value = ""
        promptStore.resetModuleParams()
        promptStore.fetchModuleList(false)
      } else {
        searchQueryScenarios.value = ""
        promptStore.resetPromptParams()
        promptStore.fetchScenariosList(false, { is_module_only: false })
      }
    }

    onBeforeUnmount(() => {
      observer.value?.disconnect()
    })

    return {
      isOverview,
      isLoading,
      activeTab,
      searchQueryModules,
      searchQueryScenarios,
      loadMoreTrigger,
      getIsPageLoading,
      expandedScenario,
      getPromptList,
      getModuleList,
      getModulePromptList,
      getUserTranslateLanguage,
      getCurrentUserProgress,
      getCurrentModule,
      isStructuredModule,
      clearSearch,
      onSearchInput,
      toggleExpand,
      toggleTabs,
      openScenarios,
      selectPrompt,
      getScenariosForSubmodule,
      formatTagLabel,
      ModuleTypeEnum,
      PromptLibraryTabsEnum,
    }
  },
})
</script>
