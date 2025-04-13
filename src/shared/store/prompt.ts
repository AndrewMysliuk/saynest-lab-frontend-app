import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPromptScenario } from "@/shared/types"
import { generatePromptFromScenario, transformSingleScenarioJson } from "@/shared/utils"
import GettingGymMembershipPrompt from "@/json_prompt_data/getting_a_gym_membership.json"
import OpeningBankAccountAbroadPrompt from "@/json_prompt_data/opening_a_bank_account_abroad.json"
import BookingHotelRoomWithSpecificRequestsPrompt from "@/json_prompt_data/booking_a_hotel_room_with_specific_requests.json"
import FixingMistakeOnBillPrompt from "@/json_prompt_data/fixing_a_mistake_on_a_bill.json"

export const usePromptStore = defineStore("promptStore", () => {
  const promptList = ref<IPromptScenario[]>([
    {
      ...transformSingleScenarioJson(GettingGymMembershipPrompt),
      finally_prompt: generatePromptFromScenario(GettingGymMembershipPrompt),
    },
    {
      ...transformSingleScenarioJson(OpeningBankAccountAbroadPrompt),
      finally_prompt: generatePromptFromScenario(OpeningBankAccountAbroadPrompt),
    },
    {
      ...transformSingleScenarioJson(BookingHotelRoomWithSpecificRequestsPrompt),
      finally_prompt: generatePromptFromScenario(BookingHotelRoomWithSpecificRequestsPrompt),
    },
    {
      ...transformSingleScenarioJson(FixingMistakeOnBillPrompt),
      finally_prompt: generatePromptFromScenario(FixingMistakeOnBillPrompt),
    },
  ])
  const selectedPrompt = ref<IPromptScenario>({} as IPromptScenario)

  const getPromptList = computed(() => promptList.value)
  const getSelectedPrompt = computed(() => selectedPrompt.value)

  const setPrompt = (prompt: IPromptScenario) => {
    selectedPrompt.value = prompt
  }

  return {
    getPromptList,
    getSelectedPrompt,
    setPrompt,
  }
})
