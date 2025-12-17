import { api } from "./api"

export interface Location {
  latitude: number
  longitude: number
  timestamp: Date
  accuracy?: number
}

export interface DriverLocation extends Location {
  driverId: string
  busNumber: string
  speed?: number
  heading?: number
}

export interface Viewport {
  center: { lat: number; lng: number }
  zoom: number
}

// No local mock storage; we use backend now

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    // Check if running in Android WebView with native location bridge
    const androidBridge = (window as any).AndroidLocation

    if (androidBridge && typeof androidBridge.getLocation === 'function') {
      console.log('[Location] Using Android native location bridge')

      try {
        const result = androidBridge.getLocation()
        const data = JSON.parse(result)

        if (data.error) {
          console.error('[Location] Android bridge error:', data.error)
          // If permission not granted, try to request it
          if (data.error.includes('permission') && typeof androidBridge.requestPermission === 'function') {
            androidBridge.requestPermission()
          }
          reject(new Error(data.error))
          return
        }

        console.log('[Location] Got location from Android:', data)
        resolve({
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(data.timestamp || Date.now()),
          accuracy: data.accuracy,
        })
        return
      } catch (e) {
        console.error('[Location] Failed to parse Android location:', e)
        // Fall through to browser geolocation
      }
    }

    // Fall back to browser geolocation
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        const code = (error as GeolocationPositionError)?.code
        if (code === 1) reject(new Error("Location permission denied. Enable location permissions for this site."))
        else if (code === 2) reject(new Error("Location unavailable. Turn on GPS/location services and try again."))
        else if (code === 3) reject(new Error("Location request timed out. Move to an open area or try again."))
        else reject(new Error(error?.message || "Failed to access location"))
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )
  })
}

export const watchLocation = (callback: (location: Location) => void): number => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported")
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy,
      })
    },
    (error) => {
      console.error("Location error:", error)
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    },
  )
}

export const stopWatchingLocation = (watchId: number): void => {
  navigator.geolocation.clearWatch(watchId)
}

export const ensureGeolocationReady = async (): Promise<void> => {
  if (typeof window === 'undefined') throw new Error('Location not available in this context')
  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator
  if (!isSupported) throw new Error('Geolocation is not supported')
  const isLocalhost = typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  if (!isLocalhost && typeof window !== 'undefined' && !(window as any).isSecureContext) throw new Error('Location requires HTTPS. Open the site over https://')
  const navAny = navigator as any
  if (navAny?.permissions?.query) {
    try {
      const status = await navAny.permissions.query({ name: 'geolocation' })
      if (status?.state === 'denied') throw new Error('Location permission denied. Enable it in browser settings.')
    } catch { }
  }
}

export interface LocationConnectionStatus {
  isConnected: boolean
  lastUpdate: Date | null
  error: string | null
  reconnectAttempts: number
}

export interface RealTimeLocationService {
  subscribe: (busNumber: string, callback: (location: DriverLocation | null) => void) => () => void
  getConnectionStatus: () => LocationConnectionStatus
  forceReconnect: () => void
}

class LocationTrackingService implements RealTimeLocationService {
  private subscriptions: Map<string, Set<(location: DriverLocation | null) => void>> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private connectionStatus: LocationConnectionStatus = {
    isConnected: false,
    lastUpdate: null,
    error: null,
    reconnectAttempts: 0,
  }
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000

