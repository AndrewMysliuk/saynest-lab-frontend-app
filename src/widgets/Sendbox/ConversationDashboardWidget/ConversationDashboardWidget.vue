<template>
  <div>
    <div>
      <div class="history --loader" v-if="!isReady">
        <div class="conversation__description">
          <span class="--pulse" />
          <p>Please Stand By...</p>
        </div>
      </div>

      <div class="dashboard" v-else-if="isModules">
        <div class="dashboard__header">
          <h1>Modules</h1>
        </div>

        <div class="dashboard__wrapper">
          <div class="dashboard__card" v-for="(prompt, index) in getModuleList" :key="index" @click="openScenarios(prompt.id)">
            <div class="dashboard__card-header">
              <h3 class="dashboard__card-title">
                {{ prompt.title }}
                <span class="dashboard__card-level"> ({{ prompt.level.join(", ") }}) </span>
              </h3>
            </div>

            <p class="dashboard__card-description">
              {{ prompt.description }}
            </p>

            <div class="dashboard__card-tags">
              <span class="dashboard__card-tag" v-for="tag in prompt.tags" :key="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard" v-else>
        <div class="dashboard__header">
          <h1>Scenarios</h1>
          <v-button label="Back to Modules" buttonStyle="action" @click="isModules = true" />
        </div>

        <div class="dashboard__wrapper">
          <div class="dashboard__scenario" v-for="(scenario, index) in getPromptList" :key="index" @click="selectPrompt(scenario)">
            <div class="dashboard__scenario-header">
              <h3 class="dashboard__scenario-title">
                {{ scenario.title }}
              </h3>
            </div>

            <p class="dashboard__scenario-description">
              {{ scenario.description }}
            </p>

            <div class="dashboard__scenario-meta">
              <span class="dashboard__scenario-meta-item"> <b>Module:</b> {{ scenario.module }} </span>
              <span class="dashboard__scenario-meta-item"> <b>Level:</b> {{ scenario.level }} </span>
            </div>

            <button class="dashboard__scenario-toggle" @click.prevent.stop="toggleExpand(index)">
              {{ expandedScenario === index ? "Hide Details" : "Show Details" }}
            </button>

            <div v-if="expandedScenario === index" class="dashboard__scenario-details">
              <div class="dashboard__scenario-section">
                <h4>Goals</h4>
                <ul class="dashboard__scenario-list">
                  <li v-for="goal in scenario.goals" :key="goal.phrase">
                    {{ goal.phrase }} — <i>{{ goal.translation }}</i>
                  </li>
                </ul>
              </div>

              <div class="dashboard__scenario-section">
                <h4>Dictionary</h4>
                <ul class="dashboard__scenario-list">
                  <li v-for="word in scenario.dictionary" :key="word.word">
                    <b>{{ word.word }}</b> ({{ word.translation }}) — {{ word.meaning }}
                  </li>
                </ul>
              </div>

              <div class="dashboard__scenario-section">
                <h4>Phrases</h4>
                <ul class="dashboard__scenario-list">
                  <li v-for="phrase in scenario.phrases" :key="phrase.phrase">
                    "{{ phrase.phrase }}" — <i>{{ phrase.translation }}</i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue"
import { promptStore } from "@/app"
import { useRouter } from "vue-router"
import { IPromptScenario } from "@/shared/types"

export default defineComponent({
  setup() {
    const router = useRouter()
    const isReady = ref<boolean>(false)
    const isModules = ref<boolean>(true)
    const expandedScenario = ref<number | null>(null)

    const getModuleList = computed(() => promptStore.getModuleList)
    const getPromptList = computed(() => promptStore.getPromptList)

    onBeforeMount(async () => {
      if (!getModuleList.value.length) {
        await setupOnloadMethods()
      }

      isReady.value = true
    })

    const setupOnloadMethods = async () => {
      try {
        await promptStore.fetchModuleList()
      } catch (error) {
        console.error("Error in setupOnloadMethods:", error)
      }
    }

    const toggleExpand = (index: number) => {
      expandedScenario.value = expandedScenario.value === index ? null : index
    }

    const openScenarios = async (module_id: string) => {
      try {
        await promptStore.fetchModuleScenarios(module_id)

        isModules.value = false
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const selectPrompt = (prompt: IPromptScenario) => {
      promptStore.setPrompt(prompt)

      router.push({ name: "sendbox.conversation" })
    }

    return {
      isReady,
      isModules,
      expandedScenario,
      getModuleList,
      getPromptList,
      toggleExpand,
      openScenarios,
      selectPrompt,
    }
  },
})
</script>
