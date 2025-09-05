<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Scenario Content</h2>
        <p class="text-sm text-slate-500 mt-2">User content and scenario behavior</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Model Settings</span>
    </div>

    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="space-y-4">
        <WorkshopCollapsibleList
          :user-goals="localContent.user_goals"
          :user-dictionary="localContent.user_dictionary"
          :user-phrases="localContent.user_phrases"
          :goals-error="goalsError"
          :dict-error="dictError"
          :phrases-error="phrasesError"
          @update:user-goals="(val) => (localContent.user_goals = val)"
          @update:user-dictionary="(val) => (localContent.user_dictionary = val)"
          @update:user-phrases="(val) => (localContent.user_phrases = val)"
        />
      </div>

      <div class="space-y-4">
        <div v-if="isDialog" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium">Dialog behavior</h3>
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Type: Dialog</span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <WorkshopTextField
              :model-value="localContent.dialog_behavior.setting"
              @update:model-value="(value: string) => ((localContent.dialog_behavior.setting = value), (settingError = ''))"
              label="Describe Dialog Location"
              placeholder="e.g. Hotel reception"
              is-required
              :error="settingError"
            />
            <WorkshopTextField
              :model-value="localContent.dialog_behavior.situation"
              @update:model-value="(value: string) => ((localContent.dialog_behavior.situation = value), (situationError = ''))"
              label="Describe Model Role"
              placeholder="e.g. You are a hotel receptionist"
              is-required
              :error="situationError"
            />
            <WorkshopTextField
              :model-value="localContent.dialog_behavior.goal"
              @update:model-value="(value: string) => ((localContent.dialog_behavior.goal = value), (goalError = ''))"
              label="Describe Model Goal"
              placeholder="e.g. Simulate a full hotel check-in experience"
              is-required
              :error="goalError"
            />
          </div>

          <WorkshopDialogSteps
            :model-value="localContent.dialog_behavior.steps"
            @update:model-value="(value: string[]) => ((localContent.dialog_behavior.steps = value), (stepsGeneralError = ''), (stepsErrors = []))"
            :min-items="1"
            :errors="stepsErrors"
            :error="stepsGeneralError"
          />
        </div>

        <div v-else class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium">IELTS structure</h3>
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Type: IELTS</span>
          </div>

          <WorkshopIELTSBehavior
            :model-value="localContent.ielts_behavior"
            @update:model-value="(value: IIELTSScenarioDetails) => ((localContent.ielts_behavior = value), (ieltsErrors = {}))"
            :errors="ieltsErrors"
          />
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
import { defineComponent, computed, ref } from "vue"
import { workshopStore } from "@/app"
import { WorkshopCollapsibleList, WorkshopTextField, WorkshopDialogSteps, WorkshopIELTSBehavior } from "@/shared/components"
import { IIELTSScenarioDetails, IWorkshopScenarioContent, WorkshopScenarioTypeEnum } from "@/shared/types"
import { DEFAULT_WORKSHOP_SCENARIO_CONTENT } from "@/shared/lib"
import { DialogBehaviorSchema, IeltsBehaviorSchema, IIELTSBehaviorErrors, validatePartial, WorkshopScenarioContentSchema } from "@/shared/validation"

