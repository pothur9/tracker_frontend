"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, RefreshCw, Bus, Locate } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { TopNavigation } from "@/components/top-navigation"
import { ConnectionStatus } from "@/components/connection-status"
import { useAuth } from "@/hooks/use-auth"
import { useRealTimeLocation } from "@/hooks/use-real-time-location"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Navbar } from "@/components/navbar"

export default function StudentMapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [stops, setStops] = useState<Array<{ lat: number; lng: number; name?: string; order?: number }>>([])
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(-1)

  const {
    location: driverLocation,
    connectionStatus,
    isLoading,
    forceReconnect,
  } = useRealTimeLocation(user?.busNumber || null)

  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!user) {
      router.push("/auth/student/login")
      return
    }
    if (user.type !== "student") {
      router.push("/")
      return
    }
  }, [user, router])

  // Fetch school coordinates
  useEffect(() => {
    let cancelled = false
    async function loadSchool() {
      if (!user?.schoolName) {
        setSchoolCoords(null)
        return
      }
      try {
        const list = await api("/api/school")
        if (cancelled) return
        if (Array.isArray(list)) {
          const match = list.find((s: any) => s.schoolName?.toLowerCase() === user.schoolName?.toLowerCase())
          if (match?.coordinates && typeof match.coordinates.lat === "number" && typeof match.coordinates.lng === "number") {
            setSchoolCoords({ lat: match.coordinates.lat, lng: match.coordinates.lng })
          }
        }
      } catch (e) {
        if (!cancelled) setSchoolCoords(null)
      }
    }
    loadSchool()
    return () => {
      cancelled = true
    }
  }, [user?.schoolName])

  // Fetch driver stops if available
  useEffect(() => {
    let cancelled = false
    async function loadStops() {
      if (!user?.busNumber) return
      try {
        const resp = await api(`/api/driver/stops/public?busNumber=${user.busNumber}`)
        if (cancelled) return
        if (resp && Array.isArray(resp.stops)) {
          setStops(resp.stops.map((s: any) => ({ lat: s.lat, lng: s.lng, name: s.name, order: s.order })))
          setCurrentStopIndex(Number.isInteger(resp.currentStopIndex) ? resp.currentStopIndex : -1)
        }
      } catch (e) {
        // Stops may not be available for all drivers
      }
    }
    loadStops()
    return () => {
      cancelled = true
    }
  }, [user?.busNumber])

  const getStatusColor = () => {
    if (!driverLocation || !connectionStatus.isConnected) return "secondary"
    const now = new Date()
    const locationTime = new Date(driverLocation.timestamp)
    const timeDiff = now.getTime() - locationTime.getTime()
    if (timeDiff > 30000) return "destructive"
    if (driverLocation.speed && driverLocation.speed > 5) return "default"
    return "secondary"
  }

  const getStatusText = () => {
    if (!driverLocation || !connectionStatus.isConnected) return "Offline"
    const now = new Date()
    const locationTime = new Date(driverLocation.timestamp)
    const timeDiff = now.getTime() - locationTime.getTime()
    if (timeDiff > 30000) return "Signal Lost"
    if (driverLocation.speed && driverLocation.speed > 5) return "On Route"
    return "Stopped"
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex flex-col">
      {/* Navbar */}
      <Navbar showBackButton backUrl="/dashboard/student" />
      <TopNavigation activeTab="map" userType="student" />

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          {driverLocation && connectionStatus.isConnected ? (
            <GoogleMap
              driverLocation={driverLocation}
              schoolLocation={schoolCoords}
              showRoute
              stops={stops}
              currentStopIndex={currentStopIndex}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Card className="mx-4 shadow-lg max-w-md">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Location Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Waiting for driver location...
                  </p>
                  <Button onClick={forceReconnect} disabled={isLoading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Compact Floating Status Card */}
        {/* {driverLocation && connectionStatus.isConnected && (
          <div className="absolute top-3 left-3 right-3 z-10">
            <Card className="shadow-md bg-white/95 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">Bus {user.busNumber}</h3>
                        <Badge variant={getStatusColor() as any} className="text-xs py-0">
                          {getStatusText()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {driverLocation?.speed ? `${Math.round(driverLocation.speed)} km/h` : "Stationary"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Connection Error */}
        {(connectionStatus.error || !connectionStatus.isConnected) && (
          <div className="absolute top-3 left-3 right-3 z-20">
            <Card className="shadow-md border-red-200 bg-red-50/95 backdrop-blur-sm">
              <CardContent className="p-2.5">
                <ConnectionStatus status={connectionStatus} onReconnect={forceReconnect} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/50 backdrop-blur-sm">
            <Card className="mx-4 shadow-md">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">Connecting to bus...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  )
}