  subscribe(busNumber: string, callback: (location: DriverLocation | null) => void): () => void {
    // Add callback to subscriptions
    if (!this.subscriptions.has(busNumber)) {
      this.subscriptions.set(busNumber, new Set())
    }
    this.subscriptions.get(busNumber)!.add(callback)

    // Start polling for this bus if not already started
    if (!this.intervals.has(busNumber)) {
      this.startPolling(busNumber)
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(busNumber)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.stopPolling(busNumber)
          this.subscriptions.delete(busNumber)
        }
      }
    }
  }

  private async startPolling(busNumber: string) {
    const poll = async () => {
      try {
        const location = await getDriverLocation(busNumber)

        if (!location) {
          // No location available yet (e.g., driver offline). Treat as offline, notify with null.
          const callbacks = this.subscriptions.get(busNumber)
          if (callbacks) {
            callbacks.forEach((callback) => callback(null))
          }

          this.connectionStatus = {
            isConnected: false,
            lastUpdate: this.connectionStatus.lastUpdate,
            error: null,
            reconnectAttempts: this.connectionStatus.reconnectAttempts + 1,
          }

          // Attempt reconnection with backoff
          if (this.connectionStatus.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              if (this.intervals.has(busNumber)) poll()
            }, this.reconnectDelay * this.connectionStatus.reconnectAttempts)
          }
          return
        }

        // Update connection status when we have a valid location
        this.connectionStatus = {
          isConnected: true,
          lastUpdate: new Date(),
          error: null,
          reconnectAttempts: 0,
        }

        // Notify all subscribers with latest location
        const callbacks = this.subscriptions.get(busNumber)
        if (callbacks) {
          callbacks.forEach((callback) => callback(location))
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        // Suppress noisy logs for expected "No location yet"/404 situations
        const benign = message.includes("No location yet") || message.includes("404")
        if (!benign) {
          console.error(`Failed to fetch location for ${busNumber}:`, error)
        }

        // Update connection status with error
        this.connectionStatus = {
          isConnected: false,
          lastUpdate: this.connectionStatus.lastUpdate,
          error: benign ? null : error instanceof Error ? error.message : "Unknown error",
          reconnectAttempts: this.connectionStatus.reconnectAttempts + 1,
        }

        // Attempt reconnection if under max attempts
        if (this.connectionStatus.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            if (this.intervals.has(busNumber)) {
              poll()
            }
          }, this.reconnectDelay * this.connectionStatus.reconnectAttempts)
        }
      }
    }

    // Start immediate poll and set interval
    poll()
    const interval = setInterval(poll, 10000) // Poll every 10 seconds
    this.intervals.set(busNumber, interval)
  }

  private stopPolling(busNumber: string) {
    const interval = this.intervals.get(busNumber)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(busNumber)
    }
  }

  getConnectionStatus(): LocationConnectionStatus {
    return { ...this.connectionStatus }
  }

  forceReconnect() {
    this.connectionStatus.reconnectAttempts = 0
    this.connectionStatus.error = null

    // Restart all active polling
    for (const busNumber of this.intervals.keys()) {
      this.stopPolling(busNumber)
      this.startPolling(busNumber)
    }
  }
}

export const locationService = new LocationTrackingService()

export const getDriverLocation = async (busNumber: string): Promise<DriverLocation | null> => {
  const resp = await api(`/api/location/latest?busNumber=${encodeURIComponent(busNumber)}`)
  if (!resp) return null
  const lat = typeof resp.lat === 'number' ? resp.lat : Number(resp.lat)
  const lng = typeof resp.lng === 'number' ? resp.lng : Number(resp.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return {
    driverId: "", // Not returned by API; not needed for map
    busNumber: resp.busNumber || busNumber,
    latitude: lat,
    longitude: lng,
    timestamp: new Date(resp.updatedAt || new Date().toISOString()),
    speed: 0,
    heading: 0,
  }
}

export const updateDriverLocation = async (location: DriverLocation): Promise<void> => {
  await api(
    "/api/location/driver/update",
    {
      method: "POST",
      body: {
        lat: location.latitude,
        lng: location.longitude,
        busNumber: location.busNumber,
      },
    },
  )
}

// --- Viewport sync helpers ---
export const updateDriverViewport = async (busNumber: string, viewport: Viewport): Promise<void> => {
  try {
    await api(
      "/api/location/viewport/update",
      {
        method: "POST",
        body: {
          busNumber,
          center: viewport.center,
          zoom: viewport.zoom,
        },
      },
    )
  } catch {
    // best-effort; ignore if endpoint not available
  }
}

export const getDriverViewport = async (busNumber: string): Promise<Viewport | null> => {
  try {
    const resp = await api(`/api/location/viewport/latest?busNumber=${encodeURIComponent(busNumber)}`)
    if (!resp || !resp.center) return null
    const lat = Number(resp.center.lat)
    const lng = Number(resp.center.lng)
    const zoom = Number(resp.zoom)
    if (![lat, lng, zoom].every((v) => Number.isFinite(v))) return null
    return { center: { lat, lng }, zoom }
  } catch {
    return null
  }
}

export interface RealTimeViewportService {
  subscribe: (busNumber: string, callback: (viewport: Viewport | null) => void) => () => void
}

class ViewportSyncService implements RealTimeViewportService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private subscribers: Map<string, Set<(v: Viewport | null) => void>> = new Map()

  subscribe(busNumber: string, callback: (viewport: Viewport | null) => void): () => void {
    if (!this.subscribers.has(busNumber)) {
      this.subscribers.set(busNumber, new Set())
    }
    this.subscribers.get(busNumber)!.add(callback)

    if (!this.intervals.has(busNumber)) {
      this.start(busNumber)
    }

    return () => {
      const set = this.subscribers.get(busNumber)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          this.stop(busNumber)
          this.subscribers.delete(busNumber)
        }
      }
    }
  }

  private start(busNumber: string) {
    const poll = async () => {
      const vp = await getDriverViewport(busNumber)
      const subs = this.subscribers.get(busNumber)
      if (subs) subs.forEach((cb) => cb(vp))
    }
    poll()
    const id = setInterval(poll, 3000)
    this.intervals.set(busNumber, id)
  }

  private stop(busNumber: string) {
    const id = this.intervals.get(busNumber)
    if (id) {
      clearInterval(id)
      this.intervals.delete(busNumber)
    }
  }
}

export const viewportService = new ViewportSyncService()
