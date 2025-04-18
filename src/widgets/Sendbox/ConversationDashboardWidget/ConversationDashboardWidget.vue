<template>
  <div>
    <div class="history --loader" v-if="!isReady">
      <div class="conversation__description">
        <span class="--pulse" />
        <p>Please Stand By...</p>
      </div>
    </div>

    <div class="dashboard" v-else>
      <h1>Prompts</h1>

      <div class="dashboard__wrapper">
        <div class="dashboard__card" v-for="(prompt, index) in getPromptList" :key="index" @click="selectPrompt(prompt)">
          <h3 class="dashboard__card-title">{{ prompt.title }}</h3>

          <br />

          <p class="dashboard__card-description">{{ prompt.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"
import { promptStore } from "@/app"
import { IPromptScenario } from "@/shared/types"

export default defineComponent({
  setup() {
    const router = useRouter()
    const isReady = ref<boolean>(false)

    const getPromptList = computed(() => promptStore.getPromptList)

    onBeforeMount(async () => {
      if (!getPromptList.value.length) {
        await setupOnloadMethods()
      }

      isReady.value = true
    })

    const setupOnloadMethods = async () => {
      try {
        await promptStore.fetchPromptsList()
      } catch (error) {
        console.error("Error in setupOnloadMethods:", error)
      }
    }

    const selectPrompt = (prompt: IPromptScenario) => {
      promptStore.setPrompt(prompt)

      nextTick(() => {
        router.push({ name: "sendbox.conversation" })
      })
    }

    return {
      isReady,
      getPromptList,
      selectPrompt,
    }
  },
})
</script>
