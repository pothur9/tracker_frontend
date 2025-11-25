"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, RefreshCw, Bus, Clock, User2 } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ConnectionStatus } from "@/components/connection-status"
import { useAuth } from "@/hooks/use-auth"
import { useRealTimeLocation } from "@/hooks/use-real-time-location"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Navbar } from "@/components/navbar"

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
        const drivers = await api(`/api/school/${user.schoolId}/drivers`)
        if (cancelled) return
        if (Array.isArray(drivers)) {
          const driver = drivers.find((d: any) => d.busNumber === user.busNumber)
          if (driver) {
            setDriverStatus({
              isActive: driver.isActive !== false,
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

  const calculateETA = () => {
    if (!driverLocation || !driverLocation.speed || driverLocation.speed < 1) {
      return "N/A"
    }
    const mockDistance = 2.3
    const eta = (mockDistance / driverLocation.speed) * 60
    return `${Math.round(eta)} min`
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Navbar />

      <div className="flex-1 relative overflow-hidden">
        {/* Map Background */}
        {driverLocation && connectionStatus.isConnected && (
          <div className="absolute inset-0">
            <GoogleMap
              driverLocation={driverLocation}
              schoolLocation={schoolCoords}
              initialZoom={14}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 pointer-events-none" />

        {/* Bus Status Card - Top */}
        {driverLocation && connectionStatus.isConnected && (
          <div className="absolute top-4 left-4 right-4 z-10 animate-in slide-in-from-top duration-500">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">Bus {user.busNumber}</h3>
                        <Badge variant={getStatusColor() as any} className="font-semibold">
                          {getStatusText()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {driverLocation?.speed ? `${Math.round(driverLocation.speed)} km/h` : "Stationary"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <p className="text-xs font-medium">ETA</p>
                    </div>
                    {/* <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {calculateETA()}
                    </p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connection Error */}
        {(connectionStatus.error || !connectionStatus.isConnected) && (
          <div className="absolute top-4 left-4 right-4 z-20 animate-in slide-in-from-top duration-500">
            <Card className="shadow-xl border-red-200 bg-red-50/95 backdrop-blur-sm">
              <CardContent className="p-3">
                <ConnectionStatus status={connectionStatus} onReconnect={forceReconnect} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Info Card - Bottom (Sits directly above bottom nav) */}
      <div className="mt-52 left-4 right-4 z-10 animate-in slide-in-from-bottom duration-500">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{user.name || "Student"}</h4>
                  <p className="text-sm text-muted-foreground">
                    Class {user.class}
                    {user.section && `-${user.section}`} • {user.schoolName}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3">
                  <p className="text-xs font-medium text-blue-900/60 mb-1">Father's Name</p>
                  <p className="font-semibold text-blue-900">{user.fatherName || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3">
                  <p className="text-xs font-medium text-purple-900/60 mb-1">Phone</p>
                  <p className="font-semibold text-purple-900">{user.phone || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3">
                  <p className="text-xs font-medium text-green-900/60 mb-1">Bus Number</p>
                  <p className="font-semibold text-green-900">{user.busNumber || "N/A"}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3">
                  <p className="text-xs font-medium text-orange-900/60 mb-1">City</p>
                  <p className="font-semibold text-orange-900">{user.city || "N/A"}</p>
                </div>
              </div>

              {/* Last Update */}
              {/* {connectionStatus.lastUpdate && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Last updated {new Date(connectionStatus.lastUpdate).toLocaleTimeString()}
                </p>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Driver Inactive */}
        {driverStatus && !driverStatus.isActive && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/20 backdrop-blur-sm">
            <Card className="mx-4 shadow-2xl border-red-200 max-w-md animate-in zoom-in duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-red-600">Driver Inactive</h3>
                <p className="text-muted-foreground mb-2">
                  The driver for bus {user.busNumber} is currently inactive.
                </p>
                {driverStatus.driverName && (
                  <p className="text-sm text-muted-foreground mb-4">Driver: {driverStatus.driverName}</p>
                )}
                <p className="text-xs text-muted-foreground">Please contact your school for more information.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Driver Offline */}
        {driverStatus?.isActive && !isLoading && (!driverLocation || !connectionStatus.isConnected) && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <Card className="mx-4 shadow-2xl border-0 max-w-md animate-in zoom-in duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Driver Offline</h3>
                <p className="text-muted-foreground mb-6">Your bus driver is currently offline.</p>
                <Button onClick={forceReconnect} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <Card className="mx-4 shadow-2xl border-0 max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Connecting to bus...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="home" userType="student" />
    </div>
  )
}
