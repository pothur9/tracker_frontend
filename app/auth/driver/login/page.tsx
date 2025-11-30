"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendOTP, checkDriverExists } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { validatePhoneNumber } from "@/lib/validation"
import { Navbar } from "@/components/navbar"

export default function DriverLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (user?.type === "driver") {
      router.replace("/dashboard/driver")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phone)
    if (!phoneValidation.isValid) {
      toast({
        title: "Invalid Phone Number",
        description: phoneValidation.error,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check if driver exists
      const driverExists = await checkDriverExists(phone)
      
      if (!driverExists) {
        toast({
          title: "Account Not Found",
          description: "This number does not have an account. Please signup first.",
          variant: "destructive",
        })
        setIsLoading(false)
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push("/auth/driver/signup")
        }, 2000)
        return
      }

      // Send OTP
      const sessionId = await sendOTP(phone)
      
      if (!sessionId) {
        throw new Error("Failed to send OTP")
      }

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      })

      // Store login data and redirect to OTP verification
      localStorage.setItem("otpLoginData", JSON.stringify({
        phone,
        type: "driver",
        isLogin: true,
        sessionId,
      }))

      router.push("/auth/verify-otp")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar showBackButton backUrl="/" />
      
      <div className="max-w-md mx-auto p-4 pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl font-serif">Driver Login</CardTitle>
            <CardDescription>Sign in to start sharing your location with students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground">10 digits starting with 6-9</p>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Secure Login:</strong> We'll send a one-time password (OTP) to your phone number for verification.
                </p>
              </div>

              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="text-xs text-accent-foreground">
                  <strong>Driver Responsibilities:</strong> Ensure location sharing is enabled during school hours for student safety.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have a driver account?{" "}
                  <Link href="/auth/driver/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
