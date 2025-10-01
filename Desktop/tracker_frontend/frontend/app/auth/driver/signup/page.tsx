"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendOTP } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export default function DriverSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [schools, setSchools] = useState<{ id: string; schoolName: string }[]>([])
  const [schoolsLoading, setSchoolsLoading] = useState(true)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    special: false,
  })
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCity: "",
    name: "",
    phone: "",
    busNumber: "",
    password: "",
    confirmPassword: "",
  })

  // Load list of schools for dropdown
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        console.log('Fetching schools from:', `${process.env.NEXT_PUBLIC_API_BASE}/api/school`)
        const data = await api("/api/school")
        if (!cancelled) {
          const schoolList = Array.isArray(data) ? data.map((s: any) => ({ id: s.id, schoolName: s.schoolName })) : []
          setSchools(schoolList)
          setSchoolsLoading(false)
          console.log('✅ Successfully fetched schools:', schoolList.length, 'schools')
          if (schoolList.length > 0) {
            console.log('Schools:', schoolList.map(s => s.schoolName).join(', '))
          }
        }
      } catch (e) {
        console.error('❌ Error fetching schools:', e)
        if (!cancelled) {
          setSchoolsLoading(false)
          toast({
            title: "Warning",
            description: "Could not load schools. You can enter your school name manually.",
            variant: "default",
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Update password criteria when password changes
    if (field === "password") {
      setPasswordCriteria({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      })
    }
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string): boolean => {
    const hasLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    return hasLength && hasUppercase && hasSpecial
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate Step 1
    if (!formData.schoolName || !formData.schoolCity || !formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "Error",
        description: "Phone number must be 10 digits starting with 6-9",
        variant: "destructive",
      })
      return
    }

    setCurrentStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword(formData.password)) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters with one uppercase letter and one special character",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Send OTP via 2Factor API
      const sessionId = await sendOTP(formData.phone, "driver")

      // Store form data and session ID for OTP verification
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          ...formData,
          schoolId: selectedSchoolId || undefined,
          type: "driver",
          otpSessionId: sessionId,
        }),
      )

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      })

      router.push("/auth/verify-otp")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Link href="/">
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
            <CardTitle className="text-2xl font-serif">Driver Registration</CardTitle>
            <CardDescription>Create your driver account to start sharing location</CardDescription>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
                1
              </div>
              <div className={`h-0.5 w-12 ${currentStep === 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of 2: {currentStep === 1 ? 'Personal Information' : 'Bus & Password Details'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} className="space-y-4">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  {/* School Name */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School</Label>
                    {schoolsLoading ? (
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Loading schools..." />
                        </SelectTrigger>
                      </Select>
                    ) : (
                      <>
                        <Select
                          value={selectedSchoolId}
                          onValueChange={(value) => {
                            if (value === "other") {
                              setSelectedSchoolId(value)
                              handleInputChange("schoolName", "")
                            } else {
                              setSelectedSchoolId(value)
                              const sel = schools.find((s) => s.id === value)
                              handleInputChange("schoolName", sel?.schoolName || "")
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your school" />
                          </SelectTrigger>
                          <SelectContent>
                            {schools.length > 0 ? (
                              schools.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.schoolName}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No schools available
                              </SelectItem>
                            )}
                            <SelectItem value="other">Other (Enter manually)</SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedSchoolId === "other" && (
                          <Input
                            id="schoolNameManual"
                            placeholder="Enter your school name"
                            value={formData.schoolName}
                            onChange={(e) => handleInputChange("schoolName", e.target.value)}
                            required
                            className="mt-2"
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* School City */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolCity">School City</Label>
                    <Input
                      id="schoolCity"
                      placeholder="Enter school city"
                      value={formData.schoolCity}
                      onChange={(e) => handleInputChange("schoolCity", e.target.value)}
                      required
                    />
                  </div>

                  {/* Driver Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                        handleInputChange("phone", value)
                      }}
                      maxLength={10}
                      required
                    />
                    {formData.phone && !validatePhone(formData.phone) && (
                      <p className="text-xs text-destructive">Must be 10 digits starting with 6, 7, 8, or 9</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Bus & Password Details */}
              {currentStep === 2 && (
                <>
                  {/* Bus Number */}
                  <div className="space-y-2">
                    <Label htmlFor="busNumber">Bus Number</Label>
                    <Input
                      id="busNumber"
                      placeholder="Enter bus number (e.g., BUS001)"
                      value={formData.busNumber}
                      onChange={(e) => handleInputChange("busNumber", e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    {/* Password Criteria */}
                    <div className="text-xs space-y-1 mt-2">
                      <p className={passwordCriteria.length ? "text-green-600" : "text-muted-foreground"}>
                        {passwordCriteria.length ? "✓" : "○"} At least 8 characters
                      </p>
                      <p className={passwordCriteria.uppercase ? "text-green-600" : "text-muted-foreground"}>
                        {passwordCriteria.uppercase ? "✓" : "○"} One uppercase letter
                      </p>
                      <p className={passwordCriteria.special ? "text-green-600" : "text-muted-foreground"}>
                        {passwordCriteria.special ? "✓" : "○"} One special character (!@#$%^&*...)
                      </p>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> As a driver, you'll be able to share your real-time location with students and
                      parents assigned to your bus route.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : currentStep === 1 ? (
                    "Next Step"
                  ) : (
                    "Create Driver Account"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/driver/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
