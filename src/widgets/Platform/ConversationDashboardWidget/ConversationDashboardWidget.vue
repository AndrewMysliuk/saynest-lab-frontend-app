<template>
  <div class="flex-grow min-h-0">
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

        <ModuleList v-if="activeTab === PromptLibraryTabsEnum.MODULES" @openScenarios="openScenarios" />

        <ScenarioList v-if="activeTab === PromptLibraryTabsEnum.SCENARIOS" :expanded-scenario="expandedScenario" @toggleExpand="toggleExpand" @selectPrompt="selectPrompt" />

        <div ref="loadMoreTrigger" class="h-1" />
      </div>

      <ModuleScenarioList :expanded-scenario="expandedScenario" @toggleExpand="toggleExpand" @selectPrompt="selectPrompt" @overview="isOverview = true" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { commonStore, promptStore, userProgressStore, userStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { IPromptScenarioEntity } from "@/shared/types"
import { PromptLibraryTabsEnum } from "./types"
import { ModuleList, ScenarioList, ModuleScenarioList } from "./ui"

export default defineComponent({
  components: {
    TheLoader,
    ModuleList,
    ScenarioList,
    ModuleScenarioList,
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

    const getCurrentPrompt = computed(() => promptStore.getCurrentPrompt)
    const getModuleParams = computed(() => promptStore.getModuleParams)
    const getPromptParams = computed(() => promptStore.getPromptParams)
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getCurrentModule = computed(() => promptStore.getCurrentModule)

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
      getCurrentModule,
      clearSearch,
      onSearchInput,
      toggleExpand,
      toggleTabs,
      openScenarios,
      selectPrompt,
      PromptLibraryTabsEnum,
    }
  },
})
</script>
