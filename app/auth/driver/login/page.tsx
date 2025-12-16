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
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/translations"
import { LanguageSelector } from "@/components/language-selector"

export default function DriverLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />
      
      <div className="max-w-md mx-auto p-4 pt-8">
        <Card className="border-amber-200/60 bg-amber-50/30">
          <CardHeader className="text-center">
            <div className="flex justify-end mb-2">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl font-serif">{getTranslation('driverLogin.title', language)}</CardTitle>
            <CardDescription>{getTranslation('driverLogin.description', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">{getTranslation('studentLogin.phoneLabel', language)}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={getTranslation('studentLogin.phonePlaceholder', language)}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground">{getTranslation('studentLogin.phoneHelper', language)}</p>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-primary">
                  <strong>{getTranslation('studentLogin.secureLogin', language)}</strong> {getTranslation('studentLogin.secureLoginDesc', language)}
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
                    {getTranslation('studentLogin.sendingOTP', language)}
                  </>
                ) : (
                  getTranslation('studentLogin.sendOTP', language)
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  {getTranslation('studentLogin.noAccount', language)}{" "}
                  <Link href="/auth/driver/signup" className="text-primary hover:underline">
                    {getTranslation('studentLogin.signUp', language)}
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