export default defineComponent({
  name: "ScenarioContentSection",
  components: {
    WorkshopCollapsibleList,
    WorkshopTextField,
    WorkshopDialogSteps,
    WorkshopIELTSBehavior,
  },
  setup() {
    const isDialog = computed(() => workshopStore.getBasicInformation?.scenario_type === WorkshopScenarioTypeEnum.DIALOG)

    const localContent = ref<IWorkshopScenarioContent>({
      ...DEFAULT_WORKSHOP_SCENARIO_CONTENT,
      ...workshopStore.getScenarioContent,
    })
    const goalsError = ref<string>("")
    const dictError = ref<string>("")
    const phrasesError = ref<string>("")
    const settingError = ref<string>("")
    const situationError = ref<string>("")
    const goalError = ref<string>("")
    const stepsErrors = ref<string[]>([])
    const stepsGeneralError = ref<string>("")
    const ieltsErrors = ref<IIELTSBehaviorErrors>({})
    const isSubmitting = ref(false)

    const validateIELTS = () => {
      ieltsErrors.value = {}

      const payload = {
        setting: (localContent.value.ielts_behavior.setting ?? "").trim(),
        part1: {
          topics: (localContent.value.ielts_behavior.part1.topics ?? []).map((t) => ({
            title: (t.title ?? "").trim(),
            questions: (t.questions ?? []).map((q) => (q ?? "").trim()),
          })),
        },
        part2: {
          title: (localContent.value.ielts_behavior.part2.title ?? "").trim(),
          question: (localContent.value.ielts_behavior.part2.question ?? "").trim(),
          bullet_points: (localContent.value.ielts_behavior.part2.bullet_points ?? []).map((b) => (b ?? "").trim()),
        },
        part3: {
          topics: (localContent.value.ielts_behavior.part3.topics ?? []).map((t) => ({
            title: (t.title ?? "").trim(),
            questions: (t.questions ?? []).map((q) => (q ?? "").trim()),
          })),
        },
      }

      const r = IeltsBehaviorSchema.safeParse(payload)
      if (r.success) {
        Object.assign(localContent.value.ielts_behavior, r.data)
        return true
      }

      const errs: IIELTSBehaviorErrors = {}
      for (const issue of r.error.issues) {
        const p = issue.path
        // setting
        if (p[0] === "setting") {
          errs.setting = issue.message
          continue
        }
        // part1
        if (p[0] === "part1" && p[1] === "topics") {
          if (typeof p[2] === "number") {
            const ti = p[2] as number
            errs.part1 ??= {}
            errs.part1.topics ??= []
            errs.part1.topics[ti] ??= {}
            if (p[3] === "title") {
              errs.part1.topics[ti]!.title = issue.message
            } else if (p[3] === "questions") {
              if (typeof p[4] === "number") {
                const qi = p[4] as number
                errs.part1.topics[ti]!.questions ??= []
                errs.part1.topics[ti]!.questions![qi] = issue.message
              } else {
                errs.part1.topics[ti]!.questionsGeneral ??= issue.message
              }
            }
          } else {
            errs.part1 ??= {}
            errs.part1.topicsGeneral ??= issue.message
          }
          continue
        }
        // part2
        if (p[0] === "part2") {
          errs.part2 ??= {}
          if (p[1] === "title") errs.part2.title = issue.message
          else if (p[1] === "question") errs.part2.question = issue.message
          else if (p[1] === "bullet_points") {
            if (typeof p[2] === "number") {
              const bi = p[2] as number
              errs.part2.bullet_points ??= []
              errs.part2.bullet_points[bi] = issue.message
            } else {
              errs.part2.bulletsGeneral ??= issue.message
            }
          }
          continue
        }
        // part3
        if (p[0] === "part3" && p[1] === "topics") {
          if (typeof p[2] === "number") {
            const ti = p[2] as number
            errs.part3 ??= {}
            errs.part3.topics ??= []
            errs.part3.topics[ti] ??= {}
            if (p[3] === "title") {
              errs.part3.topics[ti]!.title = issue.message
            } else if (p[3] === "questions") {
              if (typeof p[4] === "number") {
                const qi = p[4] as number
                errs.part3.topics[ti]!.questions ??= []
                errs.part3.topics[ti]!.questions![qi] = issue.message
              } else {
                errs.part3.topics[ti]!.questionsGeneral ??= issue.message
              }
            }
          } else {
            errs.part3 ??= {}
            errs.part3.topicsGeneral ??= issue.message
          }
          continue
        }
      }
      ieltsErrors.value = errs
      return false
    }

    const onNext = () => {
      goalsError.value = dictError.value = phrasesError.value = ""
      settingError.value = situationError.value = goalError.value = stepsGeneralError.value = ""
      stepsErrors.value = []

      const rLists = validatePartial(WorkshopScenarioContentSchema, ["user_goals", "user_dictionary", "user_phrases"] as const, {
        user_goals: localContent.value.user_goals,
        user_dictionary: localContent.value.user_dictionary,
        user_phrases: localContent.value.user_phrases,
      })
      if (!rLists.ok) {
        goalsError.value = rLists.errors.user_goals ?? ""
        dictError.value = rLists.errors.user_dictionary ?? ""
        phrasesError.value = rLists.errors.user_phrases ?? ""
      }

      let rDialogOk = true
      if (isDialog.value) {
        const payload = {
          setting: (localContent.value.dialog_behavior.setting ?? "").trim(),
          situation: (localContent.value.dialog_behavior.situation ?? "").trim(),
          goal: (localContent.value.dialog_behavior.goal ?? "").trim(),
          steps: (localContent.value.dialog_behavior.steps ?? []).map((s) => s.trim()),
        }

        const rDialog = DialogBehaviorSchema.safeParse(payload)

        if (!rDialog.success) {
          const byPath = (name: string) => rDialog.error.issues.find((i) => i.path[0] === name)?.message ?? ""

          settingError.value = byPath("setting")
          situationError.value = byPath("situation")
          goalError.value = byPath("goal")

          const stepIssues = rDialog.error.issues.filter((i) => i.path[0] === "steps")

          const perIndex: string[] = []
          for (const issue of stepIssues) {
            if (typeof issue.path[1] === "number") {
              perIndex[issue.path[1]] = issue.message
            } else if (!stepsGeneralError.value) {
              stepsGeneralError.value = issue.message
            }
          }
          stepsErrors.value = perIndex
          return
        }

        Object.assign(localContent.value.dialog_behavior, rDialog.data)
      }

      if (!isDialog.value) {
        const ok = validateIELTS()
        if (!ok) return
      }

      if (!rLists.ok || !rDialogOk) return

      isSubmitting.value = true
      workshopStore.setScenarioContent({ ...localContent.value })
      isSubmitting.value = false

      alert("Validation Success")
    }

    return {
      isDialog,
      ieltsErrors,
      localContent,
      goalsError,
      dictError,
      phrasesError,
      settingError,
      situationError,
      goalError,
      stepsErrors,
      stepsGeneralError,
      isSubmitting,
      onNext,
    }
  },
})
</script>
