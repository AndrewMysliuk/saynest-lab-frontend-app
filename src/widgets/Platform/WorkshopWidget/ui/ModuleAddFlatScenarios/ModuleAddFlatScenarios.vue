<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Add Scenarios</h2>
        <p class="text-sm text-slate-500 mt-2">Select scenarios and order them for this module.</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Scenarios Settings</span>
    </div>

    <!-- Body -->
    <div class="p-6">
      <div class="space-y-4">
        <div class="text-sm text-slate-600">Choose scenarios from the catalog (left). Selected & order on the right.</div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- LEFT: Catalog -->
          <div class="flex flex-col">
            <div class="mb-2 text-sm font-medium">Catalog</div>

            <div class="mb-3">
              <div class="flex-1 relative">
                <input
                  :value="searchQueryScenarios"
                  @input="onSearchInput"
                  type="text"
                  :placeholder="t('dashboard.search.placeholder')"
                  class="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
                />
                <button
                  v-if="searchQueryScenarios.length"
                  @click="clearSearch"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 transition font-medium"
                  :title="t('dashboard.search.clearTitle')"
                  type="button"
                >
                  {{ t("dashboard.search.clear") }}
                </button>
              </div>
            </div>

            <div class="flex-1">
              <div class="h-[400px] md:h-[420px] overflow-y-auto space-y-2 pr-1">
                <div v-for="item in getPromptList" :key="item._id" class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 bg-white">
                  <div class="flex items-center gap-3">
                    <div class="text-sm">{{ item.title }}</div>
                  </div>
                  <div>
                    <button
                      @click="toggleSelectScenarioWithCache(item._id)"
                      :class="[
                        'py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg',
                        isSelected(item._id) ? 'bg-primary text-white bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-white border border-gray-200 text-slate-700',
                      ]"
                    >
                      {{ isSelected(item._id) ? "Selected" : "Select" }}
                    </button>
                  </div>
                </div>

                <div ref="loadMoreTrigger" class="h-1" />

                <div v-if="isListLoading" class="text-center text-text-muted text-sm italic py-4">
                  {{ t("dashboard.loading.more") }}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Selected & order -->
          <div class="flex flex-col">
            <div class="mb-2 text-sm font-medium">Selected & order</div>

            <div v-if="!getModuleScenariosFlat.scenarios.length" class="text-sm text-slate-500">No scenarios selected</div>

            <div v-else class="flex-1">
              <div class="h-[400px] md:h-[420px] overflow-y-auto space-y-2 pr-1">
                <div v-for="(id, i) in getModuleScenariosFlat.scenarios" :key="id" class="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-xs text-slate-600">#{{ i + 1 }}</div>
                    <div class="text-sm">
                      {{ getTitle(id) }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      class="py-2 px-2.5 inline-flex items-center text-[13px] rounded-lg border border-gray-200 bg-white text-slate-700 hover:bg-gray-100 disabled:opacity-50"
                      :disabled="i === 0"
                      @click="moveScenario(i, i - 1)"
                      aria-label="Move up"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      class="py-2 px-2.5 inline-flex items-center text-[13px] rounded-lg border border-gray-200 bg-white text-slate-700 hover:bg-gray-100 disabled:opacity-50"
                      :disabled="i === getModuleScenariosFlat.scenarios.length - 1"
                      @click="moveScenario(i, i + 1)"
                      aria-label="Move down"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-[13px] rounded-lg bg-red-500 text-white hover:bg-red-600" @click="toggleSelectScenarioWithCache(id)">
                      <i class="fa-solid fa-xmark"></i>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- /RIGHT list -->
          </div>
          <!-- /RIGHT -->
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end border-t border-gray-100 px-6 py-4">
      <button
        type="button"
        class="inline-flex items-center rounded-md px-4 py-2 text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 transition"
        :disabled="isSubmitting"
        @click="onNext"
      >
        Next
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { promptStore, workshopStore } from "@/app"

export default defineComponent({
  name: "ModuleAddFlatScenarios",

  components: {},

  setup() {
    const { t } = useI18n()
    const isReady = ref<boolean>(false)
    const isSubmitting = ref<boolean>(false)
    const searchQueryScenarios = ref<string>("")
    const isListLoading = ref<boolean>(false)
    const loadMoreTrigger = ref<HTMLElement | null>(null)
    const observer = ref<IntersectionObserver | null>(null)
    const titlesCache = ref<Record<string, string>>({})
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    const getModuleScenariosFlat = computed(() => workshopStore.getModuleScenariosFlat)
    const getPromptList = computed(() => promptStore.getPromptList)
    const getPromptParams = computed(() => promptStore.getPromptParams)

    onBeforeMount(async () => {
      await fetchSetupData()

      isReady.value = true
    })

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const hasSearch = searchQueryScenarios.value.trim() !== ""

          if (hasSearch) return

          if (getPromptParams.value.hasMore) {
            isListLoading.value = true

            promptStore.fetchScenariosList(true, { is_module_only: false }).finally(() => {
              isListLoading.value = false
            })
          }
        }
      })

      if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value)
      }
    })

    const isSelected = (id: string) => getModuleScenariosFlat.value.scenarios.includes(id)
    const getTitle = (id: string) => titlesCache.value[id] ?? id

    const toggleSelectScenarioWithCache = (id: string) => {
      const fromList = getPromptList.value.find((x: any) => x._id === id)?.title
      if (fromList) titlesCache.value[id] = fromList
      toggleSelectScenario(id)
    }

    const moveScenario = (from: number, to: number) => {
      const arr = [...getModuleScenariosFlat.value.scenarios]
      if (to < 0 || to >= arr.length) return
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      workshopStore.setModuleScenariosFlat({ scenarios: arr })
    }

    const fetchSetupData = async () => {
      try {
        await promptStore.fetchScenariosList(false, { is_module_only: false })
      } catch (error: unknown) {
        console.error("Error fetchSetupData:", error)
      }
    }

    const toggleSelectScenario = async (value: string) => {
      const current = getModuleScenariosFlat.value.scenarios
      const exists = current.includes(value)

      workshopStore.setModuleScenariosFlat({
        scenarios: exists ? current.filter((item) => item !== value) : [...current, value],
      })

      if (searchQueryScenarios.value.length) {
        await clearSearch()
      }
    }

    const onSearchInput = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const val = target.value
      searchQueryScenarios.value = val

      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        handleSearchInput(val)
      }, 300)
    }

    const handleSearchInput = async (query: string) => {
      isListLoading.value = true
      observer.value?.disconnect()

      promptStore.resetPromptParams()
      await promptStore.fetchScenariosList(false, {
        search: query,
        is_module_only: false,
      })

      nextTick(() => {
        if (loadMoreTrigger.value) {
          observer.value?.observe(loadMoreTrigger.value)
        }
      })

      isListLoading.value = false
    }

    const clearSearch = async () => {
      isListLoading.value = true
      searchQueryScenarios.value = ""
      promptStore.resetPromptParams()

      await promptStore.fetchScenariosList(false, { is_module_only: false })

      isListLoading.value = false
    }

    const onNext = () => {
      // TODO
    }

    onBeforeUnmount(() => {
      observer.value?.disconnect()
    })

    return {
      loadMoreTrigger,
      isListLoading,
      searchQueryScenarios,
      isReady,
      isSubmitting,
      getModuleScenariosFlat,
      getPromptList,
      onSearchInput,
      clearSearch,
      isSelected,
      moveScenario,
      toggleSelectScenarioWithCache,
      getTitle,
      onNext,
      t,
    }
  },
})
</script>
