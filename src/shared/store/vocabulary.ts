import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IUserWordAddWordToUserRequest, IUserWordFilters, IUserWordLookUpRequest, IUserWordParams, IUserWordPublic, IUserWordUpdateUserWordTierRequest } from "../types"
import { addWordToUserHandler, deleteUserWordHandler, generateWordAudioUrlHandler, listUserWordsHandler, lookupWordHandler, updateUserWordTierHandler } from "../api"

export const useVocabularyStore = defineStore("vocabularyStore", () => {
  const selectedWord = ref<IUserWordPublic | null>(null)
  const wordsList = ref<IUserWordPublic[]>([])
  const wordsListParams = ref<IUserWordParams>({
    offset: 0,
    limit: 20,
    hasMore: true,
    isLoading: false,
  })
  const isWordModalOpen = ref<boolean>(false)
  const selectedPhrase = ref<string>("")

  const getSelectedWord = computed(() => selectedWord.value)
  const getWordsList = computed(() => wordsList.value)
  const getWordsListParams = computed(() => wordsListParams.value)
  const getIsWordModalOpen = computed(() => isWordModalOpen.value)
  const getSelectedPhrase = computed(() => selectedPhrase.value)

  const setSelectedPhrase = (value: string) => {
    selectedPhrase.value = value
  }

  const setIsWordModalOpen = (value: boolean) => {
    isWordModalOpen.value = value
  }

  const setWordsList = (value: IUserWordPublic[]) => {
    wordsList.value = value
  }

  const setSelectedWord = (value: IUserWordPublic | null) => {
    selectedWord.value = value
  }

  const resetWordsListParams = () => {
    wordsListParams.value = {
      offset: 0,
      limit: 20,
      hasMore: true,
      isLoading: false,
    }
  }

  const lookupWordMethod = async (payload: IUserWordLookUpRequest) => {
    selectedWord.value = null

    await lookupWordHandler(payload)
      .then((response: IUserWordPublic | null) => {
        selectedWord.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const generateWordAudioUrlMethod = async (global_word_id: string) => {
    await generateWordAudioUrlHandler(global_word_id)
      .then((response: string) => {
        if (selectedWord.value) {
          selectedWord.value.global_word_entity.audio_url = response
        }

        if (wordsList.value.length) {
          wordsList.value = wordsList.value.map((item) =>
            item.global_word_entity._id === global_word_id ? { ...item, global_word_entity: { ...item.global_word_entity, audio_url: response } } : item
          )
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const addWordToUserMethod = async (payload: IUserWordAddWordToUserRequest) => {
    await addWordToUserHandler(payload)
      .then((response: IUserWordPublic) => {
        selectedWord.value = response

        const alreadyExists = wordsList.value.some((r) => r._id === response._id)
        if (!alreadyExists) {
          wordsList.value.unshift(response)
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const updateUserWordTierMethod = async (payload: IUserWordUpdateUserWordTierRequest) => {
    await updateUserWordTierHandler(payload)
      .then((response: IUserWordPublic) => {
        if (selectedWord.value) {
          selectedWord.value = response
        }

        if (wordsList.value.length) {
          wordsList.value = wordsList.value.map((item) => (item._id === payload.user_word_id ? { ...item, tier: response.tier } : item))
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const deleteUserWordMethod = async (global_word_id: string) => {
    return deleteUserWordHandler(global_word_id)
      .then((response: boolean) => {
        if (selectedWord.value) {
          selectedWord.value = {
            ...selectedWord.value,
            user_id: null,
            tier: null,
          }
        }

        if (wordsList.value.length) {
          wordsList.value = wordsList.value.filter((item) => item.global_word_entity._id !== global_word_id)
        }

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const listUserWordsMethod = async (isLoadMore = false, payload?: IUserWordFilters) => {
    try {
      if (wordsListParams.value.isLoading) return

      wordsListParams.value.isLoading = true

      if (!isLoadMore) {
        wordsList.value = []
        resetWordsListParams()
      }

      const limit = payload?.limit ?? wordsListParams.value.limit
      const offset = payload?.offset ?? wordsListParams.value.offset

      const response = await listUserWordsHandler({
        ...payload,
        limit,
        offset,
      })

      if (isLoadMore) {
        wordsList.value = [...wordsList.value, ...response]
      } else {
        wordsList.value = response
      }

      wordsListParams.value.offset = offset + limit
      wordsListParams.value.hasMore = response.length === limit
    } catch (error) {
      console.error("listUserWordsMethod error:", error)
    } finally {
      wordsListParams.value.isLoading = false
    }
  }

  return {
    getSelectedWord,
    getWordsList,
    getWordsListParams,
    getIsWordModalOpen,
    getSelectedPhrase,
    setSelectedPhrase,
    setIsWordModalOpen,
    setWordsList,
    setSelectedWord,
    resetWordsListParams,
    lookupWordMethod,
    generateWordAudioUrlMethod,
    addWordToUserMethod,
    updateUserWordTierMethod,
    deleteUserWordMethod,
    listUserWordsMethod,
  }
})
