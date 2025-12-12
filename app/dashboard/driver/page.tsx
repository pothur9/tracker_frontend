"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Navigation, Phone, Bell, Power, Clock, Wifi } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { TopNavigation } from "@/components/top-navigation"
import { ConnectionStatus } from "@/components/connection-status"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import {
  getCurrentLocation,
  updateDriverLocation,
  watchLocation,
  stopWatchingLocation,
  ensureGeolocationReady,
  type Location,
} from "@/lib/location"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export default function DriverDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isTripStarted, setIsTripStarted] = useState(false)
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [lastLocation, setLastLocation] = useState<Location | null>(null)
  const [computedHeading, setComputedHeading] = useState<number>(0)
  const [computedSpeed, setComputedSpeed] = useState<number>(0)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [connectedStudents] = useState(12) // Mock data
  const [isLoading, setIsLoading] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    lastUpdate: null as Date | null,
    error: null as string | null,
    reconnectAttempts: 0,
  })
  const [locationUpdateCount, setLocationUpdateCount] = useState(0)
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)

  const demoUser = {
    id: "demo-driver-1",
    name: "Demo Driver",
    type: "driver" as const,
    busNumber: "BUS-001",
    phone: "+1234567890",
    schoolName: "Demo School",
    schoolCity: "Demo City",
  }

  const currentUser = user || demoUser

  useEffect(() => {
    // Redirect non-driver users away
    if (user && user.type !== "driver") {
      router.push("/")
      return
    }
    // If no user exists, send to driver login
    if (!user) {
      router.replace("/auth/driver/login")
      return
    }
  }, [user, router])

  // Restore trip state from localStorage on mount
  useEffect(() => {
    if (!user?.busNumber || typeof window === 'undefined') return
    // Skip if already sharing (already restored)
    if (isLocationSharing) return

    const savedTripState = localStorage.getItem('driver_trip_started')
    const savedSessionStart = localStorage.getItem('driver_session_start_time')
    
    if (savedTripState === 'true' && savedSessionStart) {
      // Restore trip state
      const sessionStartDate = new Date(savedSessionStart)
      // Only restore if session start time is valid and not too old (e.g., within 24 hours)
      const now = new Date()
      const hoursDiff = (now.getTime() - sessionStartDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff < 24 && !isNaN(sessionStartDate.getTime())) {
        // Set trip state first (so button shows correctly)
        setIsTripStarted(true)
        setSessionStartTime(sessionStartDate)
        // Restart location sharing (this will set isLoading and then clear it)
        handleLocationToggle(true).catch(() => {
          // If restoration fails, clear the saved state
          localStorage.removeItem('driver_trip_started')
          localStorage.removeItem('driver_session_start_time')
          setIsTripStarted(false)
          setSessionStartTime(null)
          setIsLoading(false)
        })
      } else {
        // Clear old session data
        localStorage.removeItem('driver_trip_started')
        localStorage.removeItem('driver_session_start_time')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.busNumber])

  // Load school coordinates for current driver (best-effort by schoolName)
  useEffect(() => {
    let cancelled = false
    async function loadSchool() {
      const name = currentUser.schoolName
      if (!name) {
        setSchoolCoords(null)
        return
      }
      try {
        const list = await api("/api/school")
        if (cancelled) return
        if (Array.isArray(list)) {
          const match = list.find((s: any) => s.schoolName?.toLowerCase() === String(name).toLowerCase())
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.schoolName])

  const handleLocationToggle = async (enabled: boolean) => {
    setIsLoading(true)

    try {
      if (enabled) {
        await ensureGeolocationReady()
        // Stop any existing watcher first to avoid duplicates
        if (watchId !== null) {
          stopWatchingLocation(watchId)
          setWatchId(null)
        }
        
        // Start location sharing
        const location = await getCurrentLocation()
        setCurrentLocation(location)

        const id = watchLocation((newLocation) => {
          let currentSpeed = computedSpeed
          let currentHeading = computedHeading

          // Compute heading and speed vs previous point for better accuracy
          if (lastLocation) {
            const toRad = (deg: number) => (deg * Math.PI) / 180
            const toDeg = (rad: number) => (rad * 180) / Math.PI
            const earthRadius = 6371e3 // meters

            // Haversine distance for accurate calculation
            const φ1 = toRad(lastLocation.latitude)
            const φ2 = toRad(newLocation.latitude)
            const Δφ = toRad(newLocation.latitude - lastLocation.latitude)
            const Δλ = toRad(newLocation.longitude - lastLocation.longitude)
            const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = earthRadius * c // meters
            const timeSeconds = Math.max(1, (newLocation.timestamp.getTime() - lastLocation.timestamp.getTime()) / 1000)
            const speedMs = distance / timeSeconds
            const speedKmh = speedMs * 3.6

            // Calculate bearing/heading between two points
            const y = Math.sin(Δλ) * Math.cos(φ2)
            const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
            const brng = (toDeg(Math.atan2(y, x)) + 360) % 360
            
            currentHeading = brng
            currentSpeed = speedKmh
            setComputedHeading(brng)
            setComputedSpeed(speedKmh)
          }

          setLastLocation(newLocation)
          setCurrentLocation(newLocation)
          setLocationUpdateCount((prev) => prev + 1)

          // Update connection status
          setConnectionStatus({
            isConnected: true,
            lastUpdate: new Date(),
            error: null,
            reconnectAttempts: 0,
          })

          // Update driver location in backend with accurate data
          if (user?.busNumber) {
            updateDriverLocation({
              driverId: user.id,
              busNumber: user.busNumber,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              timestamp: newLocation.timestamp,
              speed: currentSpeed,
              heading: currentHeading,
              accuracy: newLocation.accuracy,
            }).catch((error) => {
              console.error("Failed to update driver location:", error)
              setConnectionStatus((prev) => ({
                ...prev,
                error: "Failed to update location",
                reconnectAttempts: prev.reconnectAttempts + 1,
              }))
            })
          }
        })

        const startTime = new Date()
        setWatchId(id)
        setIsLocationSharing(true)
        setIsTripStarted(true)
        setSessionStartTime(startTime)
        setConnectionStatus({
          isConnected: true,
          lastUpdate: new Date(),
          error: null,
          reconnectAttempts: 0,
        })
        setIsLoading(false) // Reset loading state immediately after starting

        // Save trip state to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('driver_trip_started', 'true')
          localStorage.setItem('driver_session_start_time', startTime.toISOString())
        }

        toast({
          title: "Trip Started",
          description: "Location sharing is now active. Students can track your location.",
        })
      } else {
        // Stop location sharing
        if (watchId !== null) {
          stopWatchingLocation(watchId)
          setWatchId(null)
        }

        setIsLocationSharing(false)
        setIsTripStarted(false)
        setSessionStartTime(null)
        setConnectionStatus({
          isConnected: false,
          lastUpdate: null,
          error: null,
          reconnectAttempts: 0,
        })
        setIsLoading(false) // Reset loading state immediately after stopping

        // Clear trip state from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('driver_trip_started')
          localStorage.removeItem('driver_session_start_time')
        }

        toast({
          title: "Trip Stopped",
          description: "Location sharing has been stopped. Students can no longer track your location.",
        })
      }
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        lastUpdate: null,
        error: error instanceof Error ? error.message : "Location access failed",
        reconnectAttempts: 0,
      })

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to access location. Please check permissions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mirror sharing state to backend/localStorage whenever it changes via toggle
  useEffect(() => {
    (async () => {
      if (!user?.busNumber) return
      try {
        await api('/api/driver/sharing', { method: 'POST', body: { isSharing: isLocationSharing } })
      } catch {}
      if (typeof window !== 'undefined') {
        localStorage.setItem('driver_location_sharing', isLocationSharing ? 'on' : 'off')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocationSharing])

  const formatSessionTime = () => {
    if (!sessionStartTime) return "00:00:00"

    const now = new Date()
    const diff = now.getTime() - sessionStartTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Update session time every second
  useEffect(() => {
    if (!sessionStartTime) return

    const interval = setInterval(() => {
      // Force re-render to update time
      setSessionStartTime(new Date(sessionStartTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to Driver Login…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar />
      <TopNavigation activeTab="home" userType="driver" />

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Driver Details */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-medium">{currentUser.name || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p className="font-medium">{currentUser.phone || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">School</span>
              <p className="font-medium">{currentUser.schoolName || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">City</span>
              <p className="font-medium">{currentUser.schoolCity || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bus Number</span>
              <p className="font-medium">{currentUser.busNumber || "-"}</p>
            </div>
            {/* <div>
              <span className="text-muted-foreground">Driver ID</span>
              <p className="font-mono">{currentUser.id}</p>
            </div> */}
          </CardContent>
        </Card>
        {/* Connection Status */}
        {isLocationSharing && (
          <ConnectionStatus status={connectionStatus} onReconnect={() => handleLocationToggle(false)} />
        )}

        {/* Trip Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Trip Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {!isTripStarted ? (
                <Button
                  onClick={() => handleLocationToggle(true)}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Start Trip
                </Button>
              ) : (
                <Button
                  onClick={() => handleLocationToggle(false)}
                  disabled={isLoading && !isLocationSharing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Power className="h-5 w-5 mr-2" />
                  Stop Trip
                </Button>
              )}
            </div>

            {isTripStarted && (
              <div className="bg-primary/10 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Trip Duration</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-primary">{formatSessionTime()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Power className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Location Sharing</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your location is being shared with students. Click "Stop Trip" to end location sharing.
                </p>
              </div>
            )}

            {!isTripStarted && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Click "Start Trip" to begin sharing your location with students.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{connectedStudents}</p>
              <p className="text-sm text-muted-foreground">Connected Students</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{connectionStatus.isConnected ? "Active" : "Inactive"}</p>
              <p className="text-sm text-muted-foreground">GPS Status</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Map Preview */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Location</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/driver/map">
                <Navigation className="h-4 w-4 mr-2" />
                Full Map
              </a>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 relative">
              {currentLocation ? (
                <GoogleMap
                  driverLocation={{
                    Use currentUser for demo support 
                    driverId: currentUser.id,
                    busNumber: currentUser.busNumber || "",
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    timestamp: currentLocation.timestamp,
                    speed: computedSpeed,
                    heading: computedHeading,
                  }}
                  schoolLocation={schoolCoords}
                  showRoute
                  className="w-full h-full rounded-b-lg"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-b-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isLocationSharing ? "Getting location..." : "Enable location sharing to see map"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}

        {/* Quick Actions */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Contact
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Student List
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Route Information
            </Button>
          </CardContent>
        </Card> */}
      </div>

    </div>
  )
}
