<template>
  <div class="dashboard">
    <h1>Grammar Practice</h1>

    <div class="dashboard__grammar">
      <aside class="dashboard__grammar-sidebar">
        <div class="dashboard__list">
          <div class="dashboard__list-point" v-for="topic in getLanguageByTheory" :key="topic.id" @click="selectTopic(topic)">
            {{ topic.title }}
          </div>
        </div>
      </aside>
      <main class="dashboard__grammar-content">
        <div class="dashboard__topic" v-if="getSelectedTopic && Object.keys(getSelectedTopic).length">
          <div class="dashboard__topic-header">
            <h2 class="dashboard__topic-title">{{ getSelectedTopic.title }}</h2>
            <v-button label="Practice by Topic" buttonStyle="info" @click="isTaskModalOpen = true" />
          </div>

          <p class="dashboard__topic-description">
            {{ getSelectedTopic.description["uk"] }}
          </p>

          <div class="dashboard__topic-tags">
            <span class="dashboard__topic-tag" v-for="tag in getSelectedTopic.tags['uk']" :key="tag">
              {{ tag }}
            </span>
          </div>

          <div class="dashboard__topic-blocks">
            <template v-for="(block, i) in getSelectedTopic.explanation" :key="i">
              <p v-if="block.type === 'TEXT'" class="dashboard__topic-block-text">
                {{ block.content_translation["uk"] }}
              </p>

              <div v-else-if="block.type === 'TABLE'" class="dashboard__topic-block-table">
                <table>
                  <thead>
                    <tr>
                      <th v-for="(header, j) in block.headers" :key="j">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, r) in block.rows" :key="r">
                      <td v-for="(cell, c) in row" :key="c">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="block.type === 'ATTENTION'" class="dashboard__topic-block-attention">
                <p>{{ block.content_translation["uk"] }}</p>
              </div>

              <div v-else-if="block.type === 'EXAMPLE'" class="dashboard__topic-block-example">
                <p class="dashboard__topic-example-original">
                  {{ block.content }}
                </p>
                <p class="dashboard__topic-example-translation">
                  {{ block.content_translation["uk"] }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>

    <v-modal v-model="isTaskModalOpen">
      <TaskSelect />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue"
import { languageTheoryStore } from "@/app"
import { TaskSelect } from "@/shared/components"
import { ILanguageTopic } from "@/shared/types"

export default defineComponent({
  components: {
    TaskSelect,
  },

  setup() {
    const isTaskModalOpen = ref<boolean>(false)

    const getLanguageByTheory = computed(() => languageTheoryStore.getLanguageByTheory)
    const getSelectedTopic = computed(() => languageTheoryStore.getSelectedTopic)

    onBeforeMount(async () => {
      await languageTheoryStore.fetchTheoryByLanguage("Bulgarian")
    })

    const selectTopic = (topic: ILanguageTopic | null) => {
      languageTheoryStore.selectTopic(topic)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    return {
      isTaskModalOpen,
      getLanguageByTheory,
      getSelectedTopic,
      selectTopic,
    }
  },
})
</script>
