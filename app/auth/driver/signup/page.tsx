"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendOTP, checkDriverExists } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { validatePhoneNumber } from "@/lib/validation"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/translations"
import { LanguageSelector } from "@/components/language-selector"

export default function DriverSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [allSchools, setAllSchools] = useState<{ id: string; schoolName: string; district: string }[]>([])
  const [filteredSchools, setFilteredSchools] = useState<{ id: string; schoolName: string }[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [districts, setDistricts] = useState<string[]>([])
  const [formData, setFormData] = useState({
    schoolName: "",
    name: "",
    phone: "",
    busNumber: "",
  })

  // Load districts from JSON file
  useEffect(() => {
    fetch('/districts.json')
      .then(res => res.json())
      .then(data => {
        // For Karnataka districts - you can change this to any state
        const karnatakaDistricts = data['Karnataka'] || []
        setDistricts(karnatakaDistricts)
      })
      .catch(e => console.error('Failed to load districts:', e))
  }, [])

  // Load all schools
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api("/api/school")
        if (!cancelled) {
          setAllSchools(Array.isArray(data) ? data.map((s: any) => ({ id: s.id, schoolName: s.schoolName, district: s.district })) : [])
        }
      } catch (e) {
        // ignore
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Filter schools when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = allSchools.filter(s => s.district === selectedDistrict)
      setFilteredSchools(filtered)
    } else {
      setFilteredSchools(allSchools)
    }
  }, [selectedDistrict, allSchools])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!selectedDistrict.trim()) {
      toast({ title: "Error", description: "Please select a district", variant: "destructive" })
      return false
    }
    if (!formData.schoolName.trim()) {
      toast({ title: "Error", description: "Please select your school", variant: "destructive" })
      return false
    }
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Please enter your full name", variant: "destructive" })
      return false
    }
    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phone)
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
      // Check if driver already exists
      const driverExists = await checkDriverExists(formData.phone)
      
      if (driverExists) {
        toast({
          title: "Account Already Exists",
          description: "An account with this number already exists. Please login instead.",
          variant: "destructive",
        })
        setIsLoading(false)
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/driver/login")
        }, 2000)
        return
      }

      // Send OTP using 2factor API
      const sessionId = await sendOTP(formData.phone)
      
      if (!sessionId) {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Store form data and sessionId for OTP verification
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          ...formData,
          schoolCity: selectedDistrict, // Add schoolCity from selected district
          schoolId: selectedSchoolId || undefined,
          type: "driver",
          sessionId,
        }),
      )

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      })

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
      
      <div className="max-w-md mx-auto w-full p-4 sm:p-6 pt-8">
        <Card className="w-full">
          <CardHeader className="text-center pb-4 px-4 sm:px-6">
            <div className="flex justify-end mb-2">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
            <CardTitle className="text-2xl font-serif">{getTranslation('driverSignup.title', language)}</CardTitle>
            <CardDescription>{getTranslation('driverSignup.description', language)}</CardDescription>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 px-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : "1"}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${currentStep === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                  Basic Info
                </span>
              </div>
              <div className={`h-0.5 w-8 sm:w-12 ${currentStep === 2 ? "bg-primary" : "bg-muted"}`} />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <span className={`text-xs sm:text-sm font-medium ${currentStep === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                  Account Setup
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* District Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="district">{getTranslation('driverSignup.district', language)}</Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* School Name */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">{getTranslation('studentSignup.schoolName', language)}</Label>
                    <Select
                      value={selectedSchoolId}
                      onValueChange={(value) => {
                        setSelectedSchoolId(value)
                        const sel = filteredSchools.find((s: any) => s.id === value)
                        if (sel) {
                          handleInputChange("schoolName", sel.schoolName)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSchools.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.schoolName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Driver Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{getTranslation('driverSignup.driverName', language)}</Label>
                    <Input
                      id="name"
                      placeholder={getTranslation('driverSignup.driverName', language)}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="button" onClick={handleNextStep} className="w-full" size="lg">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Account Setup */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">{getTranslation('studentLogin.phoneLabel', language)}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={getTranslation('studentLogin.phonePlaceholder', language)}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-muted-foreground">{getTranslation('studentLogin.phoneHelper', language)}</p>
                  </div>

                  {/* Bus Number */}
                  <div className="space-y-2">
                    <Label htmlFor="busNumber">{getTranslation('studentSignup.busNumber', language)}</Label>
                    <Input
                      id="busNumber"
                      placeholder="Enter bus number (e.g., BUS001)"
                      value={formData.busNumber}
                      onChange={(e) => handleInputChange("busNumber", e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-xs text-primary">
                      <strong>Secure Signup:</strong> We'll send a one-time password (OTP) to your phone number to verify your account.
                    </p>
                  </div>

                  <div className=" gap-3 w-full">
                    
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {getTranslation('studentSignup.creating', language)}
                        </>
                      ) : (
                        getTranslation('studentSignup.createAccount', language)
                      )}
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="w-full mt-4" size="lg">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </div>

                  <div className="bg-accent/10 p-3 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> As a driver, you'll be able to share your real-time location with students and
                      parents assigned to your bus route.
                    </p>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {getTranslation('studentSignup.haveAccount', language)}{" "}
                <Link href="/auth/driver/login" className="text-primary hover:underline">
                  {getTranslation('studentSignup.login', language)}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
