"use client"

import { useState, useEffect, useCallback } from "react"
import { locationService, type DriverLocation, type LocationConnectionStatus } from "@/lib/location"

export function useRealTimeLocation(busNumber: string | null) {
  const [location, setLocation] = useState<DriverLocation | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<LocationConnectionStatus>({
    isConnected: false,
    lastUpdate: null,
    error: null,
    reconnectAttempts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const updateConnectionStatus = useCallback(() => {
    setConnectionStatus(locationService.getConnectionStatus())
  }, [])

  const forceReconnect = useCallback(() => {
    locationService.forceReconnect()
    updateConnectionStatus()
  }, [updateConnectionStatus])

  useEffect(() => {
    if (!busNumber) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const unsubscribe = locationService.subscribe(busNumber, (newLocation) => {
      setLocation(newLocation)
      setIsLoading(false)
      updateConnectionStatus()
    })

    // Update connection status periodically
    const statusInterval = setInterval(updateConnectionStatus, 1000)

    return () => {
      unsubscribe()
      clearInterval(statusInterval)
    }
  }, [busNumber, updateConnectionStatus])

  return {
    location,
    connectionStatus,
    isLoading,
    forceReconnect,
  }
}
