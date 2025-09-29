"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Navigation, Users, MapPin, Power, Plus, Locate } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/google-map"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { getCurrentLocation, type Location, type DriverLocation, watchLocation, stopWatchingLocation, updateDriverLocation } from "@/lib/location"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function DriverMapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [connectedStudents] = useState(12) // Mock data
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [stops, setStops] = useState<Array<{ lat: number; lng: number; name?: string; order?: number }>>([])
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(-1)
  const [isAddStopMode, setIsAddStopMode] = useState<boolean>(false)
  const [watchId, setWatchId] = useState<number | null>(null)
  // Map page does not control sharing; dashboard owns it

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/driver/login")
      return
    }
    if (user.type !== "driver") {
      router.push("/")
      return
    }
  }, [user, router])

  // Auto-start sharing on mount so tracking is always active on this page
  useEffect(() => {
    ;(async () => {
      if (!user?.busNumber) return
      if (!isLocationSharing) {
        await startSharing()
      }
    })()
  }, [user?.busNumber, isLocationSharing])

  // Passive local watcher: if sharing is active (controlled by dashboard), keep updating currentLocation here
  useEffect(() => {
    if (!isLocationSharing) {
      // If we previously had a local watch, stop it
      if (watchId !== null) {
        try { stopWatchingLocation(watchId) } catch {}
        setWatchId(null)
      }
      return
    }
    // Start a local watch to reflect live location on the map page
    const id = watchLocation((l) => {
      setCurrentLocation(l)
    })
    setWatchId(id)
    return () => {
      try { stopWatchingLocation(id) } catch {}
      setWatchId((prev) => (prev === id ? null : prev))
    }
  }, [isLocationSharing])

  // Load stops
  const loadStops = useCallback(async () => {
    try {
      const resp = await api('/api/driver/stops')
      if (resp && Array.isArray(resp.stops)) {
        setStops(resp.stops.map((s: any) => ({ lat: s.lat, lng: s.lng, name: s.name, order: s.order })))
        setCurrentStopIndex(Number.isInteger(resp.currentStopIndex) ? resp.currentStopIndex : -1)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadStops()
  }, [user, loadStops])

  // Start/Stop sharing handlers
  const startSharing = async () => {
    if (!user?.busNumber) return
    try {
      // Get an initial fix and publish immediately
      const loc = await getCurrentLocation()
      setCurrentLocation(loc)
      const payload: DriverLocation = {
        driverId: user.id,
        busNumber: user.busNumber || "",
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
        speed: 0,
        heading: 0,
      }
      await updateDriverLocation(payload)

      // Start watch and publish on updates
      const id = watchLocation(async (l) => {
        setCurrentLocation(l)
        const update: DriverLocation = {
          driverId: user.id,
          busNumber: user.busNumber || "",
          latitude: l.latitude,
          longitude: l.longitude,
          timestamp: l.timestamp,
          speed: 0,
          heading: 0,
        }
        try {
          await updateDriverLocation(update)
        } catch (e) {
          // ignore transient errors; will retry on next update
        }
      })
      setWatchId(id)
      setIsLocationSharing(true)
      localStorage.setItem('driver_location_sharing', 'on')
      try { await api('/api/driver/sharing', { method: 'POST', body: { isSharing: true } }) } catch {}
    } catch (e) {
      console.error('Failed to start sharing:', e)
    }
  }

  const stopSharing = async () => {
    if (watchId !== null) {
      try { stopWatchingLocation(watchId) } catch {}
      setWatchId(null)
    }
    setIsLocationSharing(false)
    if (typeof window !== 'undefined') localStorage.setItem('driver_location_sharing', 'off')
    try { await api('/api/driver/sharing', { method: 'POST', body: { isSharing: false } }) } catch {}
  }

  // Fetch school coordinates to show route from driver to school (same behavior as student map)
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

  // Add stop mode: clicking on map adds a stop
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (!isAddStopMode) return
    const name = typeof window !== 'undefined' ? prompt('Stop name (optional):') || undefined : undefined
    try {
      await api('/api/driver/stops', { method: 'POST', body: { lat, lng, name } })
      await loadStops()
    } catch (e) {
      // ignore
    } finally {
      setIsAddStopMode(false)
    }
  }, [isAddStopMode, loadStops])

  // Add a stop at the driver's current GPS location
  const handleAddStopAtCurrent = useCallback(async () => {
    if (!currentLocation) return
    const { latitude: lat, longitude: lng } = currentLocation
    const name = typeof window !== 'undefined' ? prompt('Stop name (optional):') || undefined : undefined
    try {
      await api('/api/driver/stops', { method: 'POST', body: { lat, lng, name } })
      await loadStops()
    } catch {
      // ignore
    }
  }, [currentLocation, loadStops])

  // Mark arrival at next stop
  const handleArriveNext = useCallback(async () => {
    const nextIndex = (currentStopIndex ?? -1) + 1
    if (nextIndex < 0 || nextIndex >= stops.length) return
    try {
      await api('/api/driver/stops/arrive', { method: 'POST', body: { stopIndex: nextIndex } })
      await loadStops()
    } catch {}
  }, [currentStopIndex, stops.length, loadStops])

  // One-time locate action to fetch current position and show marker
  const handleLocateMe = useCallback(async () => {
    try {
      const loc = await getCurrentLocation()
      setCurrentLocation(loc)
    } catch (e) {
      // ignore; permission may be denied
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/driver">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg">Driver Map</h1>
            <p className="text-sm text-muted-foreground">Bus {user.busNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLocationSharing ? "default" : "secondary"}>{isLocationSharing ? "Sharing" : "Offline"}</Badge>
        </div>
      </header>

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <GoogleMap
          driverLocation={
            currentLocation
              ? {
                  driverId: user.id,
                  busNumber: user.busNumber || "",
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  timestamp: currentLocation.timestamp,
                  speed: 0,
                  heading: 0,
                }
              : null
          }
          schoolLocation={schoolCoords}
          showRoute
          stops={stops}
          currentStopIndex={currentStopIndex}
          onLocationSelect={handleMapClick}
          className="w-full h-full"
          />
        </div>

        {/* Floating Status Card */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Power className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Location Sharing</h3>
                      <Badge variant={isLocationSharing ? "default" : "secondary"}>
                        {isLocationSharing ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isLocationSharing ? "Students can track your location" : "Location sharing disabled"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold text-primary">{connectedStudents}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-20 right-4 z-10 space-y-2">
          <Button size="icon" variant="secondary" className="shadow-lg" onClick={() => setIsAddStopMode((v) => !v)} title={isAddStopMode ? 'Click on map to add stop' : 'Add Stop by tapping map'}>
            <Navigation className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="shadow-lg" onClick={handleLocateMe} title="Locate me">
            <Locate className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="shadow-lg" onClick={handleAddStopAtCurrent} disabled={!currentLocation} title="Add stop at my current location">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="shadow-lg" disabled={currentStopIndex + 1 >= stops.length} onClick={handleArriveNext} title="Mark arrived at next stop">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {/* No Location Message */}
        {!currentLocation && !isLocationSharing && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Card className="mx-4 shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Location Access Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable location sharing to show your position to students.
                </p>
                <Button asChild>
                  <a href="/dashboard/driver">Go to Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="map" userType="driver" />
    </div>
  )
}
