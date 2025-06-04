import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IUserEntity, IUserLegalRequest, IUserUpdateRequest } from "../types"
import { acceptUserPolicies, getUserHandler, patchUserHandler } from "../api"

export const useUserStore = defineStore("userStore", () => {
  const currentUser = ref<IUserEntity | null>(null)

  const getCurrentUser = computed(() => currentUser.value)
  const getUserLegal = computed(() => getCurrentUser.value?.settings)

  const setUserData = (payload: IUserEntity | null) => {
    currentUser.value = payload
  }

  const fetchGetUser = async () => {
    await getUserHandler()
      .then((response: IUserEntity | null) => {
        currentUser.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchPatchUser = async (payload: IUserUpdateRequest) => {
    await patchUserHandler(payload)
      .then((response: IUserEntity | null) => {
        currentUser.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchUserLegal = async (payload: IUserLegalRequest) => {
    await acceptUserPolicies(payload)
      .then((response: IUserEntity | null) => {
        currentUser.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getCurrentUser,
    getUserLegal,
    setUserData,
    fetchGetUser,
    fetchPatchUser,
    fetchUserLegal,
  }
})
