"use client"

import { useEffect, useRef, useState } from "react"
import type { DriverLocation } from "@/lib/location"
import { api } from "@/lib/api"

interface StopPoint { lat: number; lng: number; name?: string; order?: number }

interface GoogleMapProps {
  driverLocation?: DriverLocation | null
  className?: string
  onLocationSelect?: (lat: number, lng: number) => void
  schoolLocation?: { lat: number; lng: number } | null
  showRoute?: boolean
  stops?: StopPoint[]
  currentStopIndex?: number
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  onViewportChange?: (center: { lat: number; lng: number }, zoom: number) => void
  controlledViewport?: { center: { lat: number; lng: number }; zoom: number } | null
}

declare global {
  interface Window {
    google: any
    __googleMapsScriptLoading?: boolean
  }
}

export function GoogleMap({ className, driverLocation, onLocationSelect, schoolLocation = null, showRoute = true, stops = [], currentStopIndex = -1, initialCenter, initialZoom, onViewportChange, controlledViewport = null }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const markerElementRef = useRef<HTMLDivElement | null>(null)
  const busRotationRef = useRef<number>(0)
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const schoolMarkerRef = useRef<any>(null)
  const routeLineRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const stopMarkersRef = useRef<any[]>([])
  const stopPolylineRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  // Tracks whether the user has manually interacted with the map (zoom/drag),
  // in which case we should not auto-adjust viewport (zoom/center/fitBounds)
  const userAdjustedViewRef = useRef<boolean>(false)

  const isFiniteNumber = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n)
  const isValidLatLng = (lat: unknown, lng: unknown): lat is number & (typeof lng extends number ? number : never) => {
    return isFiniteNumber(lat) && isFiniteNumber(lng)
  }

  // Load Google Maps script (singleton)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.google) {
      // Ensure the core maps library is available
      if (window.google.maps?.importLibrary) {
        Promise.all([
          window.google.maps.importLibrary("maps"),
          window.google.maps.importLibrary("routes"),
          window.google.maps.importLibrary("geometry"),
          window.google.maps.importLibrary("marker"),
        ])
          .then(() => setIsLoaded(true))
          .catch(() => setIsLoaded(true))
      } else {
        setIsLoaded(true)
      }
      return
    }

    const existing = document.querySelector<HTMLScriptElement>("#google-maps-script")
    if (existing) {
      // If another component added it, wait for onload or poll for google
      if (existing.getAttribute("data-loaded") === "true") {
        setIsLoaded(true)
      } else {
        existing.addEventListener("load", () => setIsLoaded(true), { once: true })
      }
      return
    }

    if (window.__googleMapsScriptLoading) return
    window.__googleMapsScriptLoading = true

    // Prefer NEXT_PUBLIC_ for Next.js client exposure, but allow fallback to GOOGLE_MAPS_API_KEY
    const rawKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || (process.env as any).GOOGLE_MAPS_API_KEY
    const apiKey = typeof rawKey === "string" ? rawKey.trim() : ""
    if (!apiKey) {
      console.error(
        "Google Maps API key is missing. Create frontend/.env.local with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<YOUR_KEY> (ensure it starts with 'AIza') and restart the dev server."
      )
    }
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ""}&v=quarterly&loading=async&libraries=maps,routes,geometry,marker`
    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.src = src
    script.async = true
    script.defer = true
    script.addEventListener(
      "load",
      () => {
        script.setAttribute("data-loaded", "true")
        // After base script load, ensure the maps, routes and geometry libraries are imported
        if (window.google?.maps?.importLibrary) {
          Promise.all([
            window.google.maps.importLibrary("maps"),
            window.google.maps.importLibrary("routes"),
            window.google.maps.importLibrary("geometry"),
            window.google.maps.importLibrary("marker"),
          ])
            .then(() => setIsLoaded(true))
            .catch(() => setIsLoaded(true))
        } else {
          setIsLoaded(true)
        }
      },
      { once: true },
    )
    script.addEventListener(
      "error",
      () => {
        window.__googleMapsScriptLoading = false
      },
      { once: true },
    )
    document.head.appendChild(script)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return
    if (!window.google?.maps?.Map) return

    if (!mapInstanceRef.current) {
      const defaultCenter = initialCenter ?? { lat: 40.7128, lng: -74.006 } // New York City
      const center =
        driverLocation && isValidLatLng(driverLocation.latitude, driverLocation.longitude)
          ? { lat: driverLocation.latitude, lng: driverLocation.longitude }
          : defaultCenter

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: initialZoom ?? 17,
        center,
        // Use Google's 3D photorealistic map ID for light theme with 3D buildings
        mapId: "6ff586e93e18149f",
        // Enable 3D view with tilt
        tilt: 45,
        heading: 0,
        // Light theme styles - clean and minimal
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        // Enable rotation and tilt controls for 3D navigation
        rotateControl: true,
        tiltControl: true,
      })

      // Mark that the user has adjusted the view if they zoom or drag
      mapInstanceRef.current.addListener("zoom_changed", () => {
        userAdjustedViewRef.current = true
        if (onViewportChange) {
          const c = mapInstanceRef.current.getCenter()
          const z = mapInstanceRef.current.getZoom()
          if (c && typeof z === 'number') onViewportChange({ lat: c.lat(), lng: c.lng() }, z)
        }
      })
      mapInstanceRef.current.addListener("dragend", () => {
        userAdjustedViewRef.current = true
        if (onViewportChange) {
          const c = mapInstanceRef.current.getCenter()
          const z = mapInstanceRef.current.getZoom()
          if (c && typeof z === 'number') onViewportChange({ lat: c.lat(), lng: c.lng() }, z)
        }
      })

      // Add click listener if onLocationSelect is provided
      if (onLocationSelect) {
        mapInstanceRef.current.addListener("click", (event: any) => {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          onLocationSelect(lat, lng)
        })
      }

      // Initialize route line between driver and school (if any)
      routeLineRef.current = new window.google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: mapInstanceRef.current,
      })

      // Stop polyline removed - stops will show as individual markers only
    }
  }, [isLoaded, onLocationSelect, driverLocation])

  // Update marker when driver location changes
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !driverLocation) return

    if (!isValidLatLng(driverLocation.latitude, driverLocation.longitude)) return
    const position = { lat: driverLocation.latitude, lng: driverLocation.longitude }

    // Compute bearing between last and new
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const toDeg = (rad: number) => (rad * 180) / Math.PI
    const computeBearing = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
      const φ1 = toRad(from.lat)
      const φ2 = toRad(to.lat)
      const Δλ = toRad(to.lng - from.lng)
      const y = Math.sin(Δλ) * Math.cos(φ2)
      const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
      return (toDeg(Math.atan2(y, x)) + 360) % 360
    }

    // Ensure marker exists once
    if (!markerRef.current) {
      // Indian School Bus - Using PNG image
      const busIcon = {
        url: '/school-bus.png',
        scaledSize: new window.google.maps.Size(50, 50),
        anchor: new window.google.maps.Point(25, 25),
      }
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: busIcon,
        title: `Bus ${driverLocation.busNumber}`,
      })
      if (isValidLatLng(position.lat, position.lng)) {
        mapInstanceRef.current.setCenter(position)
      }
      lastPositionRef.current = position
      return
    }

    // Animate marker movement towards new position
    const start = lastPositionRef.current || position
    const end = position
    const duration = 900 // ms
    const startTime = performance.now()

    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const lat = start.lat + (end.lat - start.lat) * t
      const lng = start.lng + (end.lng - start.lng) * t
      markerRef.current.setPosition({ lat, lng })
      
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        lastPositionRef.current = end
      }
    }
    requestAnimationFrame(animate)

    // Keep map centered on the moving bus
    if (isValidLatLng(position.lat, position.lng) && !userAdjustedViewRef.current && !controlledViewport) {
      mapInstanceRef.current.setCenter(position)
    }

  }, [isLoaded, driverLocation, controlledViewport])

  // Update or place school marker and route line
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    // Handle school marker
    if (schoolLocation && isValidLatLng(schoolLocation.lat, schoolLocation.lng)) {
      const position = { lat: schoolLocation.lat, lng: schoolLocation.lng }
      if (!schoolMarkerRef.current) {
        // Indian School icon - realistic Indian school building image
        const schoolIcon = {
          url: '/indian-school.png',
          scaledSize: new window.google.maps.Size(60, 60),
          anchor: new window.google.maps.Point(30, 55),
        }
        schoolMarkerRef.current = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          icon: schoolIcon,
          title: "School",
        })
      } else {
        schoolMarkerRef.current.setPosition(position)
      }
    } else if (schoolMarkerRef.current) {
      schoolMarkerRef.current.setMap(null)
      schoolMarkerRef.current = null
    }

    // Handle route line between driver and school using server proxy first, then fallback to client DirectionsService
    if (
      showRoute &&
      routeLineRef.current &&
      driverLocation &&
      schoolLocation &&
      isValidLatLng(driverLocation.latitude, driverLocation.longitude) &&
      isValidLatLng(schoolLocation.lat, schoolLocation.lng)
    ) {
      const origin = new window.google.maps.LatLng(driverLocation.latitude, driverLocation.longitude)
      const destination = new window.google.maps.LatLng(schoolLocation.lat, schoolLocation.lng)

      const drawStraight = () => {
        routeLineRef.current.setPath([origin, destination])
        const b = new window.google.maps.LatLngBounds()
        b.extend(origin)
        b.extend(destination)
        if (!userAdjustedViewRef.current && !controlledViewport) {
          mapInstanceRef.current.fitBounds(b)
        }
      }

      const tryProxy = async () => {
        try {
          const q = new URLSearchParams({
            originLat: String(driverLocation.latitude),
            originLng: String(driverLocation.longitude),
            destLat: String(schoolLocation.lat),
            destLng: String(schoolLocation.lng),
          })
          const resp = await api(`/api/directions/drive?${q.toString()}`)
          if (resp?.polyline) {
            const decoded = window.google.maps.geometry?.encoding?.decodePath(resp.polyline)
            if (decoded && decoded.length) {
              routeLineRef.current.setPath(decoded)
              const hasValidBounds =
                resp.bounds &&
                Number.isFinite(resp.bounds.south) &&
                Number.isFinite(resp.bounds.west) &&
                Number.isFinite(resp.bounds.north) &&
                Number.isFinite(resp.bounds.east)
              if (hasValidBounds) {
                const sw = new window.google.maps.LatLng(resp.bounds.south, resp.bounds.west)
                const ne = new window.google.maps.LatLng(resp.bounds.north, resp.bounds.east)
                const bounds = new window.google.maps.LatLngBounds(sw, ne)
                if (!userAdjustedViewRef.current && !controlledViewport) {
                  mapInstanceRef.current.fitBounds(bounds)
                }
              } else {
                const b = new window.google.maps.LatLngBounds()
                decoded.forEach((p: any) => b.extend(p))
                if (!userAdjustedViewRef.current && !controlledViewport) {
                  mapInstanceRef.current.fitBounds(b)
                }
              }
              return true
            }
          }
        } catch (e) {
          // ignore and fallback
        }
        return false
      }

      const tryClient = () => {
        if (!directionsServiceRef.current) {
          directionsServiceRef.current = new window.google.maps.DirectionsService()
        }
        const attemptRoute = (attempt = 0) => {
          directionsServiceRef.current.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: false,
            },
            (result: any, status: any) => {
              const ok = status === "OK" || status === window.google.maps.DirectionsStatus?.OK
              if (ok && result?.routes?.[0]) {
                const route = result.routes[0]
                const path = route.overview_path
                if (Array.isArray(path)) {
                  routeLineRef.current.setPath(path)
                }
                if (route.bounds) {
                  const south = (route.bounds as any).south
                  const west = (route.bounds as any).west
                  const north = (route.bounds as any).north
                  const east = (route.bounds as any).east
                  if ([south, west, north, east].every((v) => Number.isFinite(v))) {
                    const bounds = new window.google.maps.LatLngBounds(
                      new window.google.maps.LatLng(south, west),
                      new window.google.maps.LatLng(north, east),
                    )
                    if (!userAdjustedViewRef.current && !controlledViewport) {
                      mapInstanceRef.current.fitBounds(bounds)
                    }
                  } else if (Array.isArray(path) && path.length) {
                    const b = new window.google.maps.LatLngBounds()
                    path.forEach((p: any) => b.extend(p))
                    if (!userAdjustedViewRef.current && !controlledViewport) {
                      mapInstanceRef.current.fitBounds(b)
                    }
                  }
                }
                return
              }
              const transient = status === "UNKNOWN_ERROR" || status === "OVER_QUERY_LIMIT"
              if (transient && attempt < 3) {
                const delay = Math.pow(2, attempt) * 500
                setTimeout(() => attemptRoute(attempt + 1), delay)
                return
              }
              console.warn("DirectionsService failed, falling back to straight line:", status, result)
              drawStraight()
            },
          )
        }
        attemptRoute(0)
      }

      ;(async () => {
        const ok = await tryProxy()
        if (!ok) {
          tryClient()
        }
      })()
    } else if (routeLineRef.current && routeLineRef.current.setPath) {
      routeLineRef.current.setPath([])
    }
  }, [isLoaded, schoolLocation, showRoute, driverLocation])

  // Render stop markers and polyline when stops change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    // Clear existing stop markers
    if (stopMarkersRef.current.length) {
      stopMarkersRef.current.forEach((m) => m.setMap(null))
      stopMarkersRef.current = []
    }

    // Sort stops by order if present; fallback to input order
    const sorted = Array.isArray(stops)
      ? [...stops].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : []

    // Create markers
    sorted.forEach((s, idx) => {
      if (!Number.isFinite(s.lat) || !Number.isFinite(s.lng)) return
      const isCurrent = idx === currentStopIndex
      const icon = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z",
        fillColor: isCurrent ? "#ef4444" : "#f59e0b",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.3,
        anchor: new window.google.maps.Point(12, 20),
      }
      const marker = new window.google.maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map: mapInstanceRef.current,
        icon,
        title: s.name ? `Stop ${idx + 1}: ${s.name}` : `Stop ${idx + 1}`,
        label: { text: String(idx + 1), color: "#111827", fontSize: "12px", fontWeight: "700" },
      })
      stopMarkersRef.current.push(marker)
    })

    // Polyline removed - stops show as individual markers only

    // Optionally fit bounds to include stops if no driver location
    if ((!driverLocation || !Number.isFinite(driverLocation.latitude) || !Number.isFinite(driverLocation.longitude)) && sorted.length) {
      const b = new window.google.maps.LatLngBounds()
      sorted.forEach((s) => {
        if (Number.isFinite(s.lat) && Number.isFinite(s.lng)) b.extend(new window.google.maps.LatLng(s.lat, s.lng))
      })
      try { if (!userAdjustedViewRef.current && !controlledViewport) { mapInstanceRef.current.fitBounds(b) } } catch {}
    }
  }, [isLoaded, stops, currentStopIndex, driverLocation, controlledViewport])

  // Apply externally controlled viewport if provided (student mirroring driver)
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !controlledViewport) return
    const { center, zoom } = controlledViewport
    if (Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
      mapInstanceRef.current.setCenter(center)
    }
    if (Number.isFinite(zoom)) {
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [isLoaded, controlledViewport])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
