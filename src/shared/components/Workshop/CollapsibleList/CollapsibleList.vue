<template>
  <div class="space-y-4">
    <!-- Goals -->
    <details class="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm" open>
      <summary class="flex cursor-pointer list-none items-center justify-between">
        <div class="font-medium">Goals</div>
        <i class="fa-solid fa-chevron-down h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"></i>
      </summary>

      <div class="mt-4 space-y-4">
        <div v-for="(goal, gi) in userGoals" :key="gi" class="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              :value="goal.phrase"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
              placeholder="Goal phrase"
              @input="($event) => updateGoalPhrase(gi, ($event.target as HTMLInputElement).value)"
            />
            <input
              :value="goal.translation"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
              placeholder="Translation"
              @input="($event) => updateGoalTranslation(gi, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="mt-3 flex justify-end">
            <button
              class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeGoal(gi)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove
            </button>
          </div>
        </div>

        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addGoal"
        >
          <i class="fa-solid fa-plus"></i>
          Add goal
        </button>
      </div>
    </details>

    <!-- Dictionary -->
    <details class="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm" open>
      <summary class="flex cursor-pointer list-none items-center justify-between">
        <div class="font-medium">Dictionary</div>
        <i class="fa-solid fa-chevron-down h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"></i>
      </summary>

      <div class="mt-4 space-y-3">
        <div v-for="(d, di) in userDictionary" :key="di" class="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-6">
            <input
              :value="d.word"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Word"
              @input="($event) => updateDictWord(di, ($event.target as HTMLInputElement).value)"
            />
            <input
              :value="d.meaning"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Meaning"
              @input="($event) => updateDictMeaning(di, ($event.target as HTMLInputElement).value)"
            />
            <input
              :value="d.translation"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Translation"
              @input="($event) => updateDictTranslation(di, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="mt-3 flex justify-end">
            <button
              class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeDictItem(di)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove
            </button>
          </div>
        </div>

        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addDictItem"
        >
          <i class="fa-solid fa-plus"></i>
          Add word
        </button>
      </div>
    </details>

    <!-- Useful phrases -->
    <details class="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm" open>
      <summary class="flex cursor-pointer list-none items-center justify-between">
        <div class="font-medium">Useful phrases</div>
        <i class="fa-solid fa-chevron-down h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"></i>
      </summary>

      <div class="mt-4 space-y-3">
        <div v-for="(u, ui) in userPhrases" :key="ui" class="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-6">
            <input
              :value="u.phrase"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Phrase"
              @input="($event) => updatePhrase(ui, 'phrase', ($event.target as HTMLInputElement).value)"
            />
            <input
              :value="u.meaning"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Meaning"
              @input="($event) => updatePhrase(ui, 'meaning', ($event.target as HTMLInputElement).value)"
            />
            <input
              :value="u.translation"
              class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition md:col-span-2"
              placeholder="Translation"
              @input="($event) => updatePhraseTranslation(ui, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="mt-3 flex justify-end">
            <button
              class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeUsefulPhrase(ui)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove
            </button>
          </div>
        </div>

        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addUsefulPhrase"
        >
          <i class="fa-solid fa-plus"></i>
          Add phrase
        </button>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { IDictionaryEntry, IPhraseEntry, IPromptGoal } from "@/shared/types"

export default defineComponent({
  name: "WorkshopCollapsibleList",

  props: {
    userGoals: { type: Array as () => IPromptGoal[], required: true },
    userDictionary: { type: Array as () => IDictionaryEntry[], required: true },
    userPhrases: { type: Array as () => IPhraseEntry[], required: true },
  },

  setup(props, { emit }) {
    // GOALS
    const updateGoalPhrase = (i: number, val: string) => {
      const copy = [...props.userGoals]
      copy[i] = { ...copy[i], phrase: val }
      emit("update:userGoals", copy)
    }

    const addGoal = () => {
      emit("update:userGoals", [...props.userGoals, { phrase: "", translation: "" }])
    }

    const removeGoal = (i: number) => {
      const copy = props.userGoals.filter((_, idx) => idx !== i)
      emit("update:userGoals", copy)
    }

    const updateGoalTranslation = (i: number, val: string) => {
      const copy = [...props.userGoals]
      copy[i] = { ...copy[i], translation: val }
      emit("update:userGoals", copy)
    }

    // DICTIONARY
    const updateDictWord = (i: number, val: string) => {
      const copy = [...props.userDictionary]
      copy[i] = { ...copy[i], word: val }
      emit("update:userDictionary", copy)
    }

    const updateDictMeaning = (i: number, val: string) => {
      const copy = [...props.userDictionary]
      copy[i] = { ...copy[i], meaning: val }
      emit("update:userDictionary", copy)
    }

    const updateDictTranslation = (i: number, val: string) => {
      const copy = [...props.userDictionary]
      copy[i] = { ...copy[i], translation: val }
      emit("update:userDictionary", copy)
    }

    const addDictItem = () => {
      emit("update:userDictionary", [...props.userDictionary, { word: "", meaning: "", translation: "" }])
    }

    const removeDictItem = (i: number) => {
      const copy = props.userDictionary.filter((_, idx) => idx !== i)
      emit("update:userDictionary", copy)
    }

    // PHRASES
    const updatePhrase = (i: number, field: "phrase" | "meaning", val: string) => {
      const copy = [...props.userPhrases]
      copy[i] = { ...copy[i], [field]: val }
      emit("update:userPhrases", copy)
    }

    const updatePhraseTranslation = (i: number, val: string) => {
      const copy = [...props.userPhrases]
      copy[i] = { ...copy[i], translation: val }
      emit("update:userPhrases", copy)
    }

    const addUsefulPhrase = () => {
      emit("update:userPhrases", [...props.userPhrases, { phrase: "", meaning: "", translation: "" }])
    }

    const removeUsefulPhrase = (i: number) => {
      const copy = props.userPhrases.filter((_, idx) => idx !== i)
      emit("update:userPhrases", copy)
    }

    return {
      updateGoalPhrase,
      addGoal,
      removeGoal,
      updateGoalTranslation,
      updateDictWord,
      updateDictMeaning,
      updateDictTranslation,
      addDictItem,
      removeDictItem,
      updatePhrase,
      updatePhraseTranslation,
      addUsefulPhrase,
      removeUsefulPhrase,
    }
  },
})
</script>
