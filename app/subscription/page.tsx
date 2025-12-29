"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, MapPin, Bell, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { Navbar } from "@/components/navbar"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

const SUBSCRIPTION_AMOUNT = 100 // ₹100
const SUBSCRIPTION_DURATION = "3 months"

export default function SubscriptionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { hasActiveSubscription, subscription, isLoading: subscriptionLoading, refresh } = useSubscription()
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/student/login")
    }
  }, [user, router])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

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
      // Create order
      const orderResponse = await api("/api/payment/create-order", {
        method: "POST",
      })

      if (!orderResponse.orderId) {
        throw new Error("Failed to create order")
      }

      // Open Razorpay checkout
      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Ambari Bus Tracker",
        description: `${SUBSCRIPTION_DURATION} Subscription`,
        order_id: orderResponse.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
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
                description: "Your subscription is now active.",
              })
              refresh()
              // Redirect to dashboard after short delay
              setTimeout(() => {
                router.push("/dashboard/student")
              }, 1500)
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
          color: "#f59e0b", // Amber color to match app theme
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/dashboard/student" />

      <div className="max-w-md mx-auto p-4 pt-6">
        {/* Active Subscription Card */}
        {hasActiveSubscription && subscription && (
          <Card className="mb-6 border-green-200 bg-green-50/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800">Subscription Active</h3>
                  <p className="text-sm text-green-700">
                    {subscription.daysRemaining} days remaining
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-200 text-green-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plan Card */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
          <CardHeader className="text-center pb-4">
            <Badge className="w-fit mx-auto mb-2 bg-amber-500">Premium Plan</Badge>
            <CardTitle className="text-2xl font-serif">Bus Tracker Subscription</CardTitle>
            <CardDescription>Track your child's bus in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price */}
            <div className="text-center py-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-amber-800">₹{SUBSCRIPTION_AMOUNT}</span>
                <span className="text-muted-foreground">/ {SUBSCRIPTION_DURATION}</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Live Bus Location</p>
                  <p className="text-sm text-muted-foreground">Track bus on map in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Route Notifications</p>
                  <p className="text-sm text-muted-foreground">Get alerts when bus is nearby</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Safety First</p>
                  <p className="text-sm text-muted-foreground">Know your child is safe</p>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            {!hasActiveSubscription && (
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing || subscriptionLoading || !razorpayLoaded}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Subscribe Now - ₹{SUBSCRIPTION_AMOUNT}</>
                )}
              </Button>
            )}

            {hasActiveSubscription && (
              <Button
                onClick={() => router.push("/dashboard/student/map")}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <MapPin className="mr-2 h-5 w-5" />
                View Bus Location
              </Button>
            )}

            {/* Payment Security Note */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure payment by Razorpay</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="mt-4 border-amber-200/60 bg-amber-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-amber-800 mb-1">About Subscription</p>
                <p>• Valid for {SUBSCRIPTION_DURATION} from payment date</p>
                <p>• Access to live bus tracking on map</p>
                <p>• No auto-renewal, manual renewal required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
