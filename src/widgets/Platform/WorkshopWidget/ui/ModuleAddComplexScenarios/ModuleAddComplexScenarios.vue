<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Define Complex Scenarios</h2>
        <p class="text-sm text-slate-500 mt-2">Select scenarios and order them for this module.</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Scenarios Settings</span>
    </div>

    <!-- Body -->
    <div class="p-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">Create submodules and assign scenarios to each.</div>
          <button
            class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
            @click="addSubmodule"
          >
            <i class="fa-solid fa-plus"></i>
            Add submodule
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(submodule, index) in getModuleStructureComplex.submodules" :key="index" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="font-medium">{{ submodule.title ? submodule.title : `Submodule ${index + 1}` }}</div>
              </div>
              <div class="flex items-center gap-2" v-if="index > 0">
                <button class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-[13px] rounded-lg bg-red-500 text-white hover:bg-red-600" @click="removeSubmodule(index)">
                  <i class="fa-solid fa-xmark"></i>
                  Remove submodule
                </button>
              </div>
            </div>

            <div class="mt-3 space-y-3">
              <div class="space-y-2 md:col-span-2">
                <WorkshopTextField
                  :model-value="submodule.title"
                  @update:model-value="(value: string) => updateTitle(value, index)"
                  label="Title"
                  placeholder="Submodule title"
                  :error="titleErrors[index]"
                  is-required
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <WorkshopTextField
                  :model-value="submodule.description"
                  @update:model-value="(value: string) => updateDescription(value, index)"
                  label="Description"
                  placeholder="Short summary of what this submodule covers"
                  :error="descriptionErrors[index]"
                  is-required
                  is-multiline
                  :rows="3"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium">Tips</label>
                  <button
                    class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                    @click="addTip(index)"
                  >
                    <i class="fa-solid fa-plus"></i>
                    Add tip
                  </button>
                </div>
                <div class="space-y-2 mt-2">
                  <div v-for="(tip, tipIndex) in submodule.tips" :key="tipIndex" class="flex items-start gap-2">
                    <WorkshopTextField
                      class="flex-1"
                      :model-value="tip"
                      @update:model-value="(value: string) => updateTip(value, index, tipIndex)"
                      placeholder="Short tip"
                      :error="tipsErrors[index][tipIndex]"
                    />

                    <button class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-[13px] rounded-lg bg-red-500 text-white hover:bg-red-600" @click="removeTip(index, tipIndex)">
                      <i class="fa-solid fa-xmark"></i>
                      Remove tip
                    </button>
                  </div>
                </div>
              </div>

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
                            @click="toggleSelectScenarioWithCache(item._id, index)"
                            :class="[
                              'py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg',
                              isSelected(item._id, index) ? 'bg-primary text-white bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-white border border-gray-200 text-slate-700',
                            ]"
                          >
                            {{ isSelected(item._id, index) ? "Selected" : "Select" }}
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

                  <div v-if="!submodule.scenarios.length" class="text-sm text-slate-500">No scenarios selected</div>

                  <div v-else class="flex-1">
                    <div class="h-[400px] md:h-[420px] overflow-y-auto space-y-2 pr-1">
                      <div v-for="(id, i) in submodule.scenarios" :key="id" class="flex items-center justify-between rounded-lg bg-gray-50 p-2">
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
                            @click="moveScenario(index, i, i - 1)"
                            aria-label="Move up"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            class="py-2 px-2.5 inline-flex items-center text-[13px] rounded-lg border border-gray-200 bg-white text-slate-700 hover:bg-gray-100 disabled:opacity-50"
                            :disabled="i === submodule.scenarios.length - 1"
                            @click="moveScenario(index, i, i + 1)"
                            aria-label="Move down"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-[13px] rounded-lg bg-red-500 text-white hover:bg-red-600"
                            @click="toggleSelectScenarioWithCache(id, index)"
                          >
                            <i class="fa-solid fa-xmark"></i>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- /RIGHT list -->
                </div>
              </div>
            </div>

            <p v-if="scenariosErrors[index]" class="text-xs text-red-500 mt-6">
              {{ scenariosErrors[index] }}
            </p>
          </div>
          <!-- /submodule -->
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
import { defineComponent, ref, computed, onBeforeUnmount, onBeforeMount, onMounted, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { promptStore, workshopStore } from "@/app"
import { WorkshopTextField } from "@/shared/components"
import { SubmoduleSchema } from "@/shared/validation"

export default defineComponent({
  name: "ModuleAddComplexScenarios",

  components: {
    WorkshopTextField,
  },

  setup() {
    const { t } = useI18n()
    const isSubmitting = ref<boolean>(false)
    const searchQueryScenarios = ref<string>("")
    const isListLoading = ref<boolean>(false)
    const loadMoreTrigger = ref<HTMLElement | HTMLElement[] | null>(null)
    const observer = ref<IntersectionObserver | null>(null)
    const titlesCache = ref<Record<string, string>>({})
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null
    const titleErrors = ref<string[]>([])
    const descriptionErrors = ref<string[]>([])
    const tipsErrors = ref<string[][]>([])
    const scenariosErrors = ref<string[]>([])

    const getModuleStructureComplex = computed(() => workshopStore.getModuleStructureComplex)
    const getPromptList = computed(() => promptStore.getPromptList)
    const getPromptParams = computed(() => promptStore.getPromptParams)

    onBeforeMount(async () => {
      await fetchSetupData()
    })

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        const anyIntersecting = entries.some((e) => e.isIntersecting)
        if (!anyIntersecting) return

        const hasSearch = searchQueryScenarios.value.trim() !== ""
        if (hasSearch) return

        if (getPromptParams.value.hasMore) {
          isListLoading.value = true
          promptStore.fetchScenariosList(true, { is_module_only: false }).finally(() => {
            isListLoading.value = false
          })
        }
      })

      observeTriggers()
    })

    const fetchSetupData = async () => {
      try {
        await promptStore.fetchScenariosList(false, { is_module_only: false })
      } catch (error: unknown) {
        console.error("Error fetchSetupData:", error)
      }
    }

    const validateSubmodule = (idx: number) => {
      titleErrors.value[idx] = ""
      descriptionErrors.value[idx] = ""
      scenariosErrors.value[idx] = ""
      tipsErrors.value[idx] = []

      const sub = getModuleStructureComplex.value.submodules[idx]
      if (!sub) return false

      const payload = {
        title: (sub.title ?? "").trim(),
        description: (sub.description ?? "").trim(),
        tips: sub.tips ?? [],
        scenarios: sub.scenarios ?? [],
      }

      const res = SubmoduleSchema.safeParse(payload)
      if (res.success) return true

      for (const issue of res.error.issues) {
        const [field, subIndex] = issue.path as (string | number)[]

        if (field === "title") {
          if (!titleErrors.value[idx]) titleErrors.value[idx] = issue.message
        } else if (field === "description") {
          if (!descriptionErrors.value[idx]) descriptionErrors.value[idx] = issue.message
        } else if (field === "scenarios") {
          if (!scenariosErrors.value[idx]) scenariosErrors.value[idx] = issue.message
        } else if (field === "tips") {
          if (typeof subIndex === "number") {
            if (!tipsErrors.value[idx]) tipsErrors.value[idx] = []
            if (!tipsErrors.value[idx][subIndex]) tipsErrors.value[idx][subIndex] = issue.message
          } else {
            if (!tipsErrors.value[idx]?.[0]) {
              tipsErrors.value[idx][0] = issue.message
            }
          }
        }
      }

      return false
    }

    // ---- selection per submodule ----
    const isSelected = (id: string, submoduleIndex: number) => {
      const sub = getModuleStructureComplex.value.submodules[submoduleIndex]
      return !!sub && sub.scenarios.includes(id)
    }

    const getTitle = (id: string) => titlesCache.value[id] ?? id

    const toggleSelectScenarioWithCache = (id: string, submoduleIndex: number) => {
      const fromList = getPromptList.value.find((x: any) => x._id === id)?.title
      if (fromList) titlesCache.value[id] = fromList
      toggleSelectScenario(id, submoduleIndex)
    }

    const moveScenario = (submoduleIndex: number, from: number, to: number) => {
      const sub = getModuleStructureComplex.value.submodules[submoduleIndex]
      if (!sub) return
      const arr = [...sub.scenarios]
      if (to < 0 || to >= arr.length) return
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((s, i) => (i === submoduleIndex ? { ...s, scenarios: arr } : s)),
      })
    }

    const toggleSelectScenario = async (value: string, submoduleIndex: number) => {
      const sub = getModuleStructureComplex.value.submodules[submoduleIndex]
      if (!sub) return
      const exists = sub.scenarios.includes(value)

      const nextScenarios = exists ? sub.scenarios.filter((item) => item !== value) : [...sub.scenarios, value]

      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((s, i) => (i === submoduleIndex ? { ...s, scenarios: nextScenarios } : s)),
      })

      if (searchQueryScenarios.value.length) {
        await clearSearch()
      }
    }

    // ---- /selection per submodule ----
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
      disconnectObserver()

      promptStore.resetPromptParams()
      await promptStore.fetchScenariosList(false, {
        search: query,
        is_module_only: false,
      })

      await nextTick()
      observeTriggers()

      isListLoading.value = false
    }

    const clearSearch = async () => {
      isListLoading.value = true
      searchQueryScenarios.value = ""
      disconnectObserver()

      promptStore.resetPromptParams()
      await promptStore.fetchScenariosList(false, { is_module_only: false })

      await nextTick()
      observeTriggers()

      isListLoading.value = false
    }

    const addSubmodule = () => {
      workshopStore.setModuleStructureComplex({
        submodules: [
          ...getModuleStructureComplex.value.submodules,
          {
            title: "",
            description: "",
            tips: [],
            scenarios: [],
          },
        ],
      })
    }

    const removeSubmodule = (index: number) => {
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.filter((_, i) => i !== index),
      })
    }

    const updateTitle = (value: string, index: number) => {
      titleErrors.value[index] = ""
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((sub, i) => (i === index ? { ...sub, title: value } : sub)),
      })
    }

    const updateDescription = (value: string, index: number) => {
      descriptionErrors.value[index] = ""
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((sub, i) => (i === index ? { ...sub, description: value } : sub)),
      })
    }

    const addTip = (submoduleIndex: number) => {
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((sub, i) => (i === submoduleIndex ? { ...sub, tips: [...sub.tips, ""] } : sub)),
      })
    }

    const updateTip = (value: string, submoduleIndex: number, tipIndex: number) => {
      tipsErrors.value[submoduleIndex][tipIndex] = ""
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((sub, i) =>
          i === submoduleIndex
            ? {
                ...sub,
                tips: sub.tips.map((tip, j) => (j === tipIndex ? value : tip)),
              }
            : sub
        ),
      })
    }

    const removeTip = (submoduleIndex: number, tipIndex: number) => {
      workshopStore.setModuleStructureComplex({
        submodules: getModuleStructureComplex.value.submodules.map((sub, i) =>
          i === submoduleIndex
            ? {
                ...sub,
                tips: sub.tips.filter((_, j) => j !== tipIndex),
              }
            : sub
        ),
      })
    }

    const observeTriggers = () => {
      const io = observer.value
      if (!io) return

      const target = loadMoreTrigger.value
      if (Array.isArray(target)) {
        target.forEach((el) => el && io.observe(el))
      } else if (target) {
        io.observe(target)
      }
    }

    const disconnectObserver = () => {
      observer.value?.disconnect()
    }

    const onNext = () => {
      const len = getModuleStructureComplex.value.submodules.length
      titleErrors.value.length = len
      descriptionErrors.value.length = len
      tipsErrors.value.length = len
      scenariosErrors.value.length = len

      let allOk = true
      for (let i = 0; i < len; i++) {
        const ok = validateSubmodule(i)
        if (!ok) allOk = false
      }
      if (!allOk) return

      alert("Validation Success")
    }

    onBeforeUnmount(() => {
      disconnectObserver()
    })

    return {
      loadMoreTrigger,
      isListLoading,
      searchQueryScenarios,
      isSubmitting,
      titleErrors,
      descriptionErrors,
      tipsErrors,
      scenariosErrors,
      getModuleStructureComplex,
      getPromptList,
      // methods
      isSelected,
      addSubmodule,
      removeSubmodule,
      updateTitle,
      updateDescription,
      addTip,
      updateTip,
      removeTip,
      onSearchInput,
      clearSearch,
      moveScenario,
      toggleSelectScenarioWithCache,
      getTitle,
      onNext,
      t,
    }
  },
})
</script>
