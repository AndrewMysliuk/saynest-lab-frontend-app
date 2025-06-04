<template>
  <div class="w-full h-full overflow-y-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
    <form class="max-w-md space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-text-muted">Email (readonly)</label>
        <input type="email" :value="getCurrentUser?.email" disabled class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-text-base" />
        <p v-if="errorMessages.email" class="mt-1 text-sm text-red-600">{{ errorMessages.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted">First Name</label>
        <input v-model="form.first_name" type="text" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-text-base" />
        <p v-if="errorMessages.first_name" class="mt-1 text-sm text-red-600">{{ errorMessages.first_name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-muted">Last Name</label>
        <input v-model="form.last_name" type="text" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-text-base" />
        <p v-if="errorMessages.last_name" class="mt-1 text-sm text-red-600">{{ errorMessages.last_name }}</p>
      </div>

      <div>
        <label for="country" class="block text-sm font-medium text-text-muted">Country</label>
        <div class="relative">
          <select
            id="country"
            v-model="form.country"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
          >
            <option value="" disabled>Select your country</option>
            <option v-for="country in countryOptions" :key="country.alpha_2" :value="country.alpha_2">
              {{ country.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p v-if="errorMessages.country" class="mt-1 text-sm text-red-600">{{ errorMessages.country }}</p>
      </div>

      <div>
        <label for="explanation_language" class="block text-sm font-medium text-text-muted">Explanation Language</label>
        <div class="relative">
          <select
            id="explanation_language"
            v-model="form.explanation_language"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
          >
            <option value="" disabled>Select a language</option>
            <option v-for="lang in languageOptions" :key="lang.language_iso" :value="lang.language_iso">
              {{ lang.language }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p v-if="errorMessages.explanation_language" class="mt-1 text-sm text-red-600">{{ errorMessages.explanation_language }}</p>
      </div>

      <div v-if="errorMessages?._global" class="text-sm text-red-600 bg-red-100 border border-red-200 rounded-md p-3">
        {{ errorMessages._global }}
      </div>

      <div class="flex items-center gap-4 mt-6">
        <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-100 text-text-base rounded-md hover:bg-gray-200 transition">← Back</button>

        <button type="submit" :disabled="!isChanged" class="px-4 py-2 bg-primary text-white rounded-md transition hover:bg-primaryDark disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
      </div>
    </form>

    <div class="flex flex-col gap-2 mt-8 border-t pt-4">
      <button type="button" @click="isDeleteHistoryModalOpen = true" class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Delete All Conversation History</button>

      <button type="button" @click="isDeleteAccountModalOpen = true" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Delete Account</button>
    </div>

    <v-modal v-model="isDeleteHistoryModalOpen">
      <TheConfirmation
        title="Delete All Conversation History"
        description="Are you sure you want to delete your all conversation history? This action cannot be undone."
        @accept="onDeleteConversation"
        @cancel="isDeleteHistoryModalOpen = false"
      />
    </v-modal>

    <v-modal v-model="isDeleteAccountModalOpen">
      <TheConfirmation
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        @accept="onDeleteAccount"
        @cancel="isDeleteAccountModalOpen = false"
      />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { communicationReviewStore, userStore } from "@/app"
import { computed, ref, defineComponent, reactive } from "vue"
import TheConfirmation from "../../../TheConfirmation"
import CountryList from "@/shared/json_data/countries.json"
import LanguagesList from "@/shared/json_data/languages.json"
import { deleteAllHistoryHandler } from "@/shared/api"

export default defineComponent({
  components: {
    TheConfirmation,
  },

  setup(_, { emit }) {
    const errorMessages = ref<Record<string, string>>({})
    const countryOptions = CountryList.map(({ name, alpha_2 }) => ({
      name,
      alpha_2,
    }))
    const languageOptions = LanguagesList.map(({ language, language_iso }) => ({
      language,
      language_iso,
    }))
    const isDeleteHistoryModalOpen = ref<boolean>(false)
    const isDeleteAccountModalOpen = ref<boolean>(false)

    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const isChanged = computed(() => {
      const user = getCurrentUser.value
      if (!user) return false

      return form.first_name !== user.first_name || form.last_name !== user.last_name || form.country !== user.country || form.explanation_language !== user.explanation_language
    })

    const form = reactive({
      first_name: getCurrentUser.value?.first_name || "",
      last_name: getCurrentUser.value?.last_name || "",
      country: getCurrentUser.value?.country || "",
      explanation_language: getCurrentUser.value?.explanation_language || "",
    })

    const onSubmit = async () => {
      if (!isChanged.value) return

      try {
        errorMessages.value = {}

        await userStore.fetchPatchUser(form)

        emit("close")
      } catch (error: any) {
        if (error.response?.status === 400 && error.response.data?.error?.fieldErrors) {
          const fields = error.response.data.error.fieldErrors
          for (const key in fields) {
            errorMessages.value[key] = fields[key][0]
          }
        } else {
          errorMessages.value._global = "Something went wrong. Please try again later."
        }
      } finally {
        setTimeout(() => {
          errorMessages.value = {}
        }, 3000)
      }
    }

    const onDeleteConversation = async () => {
      try {
        await deleteAllHistoryHandler()

        communicationReviewStore.setReviewList([])
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isDeleteHistoryModalOpen.value = false
      }
    }

    const onDeleteAccount = () => {
      try {
        // TODO
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isDeleteAccountModalOpen.value = false
      }
    }

    return {
      form,
      isChanged,
      isDeleteHistoryModalOpen,
      isDeleteAccountModalOpen,
      errorMessages,
      countryOptions,
      languageOptions,
      getCurrentUser,
      onDeleteConversation,
      onDeleteAccount,
      onSubmit,
    }
  },
})
</script>
