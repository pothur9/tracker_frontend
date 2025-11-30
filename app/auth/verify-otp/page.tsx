"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { verifyOTP, signUp, sendOTP, signInWithOTP } from "@/lib/auth"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getFcmToken } from "@/lib/fcm"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"

export default function VerifyOTPPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otp, setOtp] = useState("")
  const [signupData, setSignupData] = useState<any>(null)
  const [loginData, setLoginData] = useState<any>(null)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    // Check for signup data
    const signup = sessionStorage.getItem("signupData")
    // Check for login data
    const login = localStorage.getItem("otpLoginData")
    
    if (!signup && !login) {
      router.push("/")
      return
    }
    
    if (signup) {
      setSignupData(JSON.parse(signup))
    }
    if (login) {
      setLoginData(JSON.parse(login))
    }
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 4) {
      toast({
        title: "Error",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      })
      return
    }

    const currentData = loginData || signupData
    if (!currentData?.sessionId) {
      toast({
        title: "Error",
        description: "Session expired. Please try again.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    setIsLoading(true)

    try {
      // Verify OTP using 2factor API
      const isValid = await verifyOTP(currentData.sessionId, otp)

      if (isValid) {
        // Handle login flow
        if (loginData) {
          // OTP already verified by 2factor API, now login with verified flag
          const loggedInUser = await signInWithOTP(loginData.phone, loginData.type)
          setUser(loggedInUser)

          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          })

          // Clear login data
          localStorage.removeItem("otpLoginData")

          // Redirect based on user type
          router.push(loginData.type === "student" ? "/dashboard/student" : "/dashboard/driver")
        } 
        // Handle signup flow
        else if (signupData) {
          try {
            // Get FCM token before creating the account so backend stores it
            let fcmToken: string | null = null
            try {
              fcmToken = await getFcmToken()
            } catch {}
            
            // Create the user account with optional fcmToken
            const newUser = await signUp({ ...signupData, fcmToken: fcmToken || undefined })
            setUser(newUser)

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
            router.push(signupData.type === "student" ? "/dashboard/student" : "/dashboard/driver")
          } catch (signupError: any) {
            // Check if error is due to existing account
            const errorMessage = signupError?.message || signupError?.error || String(signupError)
            if (errorMessage.toLowerCase().includes("already exists")) {
              toast({
                title: "Account Already Exists",
                description: `An account with this number already exists. Please login instead.`,
                variant: "destructive",
              })
              // Redirect to login page after a short delay
              setTimeout(() => {
                router.push(signupData.type === "student" ? "/auth/student/login" : "/auth/driver/login")
              }, 2000)
            } else {
              throw signupError // Re-throw if it's a different error
            }
          }
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
    const currentData = loginData || signupData

    try {
      // Send new OTP using 2factor API
      const newSessionId = await sendOTP(currentData.phone)
      
      if (newSessionId) {
        // Update sessionId
        if (loginData) {
          const updatedLoginData = { ...loginData, sessionId: newSessionId }
          setLoginData(updatedLoginData)
          localStorage.setItem("otpLoginData", JSON.stringify(updatedLoginData))
        } else if (signupData) {
          const updatedSignupData = { ...signupData, sessionId: newSessionId }
          setSignupData(updatedSignupData)
          sessionStorage.setItem("signupData", JSON.stringify(updatedSignupData))
        }
        
        setCountdown(60)
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your phone.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to resend OTP. Please try again.",
          variant: "destructive",
        })
      }
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
    if (loginData) {
      return loginData.type === "student" ? "/auth/student/login" : "/auth/driver/login"
    }
    if (signupData) {
      return signupData.type === "student" ? "/auth/student/signup" : "/auth/driver/signup"
    }
    return "/"
  }

  const currentData = loginData || signupData
  if (!currentData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar showBackButton backUrl={getBackUrl()} />
      
      <div className="max-w-md mx-auto p-4 pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {currentData.type === "student" ? (
                <Users className="h-8 w-8 text-primary" />
              ) : (
                <MapPin className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-serif">Verify Phone Number</CardTitle>
            <CardDescription>
              We've sent a 4-digit code to {currentData.phone}
              {currentData.type === "driver" && (
                <span className="block mt-1 text-accent">
                  {loginData ? "Driver Login Verification" : "Driver Account Verification"}
                </span>
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
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={4}
                  required
                />
                <p className="text-xs text-muted-foreground text-center">For demo purposes, use: 1234</p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : loginData ? (
                  "Verify & Login"
                ) : (
                  `Create ${currentData.type === "student" ? "Student" : "Driver"} Account`
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
