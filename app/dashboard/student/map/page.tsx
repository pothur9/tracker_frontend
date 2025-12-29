"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, RefreshCw, Bus, Locate, Lock, CreditCard, CheckCircle, Shield, Bell, Loader2, AlertCircle } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { TopNavigation } from "@/components/top-navigation"
import { ConnectionStatus } from "@/components/connection-status"
import { useAuth } from "@/hooks/use-auth"
import { useRealTimeLocation } from "@/hooks/use-real-time-location"
import { useSubscription } from "@/hooks/use-subscription"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

const SUBSCRIPTION_AMOUNT = 100
const SUBSCRIPTION_DURATION = "3 months"

export default function StudentMapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { hasActiveSubscription, subscription, isLoading: subscriptionLoading, refresh } = useSubscription()
  const [schoolCoords, setSchoolCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [stops, setStops] = useState<Array<{ lat: number; lng: number; name?: string; order?: number }>>([])
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const {
    location: driverLocation,
    connectionStatus,
    isLoading,
    forceReconnect,
  } = useRealTimeLocation(user?.busNumber || null)

  // Load Razorpay script
  useEffect(() => {
    if (!hasActiveSubscription && !subscriptionLoading) {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => setRazorpayLoaded(true)
      document.body.appendChild(script)
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [hasActiveSubscription, subscriptionLoading])

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

  const handleSubscribe = async () => {
    if (!razorpayLoaded) {
      toast({
        title: "Please wait",
        description: "Payment system is loading...",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const orderResponse = await api("/api/payment/create-order", {
        method: "POST",
      })

      if (!orderResponse.orderId) {
        throw new Error("Failed to create order")
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Ambari Bus Tracker",
        description: `${SUBSCRIPTION_DURATION} Subscription`,
        order_id: orderResponse.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await api("/api/payment/verify", {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            })

            if (verifyResponse.success) {
              toast({
                title: "Payment Successful!",
                description: "Your subscription is now active. You can now view the bus location.",
              })
              refresh()
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: user?.name || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#f59e0b",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to initiate payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return null
  }

  // Full Subscription Page - Show when no active subscription
  if (!subscriptionLoading && !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex flex-col">
        <Navbar showBackButton backUrl="/dashboard/student" />
        <TopNavigation activeTab="map" userType="student" />

        <div className="flex-1 overflow-auto p-4">
          {/* Subscription Plan Card */}
          <Card className="max-w-md mx-auto border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <Badge className="w-fit mx-auto mb-2 bg-amber-500">Premium Required</Badge>
              <CardTitle className="text-xl font-serif">Subscribe to View Map</CardTitle>
              <CardDescription>Track your child's bus in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Price */}
              <div className="text-center py-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-amber-800">₹{SUBSCRIPTION_AMOUNT}</span>
                  <span className="text-muted-foreground">/ {SUBSCRIPTION_DURATION}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 bg-white/60 rounded-lg">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Live Bus Location</p>
                    <p className="text-xs text-muted-foreground">Track bus on map in real-time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-white/60 rounded-lg">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Route Notifications</p>
                    <p className="text-xs text-muted-foreground">Get alerts when bus is nearby</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-white/60 rounded-lg">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Safety First</p>
                    <p className="text-xs text-muted-foreground">Know your child is safe</p>
                  </div>
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing || !razorpayLoaded}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Subscribe Now - ₹{SUBSCRIPTION_AMOUNT}
                  </>
                )}
              </Button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure payment by Razorpay</span>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="max-w-md mx-auto mt-4 border-amber-200/60 bg-amber-50/30">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p>• Valid for {SUBSCRIPTION_DURATION} from payment</p>
                  <p>• No auto-renewal required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                <p className="text-sm text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  )
}
