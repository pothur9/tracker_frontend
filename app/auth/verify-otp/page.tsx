"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bus, Loader2, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { verifyOTP, signUp, sendOTP } from "@/lib/auth"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getFcmToken } from "@/lib/fcm"

export default function VerifyOTPPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otp, setOtp] = useState("")
  const [signupData, setSignupData] = useState<any>(null)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const data = sessionStorage.getItem("signupData")
    if (!data) {
      router.push("/")
      return
    }
    setSignupData(JSON.parse(data))
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const isValid = await verifyOTP(signupData.phone, otp, signupData.type === "driver" ? "driver" : "student")

      if (isValid) {
        // Get FCM token before creating the account so backend stores it
        let fcmToken: string | null = null
        try {
          fcmToken = await getFcmToken()
        } catch {}
        // Create the user account with optional fcmToken
        await signUp({ ...signupData, fcmToken: fcmToken || undefined })

        // If student selected a school, map it to the account
        if (signupData.type === "student" && signupData.schoolId) {
          try {
            await api("/api/school/map/user", {
              method: "POST",
              body: { schoolId: signupData.schoolId },
            })
          } catch (e) {
            // Non-blocking: mapping failure shouldn't prevent account creation
            console.warn("School mapping failed:", e)
          }
        }
        // If driver selected a school, map it to the account
        if (signupData.type === "driver" && signupData.schoolId) {
          try {
            await api("/api/school/map/driver", {
              method: "POST",
              body: { schoolId: signupData.schoolId },
            })
          } catch (e) {
            console.warn("Driver school mapping failed:", e)
          }
        }

        toast({
          title: "Account Created!",
          description: `Your ${signupData.type} account has been successfully created.`,
        })

        // Clear signup data
        sessionStorage.removeItem("signupData")

        // Redirect based on user type
        if (signupData.type === "student") {
          router.push("/dashboard/student")
        } else {
          router.push("/dashboard/driver")
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsResending(true)

    try {
      await sendOTP(signupData.phone, signupData.type === "driver" ? "driver" : "student")
      setCountdown(60)
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your phone.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const getBackUrl = () => {
    if (!signupData) return "/"
    return signupData.type === "student" ? "/auth/student/signup" : "/auth/driver/signup"
  }

  if (!signupData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Link href={getBackUrl()}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-serif font-bold">TrackBus</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {signupData.type === "student" ? (
                <Users className="h-8 w-8 text-primary" />
              ) : (
                <MapPin className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-serif">Verify Phone Number</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to {signupData.phone}
              {signupData.type === "driver" && (
                <span className="block mt-1 text-accent">Driver Account Verification</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground text-center">For demo purposes, use: 123456</p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  `Create ${signupData.type === "student" ? "Student" : "Driver"} Account`
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className="text-primary"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
