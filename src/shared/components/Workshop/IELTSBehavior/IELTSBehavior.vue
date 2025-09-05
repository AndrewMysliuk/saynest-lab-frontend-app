<template>
  <div class="mt-6">
    <!-- Tabs -->
    <div class="mb-3 flex gap-2">
      <button
        :class="[
          'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
          activePart === 'part1' ? 'bg-indigo-50 text-indigo-600 border-indigo-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400',
          hasP1Errors ? 'border-red-400 text-red-700' : '',
        ]"
        @click="activePart = 'part1'"
      >
        Part 1
      </button>

      <button
        :class="[
          'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
          activePart === 'part2' ? 'bg-indigo-50 text-indigo-600 border-indigo-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400',
          hasP2Errors ? 'border-red-400 text-red-700' : '',
        ]"
        @click="activePart = 'part2'"
      >
        Part 2
      </button>

      <button
        :class="[
          'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
          activePart === 'part3' ? 'bg-indigo-50 text-indigo-600 border-indigo-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400',
          hasP3Errors ? 'border-red-400 text-red-700' : '',
        ]"
        @click="activePart = 'part3'"
      >
        Part 3
      </button>
    </div>

    <!-- Part 1 -->
    <div v-if="activePart === 'part1'" class="space-y-4">
      <div class="flex items-end justify-between text-sm">
        <span class="text-sm font-medium text-gray-700">Topic (everyday theme)</span>
        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addTopic('part1')"
        >
          <i class="fa-solid fa-plus"></i>
          Add topic
        </button>
      </div>

      <p v-if="errors?.part1?.topicsGeneral" class="text-sm text-red-600">
        {{ errors.part1.topicsGeneral }}
      </p>

      <div
        v-for="(t, ti) in ielts.part1.topics"
        :key="'p1-' + ti"
        class="rounded-lg bg-gray-50 p-3 ring-1"
        :class="{
          'ring-gray-200': !errors?.part1?.topics?.[ti],
          'ring-red-300': !!errors?.part1?.topics?.[ti],
        }"
      >
        <div class="flex items-end gap-2">
          <TextField
            class="flex-1"
            :model-value="t.title"
            @update:model-value="(value: string) => setTopicTitle('part1', ti, value)"
            label="Topic title"
            placeholder="e.g. Work and Studies"
            :error="errors?.part1?.topics?.[ti]?.title || ''"
          />

          <button
            v-if="ti > 0"
            class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
            @click="removeTopic('part1', ti)"
          >
            <i class="fa-solid fa-xmark"></i>
            Remove topic
          </button>
        </div>

        <div class="mt-3 space-y-3">
          <p v-if="errors?.part1?.topics?.[ti]?.questionsGeneral" class="text-sm text-red-600">
            {{ errors.part1.topics[ti].questionsGeneral }}
          </p>

          <div
            v-for="(q, qi) in t.questions"
            :key="'p1q-' + ti + '-' + qi"
            class="mt-1 flex items-end gap-2 rounded-md"
            :class="{
              'ring-1 ring-[#4F46E5]': isDragOver('p1q', ti, qi),
              'opacity-80': isDraggingFrom('p1q', ti, qi),
            }"
            :draggable="isHandleActive('p1q', ti, qi)"
            @dragstart="onDragStart($event, 'p1q', ti, qi)"
            @dragover="onDragOver($event, 'p1q', ti, qi)"
            @drop="onDrop($event, 'p1q', ti, qi)"
            @dragend="onDragEnd"
          >
            <!-- drag handle -->
            <button
              type="button"
              class="drag-handle h-[38px] px-2 shrink-0 inline-flex items-center justify-center rounded-md ring-1 ring-gray-200 transition hover:bg-white cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
              title="Hold and drag to reorder"
              tabindex="-1"
              @mousedown="enableHandle('p1q', ti, qi)"
              @mouseup="disableHandle"
              @mouseleave="disableHandle"
            >
              <i class="fa-solid fa-grip-vertical"></i>
            </button>

            <TextField
              class="flex-1"
              :model-value="q"
              @update:model-value="(value: string) => setQuestion('part1', ti, qi, value)"
              label="Question"
              placeholder="e.g. Do you work or are you a student?"
              :error="errors?.part1?.topics?.[ti]?.questions?.[qi] || ''"
            />

            <button
              v-if="qi > 0"
              class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeQuestion('part1', ti, qi)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove question
            </button>
          </div>

          <button
            class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
            @click="addQuestion('part1', ti)"
          >
            <i class="fa-solid fa-plus"></i>
            Add question
          </button>
        </div>
      </div>
    </div>

    <!-- Part 2 -->
    <div v-else-if="activePart === 'part2'" class="space-y-3">
      <TextField :model-value="ielts.part2.title" @update:model-value="onPart2Title" label="Theme (card title)" placeholder="e.g. Describe an ambition you have" :error="errors?.part2?.title || ''" />
      <TextField
        :model-value="ielts.part2.question"
        @update:model-value="onPart2Question"
        label="Task prompt (the full card text)"
        placeholder="e.g. Describe an ambition you have that is important to you."
        :error="errors?.part2?.question || ''"
      />

      <div class="space-y-3">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">You should say (3–5 points)</span>
          </div>

          <p v-if="errors?.part2?.bulletsGeneral" class="text-sm text-red-600">
            {{ errors.part2.bulletsGeneral }}
          </p>

          <div
            v-for="(b, bi) in ielts.part2.bullet_points"
            :key="'p2b-' + bi"
            class="mt-1 flex items-end gap-2 rounded-md"
            :class="{
              'ring-1 ring-[#4F46E5]': isDragOver('p2b', null, bi),
              'opacity-80': isDraggingFrom('p2b', null, bi),
            }"
            :draggable="isHandleActive('p2b', null, bi)"
            @dragstart="onDragStart($event, 'p2b', null, bi)"
            @dragover="onDragOver($event, 'p2b', null, bi)"
            @drop="onDrop($event, 'p2b', null, bi)"
            @dragend="onDragEnd"
          >
            <!-- drag handle -->
            <button
              type="button"
              class="drag-handle h-[38px] px-2 shrink-0 inline-flex items-center justify-center rounded-md ring-1 ring-gray-200 transition hover:bg-white cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
              title="Hold and drag to reorder"
              tabindex="-1"
              @mousedown="enableHandle('p2b', null, bi)"
              @mouseup="disableHandle"
              @mouseleave="disableHandle"
            >
              <i class="fa-solid fa-grip-vertical"></i>
            </button>

            <TextField
              class="flex-1"
              :model-value="b"
              @update:model-value="(value: string) => setBullet(bi, value)"
              placeholder="e.g. what the ambition is"
              :error="errors?.part2?.bullet_points?.[bi] || ''"
            />

            <button
              v-if="bi > 0"
              class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeBullet(bi)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove point
            </button>
          </div>
        </div>

        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addBullet"
          :disabled="ielts.part2.bullet_points.length >= 5"
        >
          <i class="fa-solid fa-plus"></i>
          Add point
        </button>
      </div>
    </div>

    <!-- Part 3 -->
    <div v-else class="space-y-4">
      <div class="flex items-end justify-between text-sm">
        <span class="text-sm font-medium text-gray-700">Topic (discussion theme)</span>
        <button
          class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          @click="addTopic('part3')"
        >
          <i class="fa-solid fa-plus"></i>
          Add topic
        </button>
      </div>

      <p v-if="errors?.part3?.topicsGeneral" class="text-sm text-red-600">
        {{ errors.part3.topicsGeneral }}
      </p>

      <div
        v-for="(t, ti) in ielts.part3.topics"
        :key="'p3-' + ti"
        class="rounded-lg bg-gray-50 p-3 ring-1"
        :class="{
          'ring-gray-200': !errors?.part3?.topics?.[ti],
          'ring-red-300': !!errors?.part3?.topics?.[ti],
        }"
      >
        <div class="flex items-end gap-2">
          <TextField
            class="flex-1"
            :model-value="t.title"
            @update:model-value="(value: string) => setTopicTitle('part3', ti, value)"
            label="Topic title"
            placeholder="e.g. Ambitions and Goals"
            :error="errors?.part3?.topics?.[ti]?.title || ''"
          />

          <button
            v-if="ti > 0"
            class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
            @click="removeTopic('part3', ti)"
          >
            <i class="fa-solid fa-xmark"></i>
            Remove topic
          </button>
        </div>

        <div class="mt-3 space-y-3">
          <p v-if="errors?.part3?.topics?.[ti]?.questionsGeneral" class="text-sm text-red-600">
            {{ errors.part3.topics[ti].questionsGeneral }}
          </p>

          <div
            v-for="(q, qi) in t.questions"
            :key="'p3q-' + ti + '-' + qi"
            class="mt-1 flex items-end gap-2 rounded-md"
            :class="{
              'ring-1 ring-[#4F46E5]': isDragOver('p3q', ti, qi),
              'opacity-80': isDraggingFrom('p3q', ti, qi),
            }"
            :draggable="isHandleActive('p3q', ti, qi)"
            @dragstart="onDragStart($event, 'p3q', ti, qi)"
            @dragover="onDragOver($event, 'p3q', ti, qi)"
            @drop="onDrop($event, 'p3q', ti, qi)"
            @dragend="onDragEnd"
          >
            <!-- drag handle -->
            <button
              type="button"
              class="drag-handle h-[38px] px-2 shrink-0 inline-flex items-center justify-center rounded-md ring-1 ring-gray-200 transition hover:bg-white cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
              title="Hold and drag to reorder"
              tabindex="-1"
              @mousedown="enableHandle('p3q', ti, qi)"
              @mouseup="disableHandle"
              @mouseleave="disableHandle"
            >
              <i class="fa-solid fa-grip-vertical"></i>
            </button>

            <TextField
              class="flex-1"
              label="Question (abstract question)"
              :model-value="q"
              @update:model-value="(value: string) => setQuestion('part3', ti, qi, value)"
              placeholder="e.g. Why do people set goals in life?"
              :error="errors?.part3?.topics?.[ti]?.questions?.[qi] || ''"
            />

            <button
              v-if="qi > 0"
              class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="removeQuestion('part3', ti, qi)"
            >
              <i class="fa-solid fa-xmark"></i>
              Remove question
            </button>
          </div>

          <button
            class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
            @click="addQuestion('part3', ti)"
          >
            <i class="fa-solid fa-plus"></i>
            Add question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { IIELTSScenarioDetails } from "@/shared/types"
