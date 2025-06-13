import { axios } from "../config"
import { AxiosResponse } from "axios"
import { ISubscriptionEntity } from "../types"

export const getSubsByOrgIdHandler = async (): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/org-info",
      method: "GET",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const cancelSubscriptionHandler = async (): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/cancel",
      method: "POST",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const recancelSubscriptionHandler = async (): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/recancel",
      method: "POST",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const activateFromTrialSubscriptionHandler = async (): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/activate-from-trial",
      method: "POST",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const getPaymentDetailsLinkHandler = async (): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      url: "/api/subscription/payment-details-link",
      method: "GET",
    })

    const { data }: { data: string } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}

export const changePlanSubscriptionHandler = async (plan_id: string): Promise<ISubscriptionEntity | null> => {
  try {
    const response: AxiosResponse = await axios({
      url: `/api/subscription//change-plan/${plan_id}`,
      method: "PATCH",
    })

    const { data }: { data: ISubscriptionEntity | null } = response

    return data
  } catch (error: unknown) {
    throw error
  }
}
