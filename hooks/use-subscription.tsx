"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

interface Subscription {
  status: string
  startDate: string
  endDate: string
  daysRemaining: number
}

interface SubscriptionState {
  hasActiveSubscription: boolean
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    hasActiveSubscription: false,
    subscription: null,
    isLoading: true,
    error: null,
  })

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const response = await api("/api/payment/subscription-status")
      setState({
        hasActiveSubscription: response.hasActiveSubscription,
        subscription: response.subscription,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching subscription status:", error)
      setState({
        hasActiveSubscription: false,
        subscription: null,
        isLoading: false,
        error: "Failed to fetch subscription status",
      })
    }
  }, [])

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      fetchSubscriptionStatus()
    } else {
      setState({
        hasActiveSubscription: false,
        subscription: null,
        isLoading: false,
        error: null,
      })
    }
  }, [fetchSubscriptionStatus])

  return {
    ...state,
    refresh: fetchSubscriptionStatus,
  }
}
