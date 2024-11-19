<template>
  <div class="prompt">
    <h1>Prompts</h1>

    <div class="prompt__wrapper">
      <div class="prompt__card" v-for="prompt in getPromptList" :key="prompt.id" @click="selectPrompt(prompt)">
        <h3 class="prompt__card-title">{{ prompt?.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { promptStore, sendboxStore } from "@/app"
import { IPrompt } from "@/shared/types"
import { analyzeConversationPrompt } from "@/shared/utils"

export default defineComponent({
  setup() {
    const router = useRouter()

    const getPromptList = computed(() => promptStore.getPromptList)
    const getGptAnalyserResult = computed(() => sendboxStore.getGptAnalyserResult)

    onBeforeMount(async () => {
      // await conversationAnalyser()
      // console.log(getGptAnalyserResult.value)
    })

    const conversationAnalyser = async () => {
      try {
        await sendboxStore.fetchConversationAnalyserByGptModel({
          model: "gpt-4o-mini",
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: analyzeConversationPrompt,
            },
            {
              role: "user",
              content: JSON.stringify([
                {
                  _id: {
                    $oid: "673ba623106e0b417703931e",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "eec51107-2a95-4b90-b74d-71f180e49c2f",
                  role: "user",
                  content: "Hello.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962397160-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:40:03.258Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba625106e0b4177039320",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "eec51107-2a95-4b90-b74d-71f180e49c2f",
                  role: "assistant",
                  content: "Hi there! Let's focus on speaking practice today! What topic would you like to discuss to get started?",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962404169-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:40:05.984Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba634106e0b4177039323",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "deee97a3-b10f-46d6-867b-101aadf007d0",
                  role: "user",
                  content: "Up to you choose something and we will start",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962417376-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:40:20.693Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba63b106e0b4177039325",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "deee97a3-b10f-46d6-867b-101aadf007d0",
                  role: "assistant",
                  content:
                    "Great! How about we talk about travel? It's a fun topic and there's so much to discuss. Have you traveled anywhere recently or do you have a dream destination you'd like to visit?",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962421769-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:40:27.196Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba64f106e0b4177039328",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "e6829b07-c19b-45a4-a353-523d08c8691c",
                  role: "user",
                  content: "I noticed that you choose this topic very often, so... Okay, okay, I don't mind. Let's start.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962444821-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:40:47.104Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba651106e0b417703932a",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "e6829b07-c19b-45a4-a353-523d08c8691c",
                  role: "assistant",
                  content:
                    "Thanks for being open to it! Travel can lead to some interesting conversations. So, do you have a favorite place you’ve visited, or is there somewhere you’ve always wanted to go?",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962448208-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:40:49.845Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba674106e0b417703932d",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "c6d8d53b-baf6-44d1-b925-7f20c8b042ee",
                  role: "user",
                  content: "Actually, I don't know. I live in Kyiv and sometimes I have some small trip to my hometown where I spend time with my parents, actually.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962481780-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:41:24.261Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba677106e0b417703932f",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "c6d8d53b-baf6-44d1-b925-7f20c8b042ee",
                  role: "assistant",
                  content:
                    'That sounds nice! Spending time with family is always special. What do you enjoy doing when you visit your hometown? \n\n[CORRECTION: "[WRONG: small trip]" → It\'s more natural to say "[PROPERLY: short trip]" since "short" typically describes a brief journey. \nSo, it would be: "[PROPERLY: I sometimes take a short trip to my hometown where I spend time with my parents.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962485972-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:41:27.492Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba6dc106e0b4177039332",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "0bfad87a-28e1-4a26-8eed-47c6205c88ca",
                  role: "user",
                  content: "Usually I do that for resting and I actually meet, have meeting with friends and we spend time together but the, but most time I spend with my parents in the countryside.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962587179-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:43:08.509Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba6e1106e0b4177039334",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "0bfad87a-28e1-4a26-8eed-47c6205c88ca",
                  role: "assistant",
                  content:
                    'That sounds lovely! Relaxing in the countryside and spending time with friends and family must be refreshing. What activities do you usually do with your friends when you meet up?\n\n[CORRECTION: "[WRONG: have meeting]" → It\'s more natural to say "[PROPERLY: meet]" since "meet" is commonly used for casual gatherings. \n"[WRONG: the, but]" → You can simply say "but" without "the." \nSo, it would be: "[PROPERLY: I usually do that for resting, and I meet with friends, but most of the time I spend with my parents in the countryside.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962590872-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:43:13.753Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba71e106e0b4177039337",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "1b07ac6c-af9a-41d2-8ff5-3b323b4e86a9",
                  role: "user",
                  content: "I don't know what to answer on this question because I've never thought about what I usually do. I mean, some activities, something like that.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962652853-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:44:14.973Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba724106e0b4177039339",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "1b07ac6c-af9a-41d2-8ff5-3b323b4e86a9",
                  role: "assistant",
                  content:
                    'That\'s okay! It can be hard to think about what we do regularly. Maybe we can brainstorm some common activities together. People often enjoy going for a walk, having a meal, playing games, or just chatting. Do any of these sound familiar to you?\n\n[CORRECTION: "[WRONG: what I usually do. I mean, some activities, something like that.]" → It\'s more natural to say "[PROPERLY: what activities I usually do.]" \nSo, it would be: "[PROPERLY: I don\'t know how to answer this question because I\'ve never thought about what activities I usually do.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962657276-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:44:20.950Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba743106e0b417703933c",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "70017c62-f84c-4d49-89bd-bbcdac0436d7",
                  role: "user",
                  content: "Yeah, actually walk, walking, and have a meal, maybe.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962689286-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:44:51.842Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba749106e0b417703933e",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "70017c62-f84c-4d49-89bd-bbcdac0436d7",
                  role: "assistant",
                  content:
                    'Those are great activities! Walking is a nice way to catch up and enjoy the surroundings, and sharing a meal can be really enjoyable too. Do you have a favorite place to walk or a favorite meal you like to share with your friends? \n\n[CORRECTION: "[WRONG: have a meal, maybe.]" → It\'s more natural to say "[PROPERLY: or having a meal, maybe.]" \nSo, it would be: "[PROPERLY: Yeah, actually walking and having a meal, maybe.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962694196-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:44:57.087Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba77b106e0b4177039341",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "8fc33357-2fc1-4e6c-a3e3-d604a2a054c7",
                  role: "user",
                  content:
                    "I don't know about meal, but I have, you know, favorite places where I can have a meal. It's several restaurants where I usually gather with my friends and we spend time, drink something, eat something, you know, how it happens.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962746093-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:45:47.498Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba780106e0b4177039343",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "8fc33357-2fc1-4e6c-a3e3-d604a2a054c7",
                  role: "assistant",
                  content:
                    'That sounds nice! It\'s great to have favorite restaurants to gather with friends. What type of cuisine do you enjoy at those restaurants? \n\n[CORRECTION: "[WRONG: I have, you know, favorite places where I can have a meal.]" → It\'s more natural to say "[PROPERLY: I have some favorite places where I can eat.]" \n"[WRONG: drink something, eat something, you know, how it happens.]" → You can say "[PROPERLY: drink and eat, like you know how it is.]"\nSo, it would be: "[PROPERLY: I don\'t know about a specific meal, but I have some favorite places where I can eat. It\'s several restaurants where I usually gather with my friends, and we spend time drinking and eating, like you know how it is.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962750538-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:45:52.593Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba79f106e0b4177039346",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "3ba650c4-dd99-4b94-9237-488b41690140",
                  role: "user",
                  content: "Can you explain me mention of cuisine word, because I think I didn't understand enough.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962781315-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:46:23.312Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba7ac106e0b4177039348",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "3ba650c4-dd99-4b94-9237-488b41690140",
                  role: "assistant",
                  content:
                    'Of course! The word "cuisine" refers to a style or method of cooking, often associated with a particular culture or region. For example, Italian cuisine includes dishes like pasta and pizza, while Japanese cuisine features sushi and ramen. When I asked about your favorite cuisine, I meant to know if you like certain types of food, like Italian, Asian, or something else. Does that help clarify?\n\n[CORRECTION: "[WRONG: mention of cuisine word]" → It\'s more natural to say "[PROPERLY: the mention of the word \'cuisine\']" \nSo, it would be: "[PROPERLY: Can you explain the mention of the word \'cuisine\' to me?]"',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962785854-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:46:36.843Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba7d7106e0b417703934b",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "515a4b3d-2c1a-48f0-9601-8d13e0e324ef",
                  role: "user",
                  content: "It's something like a national food, as I understand correctly.",
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962838464-user-request.wav",
                  createdAt: {
                    $date: "2024-11-18T20:47:19.480Z",
                  },
                  __v: 0,
                },
                {
                  _id: {
                    $oid: "673ba7dc106e0b417703934d",
                  },
                  sessionId: "80ff92e6-9efa-4679-85d7-58df0c35d058",
                  pairId: "515a4b3d-2c1a-48f0-9601-8d13e0e324ef",
                  role: "assistant",
                  content:
                    'Exactly! You got it right. Cuisine often reflects the traditional dishes and cooking styles of a specific country or culture. So, when talking about a country\'s cuisine, you\'re referring to the types of food that are popular or unique to that place. Do you have a favorite national cuisine that you enjoy? \n\n[CORRECTION: "[WRONG: as I understand correctly.]" → It\'s more natural to say "[PROPERLY: as I understand it.]"\nSo, it would be: "[PROPERLY: It\'s something like national food, as I understand it.]"]',
                  audioUrl: "/user_sessions/80ff92e6-9efa-4679-85d7-58df0c35d058/1731962842051-model-response.mp3",
                  createdAt: {
                    $date: "2024-11-18T20:47:24.683Z",
                  },
                  __v: 0,
                },
              ]),
            },
          ],
        })
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const selectPrompt = (prompt: IPrompt) => {
      promptStore.setPrompt(prompt)

      nextTick(() => {
        router.push({ name: "sendbox.conversation" })
      })
    }

    return {
      getPromptList,
      selectPrompt,
    }
  },
})
</script>
