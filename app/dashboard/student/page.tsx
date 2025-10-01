"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Phone, User, Bell, Menu, RefreshCw } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ConnectionStatus } from "@/components/connection-status"
import { useAuth } from "@/hooks/use-auth"
import { useRealTimeLocation } from "@/hooks/use-real-time-location"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [driverStatus, setDriverStatus] = useState<{ isActive: boolean; driverName?: string } | null>(null)

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

  // Fetch driver status by bus number
  useEffect(() => {
    let cancelled = false
    async function loadDriverStatus() {
      if (!user?.busNumber || !user?.schoolId) {
        setDriverStatus(null)
        return
      }
      try {
        // Fetch driver info from the school
        const drivers = await api(`/api/school/${user.schoolId}/drivers`)
        if (cancelled) return
        if (Array.isArray(drivers)) {
          const driver = drivers.find((d: any) => d.busNumber === user.busNumber)
          if (driver) {
            setDriverStatus({
              isActive: driver.isActive !== false, // Default to true if not specified
              driverName: driver.name,
            })
          } else {
            setDriverStatus({ isActive: false })
          }
        }
      } catch (e) {
        console.error("Error fetching driver status:", e)
        if (!cancelled) setDriverStatus(null)
      }
    }
    loadDriverStatus()
    return () => {
      cancelled = true
    }
  }, [user?.busNumber, user?.schoolId])

  // Fetch school coordinates based on user's schoolName (best effort)
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

  const getStatusColor = () => {
    if (!driverLocation || !connectionStatus.isConnected) return "secondary"

    const now = new Date()
    const locationTime = new Date(driverLocation.timestamp)
    const timeDiff = now.getTime() - locationTime.getTime()

    // If location is older than 30 seconds, show as stale
    if (timeDiff > 30000) return "destructive"

    // If bus is moving (speed > 5), show as active
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

  const calculateETA = () => {
    if (!driverLocation || !driverLocation.speed || driverLocation.speed < 1) {
      return "N/A"
    }

    // Mock distance calculation - in real app, would use actual route distance
    const mockDistance = 2.3 // km
    const eta = (mockDistance / driverLocation.speed) * 60 // minutes
    return `${Math.round(eta)} min`
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif font-bold text-lg">Track Bus</h1>
            <p className="text-sm text-muted-foreground">{user.busNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatus status={connectionStatus} onReconnect={forceReconnect} compact />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Content Area (White Background) */}
      <div className="flex-1 relative">
        {/* Replace full-screen map with solid white background */}
        <div className="absolute inset-0 bg-white" />

        {/* Bus Status Card - Floating */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Bus {user.busNumber}</h3>
                      <Badge variant={getStatusColor() as any}>{getStatusText()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {driverLocation?.speed ? `${Math.round(driverLocation.speed)} km/h` : "No speed data"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">ETA</p>
                  <p className="text-lg font-bold text-primary">{calculateETA()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status Card */}
        {(connectionStatus.error || !connectionStatus.isConnected) && (
          <div className="absolute top-20 left-4 right-4 z-20">
            <Card className="shadow-lg border-destructive/50">
              <CardContent className="p-3">
                <ConnectionStatus status={connectionStatus} onReconnect={forceReconnect} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Details Card - Bottom */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{user.name || "Student"}</h4>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="text-xs text-muted-foreground">
                      {connectionStatus.lastUpdate
                        ? `Updated ${new Date(connectionStatus.lastUpdate).toLocaleTimeString()}`
                        : "No updates"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Student details */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Bus</p>
                  <p className="font-medium">{user.busNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-medium">{user.class ? `${user.class}${user.section ? "-" + user.section : ""}` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="font-medium">{user.schoolName || "N/A"}</p>
                </div>
              </div>

              {driverLocation && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="font-semibold">2.3 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Speed</p>
                      <p className="font-semibold">
                        {driverLocation.speed ? `${Math.round(driverLocation.speed)} km/h` : "0 km/h"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="font-semibold">
                        {driverLocation.accuracy ? `${Math.round(driverLocation.accuracy)}m` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Driver Inactive/Offline Message */}
        {driverStatus && !driverStatus.isActive && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Card className="mx-4 shadow-lg border-destructive">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-destructive">Driver Inactive</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The driver for bus {user.busNumber} is currently marked as inactive.
                </p>
                {driverStatus.driverName && (
                  <p className="text-sm text-muted-foreground mb-4">Driver: {driverStatus.driverName}</p>
                )}
                <p className="text-xs text-muted-foreground">Please contact your school for more information.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Driver Offline Message */}
        {driverStatus?.isActive && !isLoading && (!driverLocation || !connectionStatus.isConnected) && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Card className="mx-4 shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Driver Offline</h3>
                <p className="text-sm text-muted-foreground mb-4">Your bus driver is currently offline.</p>
                <Button onClick={forceReconnect} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Card className="mx-4 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Connecting to bus...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" userType="student" />
    </div>
  )
}