import { IIELTSBehaviorErrors } from "@/shared/validation"
import TextField from "../TextField"

type P13 = "part1" | "part3"
type DragListKey = "p1q" | "p3q" | "p2b"

export default defineComponent({
  name: "WorkshopIELTSBehavior",

  components: { TextField },

  props: {
    modelValue: { type: Object as () => IIELTSScenarioDetails, required: true },
    initialPart: { type: String as () => "part1" | "part2" | "part3", default: "part1" },
    isDisabled: { type: Boolean, default: false },
    errors: { type: Object as () => IIELTSBehaviorErrors, default: () => ({}) },
  },

  setup(props, { emit }) {
    const activePart = ref<"part1" | "part2" | "part3">(props.initialPart)
    const ielts = computed(() => props.modelValue)
    const hasP1Errors = computed(() => {
      const e = props.errors?.part1
      if (!e) return false
      if (e.topicsGeneral) return true
      return (e.topics ?? []).some((t) => !!(t?.title || t?.questionsGeneral || (t?.questions ?? []).some(Boolean)))
    })

    const hasP2Errors = computed(() => {
      const e = props.errors?.part2
      if (!e) return false
      return !!(e.title || e.question || e.bulletsGeneral || (e.bullet_points ?? []).some(Boolean))
    })

    const hasP3Errors = computed(() => {
      const e = props.errors?.part3
      if (!e) return false
      if (e.topicsGeneral) return true
      return (e.topics ?? []).some((t) => !!(t?.title || t?.questionsGeneral || (t?.questions ?? []).some(Boolean)))
    })

    const commit = (next: IIELTSScenarioDetails) => {
      emit("update:modelValue", next)
      emit("change", next)
    }

    // --- CRUD
    const addTopic = (part: P13) => {
      const nextTopics = [...ielts.value[part].topics, { title: "", questions: [""] as string[] }]
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const removeTopic = (part: P13, ti: number) => {
      const nextTopics = ielts.value[part].topics.slice()
      nextTopics.splice(ti, 1)
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const setTopicTitle = (part: P13, ti: number, title: string) => {
      const nextTopics = ielts.value[part].topics.slice()
      const topic = { ...nextTopics[ti], title }
      nextTopics.splice(ti, 1, topic)
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const addQuestion = (part: P13, ti: number) => {
      const nextTopics = ielts.value[part].topics.slice()
      const t = { ...nextTopics[ti], questions: [...nextTopics[ti].questions, ""] }
      nextTopics.splice(ti, 1, t)
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const setQuestion = (part: P13, ti: number, qi: number, q: string) => {
      const nextTopics = ielts.value[part].topics.slice()
      const qs = nextTopics[ti].questions.slice()
      qs[qi] = q
      const t = { ...nextTopics[ti], questions: qs }
      nextTopics.splice(ti, 1, t)
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const removeQuestion = (part: P13, ti: number, qi: number) => {
      const nextTopics = ielts.value[part].topics.slice()
      const qs = nextTopics[ti].questions.slice()
      qs.splice(qi, 1)
      const t = { ...nextTopics[ti], questions: qs }
      nextTopics.splice(ti, 1, t)
      commit({ ...ielts.value, [part]: { topics: nextTopics } })
    }
    const onPart2Title = (val: string) => {
      commit({ ...ielts.value, part2: { ...ielts.value.part2, title: val } })
    }
    const onPart2Question = (val: string) => {
      commit({ ...ielts.value, part2: { ...ielts.value.part2, question: val } })
    }
    const addBullet = () => {
      const bullets = ielts.value.part2.bullet_points
      if (bullets.length >= 5) return
      commit({ ...ielts.value, part2: { ...ielts.value.part2, bullet_points: [...bullets, ""] } })
    }
    const setBullet = (bi: number, val: string) => {
      const bullets = ielts.value.part2.bullet_points.slice()
      bullets[bi] = val
      commit({ ...ielts.value, part2: { ...ielts.value.part2, bullet_points: bullets } })
    }
    const removeBullet = (bi: number) => {
      const bullets = ielts.value.part2.bullet_points.slice()
      bullets.splice(bi, 1)
      commit({ ...ielts.value, part2: { ...ielts.value.part2, bullet_points: bullets } })
    }

    // --- DnD (кастом)
    const dragHandle = ref<{ list: DragListKey; ti: number | null; index: number } | null>(null)
    const dragFrom = ref<{ list: DragListKey; ti: number | null; index: number } | null>(null)
    const dragOver = ref<{ list: DragListKey; ti: number | null; index: number } | null>(null)

    const enableHandle = (list: DragListKey, ti: number | null, index: number) => {
      dragHandle.value = { list, ti, index }
    }
    const disableHandle = () => {
      dragHandle.value = null
    }
    const isHandleActive = (list: DragListKey, ti: number | null, index: number) => {
      const h = dragHandle.value
      return !!h && h.list === list && h.index === index && h.ti === ti
    }
    const isDraggingFrom = (list: DragListKey, ti: number | null, index: number) => {
      const f = dragFrom.value
      return !!f && f.list === list && f.index === index && f.ti === ti
    }
    const isDragOver = (list: DragListKey, ti: number | null, index: number) => {
      const o = dragOver.value
      return !!o && o.list === list && o.index === index && o.ti === ti
    }

    const onDragStart = (e: DragEvent, list: DragListKey, ti: number | null, index: number) => {
      if (!isHandleActive(list, ti, index)) {
        e.preventDefault()
        return
      }
      dragFrom.value = { list, ti, index }
      dragOver.value = { list, ti, index }
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", `${list}:${ti ?? -1}:${index}`)
      }
    }

    const onDragOver = (e: DragEvent, list: DragListKey, ti: number | null, index: number) => {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
      dragOver.value = { list, ti, index }
    }

    const onDrop = (e: DragEvent, list: DragListKey, ti: number | null, index: number) => {
      e.preventDefault()
      const from = dragFrom.value
      if (!from || from.list !== list || (from.ti ?? null) !== (ti ?? null)) {
        resetDnD()
        return
      }
      // Перестановка
      if (list === "p2b") {
        const arr = ielts.value.part2.bullet_points.slice()
        const [moved] = arr.splice(from.index, 1)
        arr.splice(index, 0, moved)
        commit({ ...ielts.value, part2: { ...ielts.value.part2, bullet_points: arr } })
      } else if (list === "p1q") {
        const topics = ielts.value.part1.topics.slice()
        const qs = topics[ti!].questions.slice()
        const [moved] = qs.splice(from.index, 1)
        qs.splice(index, 0, moved)
        topics.splice(ti!, 1, { ...topics[ti!], questions: qs })
        commit({ ...ielts.value, part1: { topics } })
      } else if (list === "p3q") {
        const topics = ielts.value.part3.topics.slice()
        const qs = topics[ti!].questions.slice()
        const [moved] = qs.splice(from.index, 1)
        qs.splice(index, 0, moved)
        topics.splice(ti!, 1, { ...topics[ti!], questions: qs })
        commit({ ...ielts.value, part3: { topics } })
      }
      resetDnD()
    }

    const onDragEnd = () => resetDnD()

    const resetDnD = () => {
      dragHandle.value = null
      dragFrom.value = null
      dragOver.value = null
    }

    return {
      activePart,
      ielts,
      hasP1Errors,
      hasP2Errors,
      hasP3Errors,
      // CRUD
      addTopic,
      removeTopic,
      setTopicTitle,
      addQuestion,
      setQuestion,
      removeQuestion,
      onPart2Title,
      onPart2Question,
      addBullet,
      setBullet,
      removeBullet,
      // DnD
      enableHandle,
      disableHandle,
      isHandleActive,
      isDraggingFrom,
      isDragOver,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
    }
  },
})
</script>
