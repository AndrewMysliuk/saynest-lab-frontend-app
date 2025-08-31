<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="getIsPageLoading" />

    <div v-else class="pt-16 max-w-[1720px] w-full mx-auto">
      <div class="py-10 px-6">
        <h1 class="text-3xl font-bold text-text-base mb-6">{{ t("vocab.title") }}</h1>

        <!-- Всегда показываем карточку (табы/фильтры/таблица), эмпти-стейты — внутри таблицы -->
        <div class="p-5 space-y-4 flex flex-col bg-white border border-stone-200 shadow-2xs rounded-xl">
          <!-- Tabs -->
          <div class="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [-webkit-overflow-scrolling:touch]">
            <nav class="flex flex-nowrap gap-2 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-stone-200 scroll-smooth snap-x snap-mandatory">
              <button
                @click="toggleTier(null)"
                type="button"
                :class="[
                  'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-sm rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none shrink-0 snap-start',
                  selectedTier === null ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                ]"
              >
                {{ t("vocab.tabs.all") }}
              </button>

              <button
                @click="toggleTier(IUserWordTierEnum.UNKNOWN)"
                type="button"
                :class="[
                  'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-sm rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none shrink-0 snap-start',
                  selectedTier === IUserWordTierEnum.UNKNOWN ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                ]"
              >
                {{ t("vocab.tier_label.1") }}
              </button>

              <button
                @click="toggleTier(IUserWordTierEnum.RECOGNIZABLE)"
                type="button"
                :class="[
                  'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-sm rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none shrink-0 snap-start',
                  selectedTier === IUserWordTierEnum.RECOGNIZABLE ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                ]"
              >
                {{ t("vocab.tier_label.2") }}
              </button>

              <button
                @click="toggleTier(IUserWordTierEnum.CONTEXTUAL)"
                type="button"
                :class="[
                  'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-sm rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none shrink-0 snap-start',
                  selectedTier === IUserWordTierEnum.CONTEXTUAL ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                ]"
              >
                {{ t("vocab.tier_label.3") }}
              </button>

              <button
                @click="toggleTier(IUserWordTierEnum.MASTERED)"
                type="button"
                :class="[
                  'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-sm rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none shrink-0 snap-start',
                  selectedTier === IUserWordTierEnum.MASTERED ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                ]"
              >
                {{ t("vocab.tier_label.4") }}
              </button>
            </nav>
          </div>
          <!-- End Tabs -->

          <!-- Filters -->
          <div class="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                  <svg class="shrink-0 size-4 text-stone-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  :value="inputSearch"
                  @input="onSearchInput"
                  type="text"
                  :placeholder="t('vocab.search_placeholder')"
                  class="py-1.5 sm:py-2 ps-10 pe-8 block w-full min-w-75 bg-stone-100 border border-transparent rounded-lg sm:text-sm placeholder:text-stone-500 focus:bg-white focus:border-[#4F46E5] focus:ring-0 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
            </div>
          </div>
          <!-- End Filters -->

          <!-- Table -->
          <div class="overflow-x-auto">
            <div class="min-w-full inline-block align-middle">
              <table class="min-w-full divide-y divide-stone-200">
                <thead>
                  <tr class="border-t border-stone-200">
                    <th class="w-[25%]">
                      <div class="flex items-center px-4 py-2.5 text-sm font-normal text-stone-500">{{ t("vocab.th.word") }}</div>
                    </th>
                    <th class="w-[55%]">
                      <div class="flex items-center px-4 py-2.5 text-sm font-normal text-stone-500">{{ t("vocab.th.definition") }}</div>
                    </th>
                    <th class="w-[15%]">
                      <div class="flex items-center px-4 py-2.5 text-sm font-normal text-stone-500">{{ t("vocab.th.tier") }}</div>
                    </th>
                    <th class="w-[5%]">
                      <div class="flex items-center justify-end px-4 py-2.5 text-sm font-normal text-stone-500">{{ t("vocab.th.audio") }}</div>
                    </th>
                  </tr>
                </thead>

                <!-- rows -->
                <tbody class="divide-y divide-stone-200" v-if="!isRecordLoading && getWordsList.length">
                  <tr v-for="word in getWordsList" :key="word._id" class="hover:bg-stone-100 cursor-pointer" @click="handleWordClick(word?.global_word_entity?.word || '')">
                    <td class="px-4 py-2 align-top">
                      <div class="text-sm font-medium text-stone-800">{{ word.global_word_entity.word }}</div>
                      <div class="text-xs text-stone-500 capitalize">{{ word.global_word_entity.part_of_speech }}</div>
                    </td>

                    <td class="px-4 py-2 align-top">
                      <div class="text-sm text-stone-700 italic">
                        {{ word.global_word_entity.senses?.[0]?.definitions?.[0] || t("vocab.no_definition") }}
                      </div>
                    </td>

                    <td class="px-4 py-2 align-middle">
                      <div class="inline-flex items-center gap-2">
                        <span v-if="word.tier" class="text-xs font-medium px-2 py-0.5 rounded" :class="tierColor[word.tier]">
                          {{ t(`vocab.tier_label.${word.tier}`) }}
                        </span>
                        <span v-else class="text-xs text-gray-400">{{ t("vocab.tier_none") }}</span>
                      </div>
                    </td>

                    <td class="px-4 py-2 text-center align-middle">
                      <div class="inline-flex items-center gap-2">
                        <i class="fas fa-volume-up text-gray-500 hover:text-black cursor-pointer" @click.stop="playAudio(word)" />
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- loading -->
                <tbody class="divide-y divide-stone-200" v-else-if="isRecordLoading">
                  <tr>
                    <td colspan="4" class="text-center py-4 text-text-muted text-sm italic">
                      {{ t("vocab.loading") }}
                    </td>
                  </tr>
                </tbody>

                <!-- empty -->
                <tbody class="divide-y divide-stone-200" v-else>
                  <tr>
                    <td colspan="4" class="text-center py-4 text-text-muted text-sm italic">
                      {{ hasFilters ? t("vocab.empty_filtered") : t("vocab.empty") }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- End Table -->
        </div>
        <!-- End Card -->

        <div ref="loadMoreTrigger" class="h-1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { TheLoader } from "@/shared/components"
import { commonStore, userStore, vocabularyStore } from "@/app"
import { IUserWordPublic, IUserWordTierEnum } from "@/shared/types"

export default defineComponent({
  components: { TheLoader },
  setup() {
    const { t, locale } = useI18n()

    const loadMoreTrigger = ref<HTMLElement | null>(null)
    const observer = ref<IntersectionObserver | null>(null)
    const isRecordLoading = ref<boolean>(false)
    const selectedTier = ref<IUserWordTierEnum | null>(null)
    const inputSearch = ref<string>("")
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    const tierColor: Record<number, string> = {
      1: "bg-red-100 text-red-700",
      2: "bg-yellow-100 text-yellow-700",
      3: "bg-blue-100 text-blue-700",
      4: "bg-green-100 text-green-700",
    }

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getWordsListParams = computed(() => vocabularyStore.getWordsListParams)
    const getWordsList = computed(() => vocabularyStore.getWordsList)
    const getUserTranslateLanguage = computed(() => (locale.value ? locale.value : userStore.getCurrentUser?.explanation_language || "en"))

    const hasFilters = computed(() => !!inputSearch.value || selectedTier.value !== null)

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && getWordsListParams.value?.hasMore) {
          vocabularyStore.listUserWordsMethod(true, {
            tier: selectedTier.value ? [selectedTier.value] : undefined,
            word: inputSearch.value ? inputSearch.value : undefined,
          })
        }
      })
      if (loadMoreTrigger.value) observer.value.observe(loadMoreTrigger.value)
    })

    const playAudio = async (word: IUserWordPublic) => {
      try {
        if (!word?.global_word_entity?.audio_url) {
          await handleAudioError(word)
          return
        }
        const audio = new Audio(word.global_word_entity.audio_url)
        await audio.play()
      } catch {
        await handleAudioError(word)
      }
    }

    const handleAudioError = async (word: IUserWordPublic) => {
      const wordId = word.global_word_entity?._id
      if (!wordId) return
      try {
        await vocabularyStore.generateWordAudioUrlMethod(wordId)
        let refreshed = vocabularyStore.getSelectedWord?.global_word_entity?.audio_url
        if (!refreshed) {
          refreshed = getWordsList.value.find((item) => item.global_word_entity._id === wordId)?.global_word_entity?.audio_url
        }
        if (!refreshed) return
        const audio = new Audio(refreshed)
        await audio.play()
      } catch (err) {
        console.warn("Failed to refresh or play updated audio", err)
      }
    }

    const handleWordClick = async (word: string) => {
      if (!word) return
      try {
        vocabularyStore.setIsWordModalOpen(true)
        await vocabularyStore.lookupWordMethod({
          word,
          target_language: "en",
          native_language: getUserTranslateLanguage.value,
        })
      } catch {
        vocabularyStore.setIsWordModalOpen(false)
      }
    }

    const toggleTier = async (value: IUserWordTierEnum | null) => {
      try {
        isRecordLoading.value = true
        selectedTier.value = value
        vocabularyStore.resetWordsListParams()
        await vocabularyStore.listUserWordsMethod(false, {
          tier: selectedTier.value ? [selectedTier.value] : undefined,
          word: inputSearch.value ? inputSearch.value : undefined,
        })
        // вернуть наблюдатель на место после перерендера
        nextTick(() => {
          if (loadMoreTrigger.value) {
            observer.value?.disconnect()
            observer.value?.observe(loadMoreTrigger.value)
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        isRecordLoading.value = false
      }
    }

    const onSearchInput = async (e: Event) => {
      isRecordLoading.value = true
      const target = e.target as HTMLInputElement
      const val = target.value
      inputSearch.value = val
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        handleSearchInput(val)
      }, 300)
    }

    const handleSearchInput = async (query: string) => {
      try {
        observer.value?.disconnect()
        vocabularyStore.resetWordsListParams()
        await vocabularyStore.listUserWordsMethod(false, {
          tier: selectedTier.value ? [selectedTier.value] : undefined,
          word: query ? query : undefined,
        })
        nextTick(() => {
          if (loadMoreTrigger.value) observer.value?.observe(loadMoreTrigger.value)
        })
      } catch (error) {
        console.log(error)
      } finally {
        isRecordLoading.value = false
      }
    }

    onBeforeUnmount(() => {
      observer.value?.disconnect()
      vocabularyStore.setIsWordModalOpen(false)
    })

    return {
      t,
      inputSearch,
      selectedTier,
      isRecordLoading,
      tierColor,
      loadMoreTrigger,
      hasFilters,
      getIsPageLoading,
      getWordsList,
      getWordsListParams,
      onSearchInput,
      toggleTier,
      playAudio,
      handleWordClick,
      IUserWordTierEnum,
    }
  },
})
</script>
