"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Navigation, Crosshair, MapPin } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/google-map"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { getDriverLocation, getCurrentLocation, locationService, type DriverLocation, type Location } from "@/lib/location"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"

export default function StudentMapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [stops, setStops] = useState<Array<{ lat: number; lng: number; name?: string; order?: number }>>([])
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(-1)

  // Redirect if not authenticated
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

  // Fetch initial locations and subscribe for real-time driver updates
  useEffect(() => {
    let unsub: (() => void) | null = null
    const init = async () => {
      if (!user?.busNumber) return
      try {
        // Initial driver location to render quickly
        const driverLoc = await getDriverLocation(user.busNumber)
        setDriverLocation(driverLoc)
      } catch (e) {
        // benign
      }
      try {
        const userLoc = await getCurrentLocation()
        setUserLocation(userLoc)
      } catch (e) {
        // user may deny location; map still works
      }
      // Subscribe for real-time updates via polling service
      unsub = locationService.subscribe(user.busNumber, (loc) => {
        setDriverLocation(loc)
        setIsLoading(false)
      })
    }
    init()
    return () => {
      if (unsub) unsub()
    }
  }, [user?.busNumber])

  // Load stops and current stop index so students see the same route state as the driver
  useEffect(() => {
    if (!user?.busNumber) return
    let cancelled = false
    const loadStops = async () => {
      try {
        const resp = await api(`/api/driver/stops/public?busNumber=${encodeURIComponent(user.busNumber!)}`)
        if (cancelled) return
        if (resp && Array.isArray(resp.stops)) {
          setStops(resp.stops.map((s: any) => ({ lat: s.lat, lng: s.lng, name: s.name, order: s.order })))
          setCurrentStopIndex(Number.isInteger(resp.currentStopIndex) ? resp.currentStopIndex : -1)
        } else {
          setStops([])
          setCurrentStopIndex(-1)
        }
      } catch (e) {
        // If driver is offline (403), clear stops gracefully
        setStops([])
        setCurrentStopIndex(-1)
      }
    }
    loadStops()
    const id = setInterval(loadStops, 30000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [user?.busNumber])

  // Fetch school coordinates to show route like Uber pickup-drop view
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

  const handleGetDirections = () => {
    if (!driverLocation) return

    const url = `https://www.google.com/maps/dir/?api=1&destination=${driverLocation.latitude},${driverLocation.longitude}`
    window.open(url, "_blank")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg">Full Map View</h1>
            <p className="text-sm text-muted-foreground">Bus {user.busNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGetDirections} disabled={!driverLocation}>
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
        </div>
      </header>

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        {/* Ensure map fills the viewport like Uber */}
        <div className="absolute inset-0">
          <GoogleMap
            driverLocation={driverLocation}
            schoolLocation={schoolCoords}
            showRoute
            stops={stops}
            currentStopIndex={currentStopIndex}
            className="w-full h-full"
          />
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-20 space-y-2">
          <Button
            size="icon"
            variant="secondary"
            className="shadow-lg"
            onClick={() => {
              // Center on user location if available
              if (userLocation) {
                // This would require exposing map methods from GoogleMap component
                console.log("Center on user location")
              }
            }}
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Ride Info (Uber-like) */}
        <div className="absolute top-4 left-4 right-4 z-20">
          {driverLocation ? (
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
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(driverLocation.speed || 0)} km/h • Updated {new Date(driverLocation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-lg font-bold text-primary">~ {driverLocation.speed ? Math.max(1, Math.round((2.3 / Math.max(1, driverLocation.speed)) * 60)) : "--"} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : !isLoading ? (
            <Card className="shadow-lg border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-destructive">Driver Not Active</h3>
                      <Badge variant="destructive">Offline</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bus {user.busNumber} is not currently sharing location
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-30">
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading locations...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="map" userType="student" />
    </div>
  )
}
