<template>
  <section class="max-w-4xl rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Scenario Content</h2>
        <p class="text-sm text-slate-500 mt-2">User content and scenario behavior</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Interactive</span>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="space-y-4">
        <WorkshopCollapsibleList
          :user-goals="getScenarioContent.user_goals"
          :user-dictionary="getScenarioContent.user_dictionary"
          :user-phrases="getScenarioContent.user_phrases"
          @update:user-goals="updateUserGoals"
          @update:user-dictionary="updateUserDictionary"
          @update:user-phrases="updateUserPhrases"
        />
      </div>

      <!-- <div class="space-y-4">
        <div v-if="isDialog" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-medium">Dialog behavior</h3>
            <span class="rounded-md bg-lavender px-2 py-0.5 text-xs font-medium text-primary">Type: Dialog</span>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <input v-model="state.dialog.setting" class="input" placeholder="Setting (e.g. Paris cafe)" />
            <textarea v-model="state.dialog.situation" class="textarea" rows="3" placeholder="Situation details" />
            <input v-model="state.dialog.goal" class="input" placeholder="Goal (e.g. order a cappuccino)" />
          </div>
          <div class="mt-4">
            <div class="mb-2 text-sm font-medium">Steps</div>
            <div class="space-y-3">
              <div v-for="(s, si) in state.dialog.steps" :key="si" class="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
                <div class="grid grid-cols-1 gap-2 md:grid-cols-6">
                  <select v-model="s.role" class="select md:col-span-1">
                    <option value="user">User</option>
                    <option value="ai">AI</option>
                  </select>
                  <textarea v-model="s.message" class="textarea md:col-span-4" rows="3" placeholder="Message" />
                  <label class="md:col-span-1 flex items-center gap-2">
                    <input class="accent-primary" type="checkbox" v-model="s.waitForResponse" />
                    <span class="text-sm">Wait</span>
                  </label>
                </div>
                <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-6">
                  <input v-model="s.hint" class="input md:col-span-3" placeholder="Optional hint" />
                  <div class="md:col-span-3">
                    <div class="flex items-center justify-between text-sm">
                      <span>Choices (optional)</span>
                      <button class="btn-link" @click="addChoice(si)">Add choice</button>
                    </div>
                    <div v-for="(c, ci) in s.choices" :key="ci" class="mt-1 flex items-center gap-2">
                      <input v-model="s.choices[ci]" class="input" placeholder="Choice" />
                      <button class="btn-link text-red-600" @click="removeChoice(si, ci)">Remove</button>
                    </div>
                  </div>
                </div>
                <div class="mt-2 flex justify-end">
                  <button class="btn-danger" @click="removeStep(si)">Remove step</button>
                </div>
              </div>
              <button class="btn-primary" @click="addStep">Add step</button>
            </div>
          </div>
        </div>

        <div v-else class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-medium">IELTS structure</h3>
            <span class="rounded-md bg-lavender px-2 py-0.5 text-xs font-medium text-primary">Type: IELTS</span>
          </div>
          <div>
            <div class="mb-3 flex gap-2">
              <button :class="['tab', activeIELTSPart === 'part1' ? 'tab-active' : '']" @click="activeIELTSPart = 'part1'">Part 1</button>
              <button :class="['tab', activeIELTSPart === 'part2' ? 'tab-active' : '']" @click="activeIELTSPart = 'part2'">Part 2</button>
              <button :class="['tab', activeIELTSPart === 'part3' ? 'tab-active' : '']" @click="activeIELTSPart = 'part3'">Part 3</button>
            </div>
            <div v-if="activeIELTSPart === 'part1'" class="space-y-3">
              <input v-model="state.ielts.part1.topic" class="input" placeholder="Topic" />
              <div>
                <div class="mb-1 flex items-center justify-between text-sm">
                  <span>Questions</span>
                  <button class="btn-link" @click="addPartQuestion('part1')">Add question</button>
                </div>
                <div v-for="(q, qi) in state.ielts.part1.questions" :key="qi" class="mt-1 flex items-center gap-2">
                  <input v-model="state.ielts.part1.questions[qi]" class="input" placeholder="Question" />
                  <button class="btn-link text-red-600" @click="removePartQuestion('part1', qi)">Remove</button>
                </div>
              </div>
            </div>
            <div v-else-if="activeIELTSPart === 'part2'" class="space-y-3">
              <input v-model="state.ielts.part2.title" class="input" placeholder="Title" />
              <input v-model="state.ielts.part2.mainQuestion" class="input" placeholder="Main question" />
              <div>
                <div class="mb-1 flex items-center justify-between text-sm">
                  <span>Bullet points (3–5)</span>
                  <button class="btn-link" @click="addPart2Bullet" :disabled="state.ielts.part2.bullets.length >= 5">Add bullet</button>
                </div>
                <div v-for="(b, bi) in state.ielts.part2.bullets" :key="bi" class="mt-1 flex items-center gap-2">
                  <input v-model="state.ielts.part2.bullets[bi]" class="input" placeholder="Bullet point" />
                  <button class="btn-link text-red-600" @click="removePart2Bullet(bi)">Remove</button>
                </div>
              </div>
            </div>
            <div v-else class="space-y-3">
              <input v-model="state.ielts.part3.topic" class="input" placeholder="Topic" />
              <div>
                <div class="mb-1 flex items-center justify-between text-sm">
                  <span>Abstract questions</span>
                  <button class="btn-link" @click="addPartQuestion('part3')">Add question</button>
                </div>
                <div v-for="(q, qi) in state.ielts.part3.questions" :key="qi" class="mt-1 flex items-center gap-2">
                  <input v-model="state.ielts.part3.questions[qi]" class="input" placeholder="Question" />
                  <button class="btn-link text-red-600" @click="removePartQuestion('part3', qi)">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { workshopStore } from "@/app"
import { WorkshopCollapsibleList } from "@/shared/components"
import { IDictionaryEntry, IPhraseEntry, IPromptGoal } from "@/shared/types"

export default defineComponent({
  components: {
    WorkshopCollapsibleList,
  },

  setup() {
    const getScenarioContent = computed(() => workshopStore.getScenarioContent)

    const updateUserGoals = (value: IPromptGoal[]) => {
      workshopStore.setScenarioContent({
        user_goals: value,
      })
    }

    const updateUserDictionary = (value: IDictionaryEntry[]) => {
      workshopStore.setScenarioContent({
        user_dictionary: value,
      })
    }

    const updateUserPhrases = (value: IPhraseEntry[]) => {
      workshopStore.setScenarioContent({
        user_phrases: value,
      })
    }

    return {
      getScenarioContent,
      updateUserGoals,
      updateUserDictionary,
      updateUserPhrases,
    }
  },
})
</script>
