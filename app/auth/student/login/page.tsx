"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendOTP, checkUserExists } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { validatePhoneNumber } from "@/lib/validation"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/translations"
import { LanguageSelector } from "@/components/language-selector"

export default function StudentLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (user?.type === "student") {
      router.replace("/dashboard/student")
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
      // Check if user exists
      const userExists = await checkUserExists(phone)
      
      if (!userExists) {
        toast({
          title: "Account Not Found",
          description: "This number does not have an account. Please signup first.",
          variant: "destructive",
        })
        setIsLoading(false)
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push("/auth/student/signup")
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
        type: "student",
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
            <div className="flex justify-end mb-2">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
            <CardTitle className="text-2xl font-serif">{getTranslation('studentLogin.title', language)}</CardTitle>
            <CardDescription>{getTranslation('studentLogin.description', language)}</CardDescription>
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

              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-xs text-primary">
                  <strong>{getTranslation('studentLogin.secureLogin', language)}</strong> {getTranslation('studentLogin.secureLoginDesc', language)}
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
                  <Link href="/auth/student/signup" className="text-primary hover:underline">
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
