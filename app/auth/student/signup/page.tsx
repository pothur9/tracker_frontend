"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Bus, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendOTP } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { validatePhoneNumber, validatePassword } from "@/lib/validation"

export default function StudentSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [schools, setSchools] = useState<Array<{ id: string; schoolName: string }>>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")
  const [formData, setFormData] = useState({
    city: "",
    schoolName: "",
    name: "",
    fatherName: "",
    gender: "",
    phone: "",
    busNumber: "",
    class: "",
    section: "",
    password: "",
    confirmPassword: "",
  })

  const [busOptions, setBusOptions] = useState<{ id: string; busNumber: string; name?: string }[]>([])

  // Load drivers for the selected school to populate bus numbers
  useEffect(() => {
    let cancelled = false
    async function loadDrivers() {
      if (!selectedSchoolId) {
        setBusOptions([])
        return
      }
      try {
        const list = await api(`/api/school/${selectedSchoolId}/drivers`)
        if (!cancelled) {
          const options = Array.isArray(list)
            ? list
                .filter((d: any) => d.busNumber)
                .map((d: any) => ({ id: d.id, busNumber: d.busNumber, name: d.name }))
            : []
          setBusOptions(options)
        }
      } catch (e) {
        if (!cancelled) setBusOptions([])
      }
    }
    loadDrivers()
    return () => {
      cancelled = true
    }
  }, [selectedSchoolId])

  // Load list of schools for dropdown
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api("/api/school")
        if (!cancelled) {
          setSchools(Array.isArray(data) ? data.map((s: any) => ({ id: s.id, schoolName: s.schoolName })) : [])
        }
      } catch (e) {
        // ignore fetch errors for now; user can still type manually if needed
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!formData.city.trim()) {
      toast({ title: "Error", description: "Please enter your city", variant: "destructive" })
      return false
    }
    if (!formData.schoolName.trim()) {
      toast({ title: "Error", description: "Please select or enter your school", variant: "destructive" })
      return false
    }
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Please enter your full name", variant: "destructive" })
      return false
    }
    if (!formData.fatherName.trim()) {
      toast({ title: "Error", description: "Please enter father's name", variant: "destructive" })
      return false
    }
    if (!formData.gender) {
      toast({ title: "Error", description: "Please select your gender", variant: "destructive" })
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

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: passwordValidation.error,
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
          schoolId: selectedSchoolId || undefined,
          type: "student",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-6">
      <div className="max-w-md mx-auto w-full">
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

        <Card className="w-full">
          <CardHeader className="text-center pb-4 px-4 sm:px-6">
            <CardTitle className="text-2xl font-serif">Student Registration</CardTitle>
            <CardDescription>Create your account to start tracking your school bus</CardDescription>
            
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
                  Personal Info
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
                  Account Details
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>

                  {/* School Name */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School</Label>
                    {schools.length > 0 ? (
                      <Select
                        value={selectedSchoolId}
                        onValueChange={(value) => {
                          setSelectedSchoolId(value)
                          const sel = schools.find((s) => s.id === value)
                          handleInputChange("schoolName", sel?.schoolName || "")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.schoolName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="schoolName"
                        placeholder="Enter your school name"
                        value={formData.schoolName}
                        onChange={(e) => {
                          setSelectedSchoolId("")
                          handleInputChange("schoolName", e.target.value)
                        }}
                        required
                      />
                    )}
                  </div>

                  {/* Name */}
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

                  {/* Father Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange("fatherName", e.target.value)}
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="button" onClick={handleNextStep} className="w-full" size="lg">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Account Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Must be 10 digits starting with 6, 7, 8, or 9</p>
                  </div>

                  {/* Bus Number */}
                  <div className="space-y-2">
                    <Label htmlFor="busNumber">Bus Number</Label>
                    {busOptions.length > 0 ? (
                      <Select
                        value={formData.busNumber}
                        onValueChange={(value) => handleInputChange("busNumber", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bus number" />
                        </SelectTrigger>
                        <SelectContent>
                          {busOptions.map((b) => (
                            <SelectItem key={b.id} value={b.busNumber}>
                              {b.busNumber} {b.name ? `- ${b.name}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="busNumber"
                        placeholder="Enter bus number"
                        value={formData.busNumber}
                        onChange={(e) => handleInputChange("busNumber", e.target.value)}
                        required
                      />
                    )}
                  </div>

                  {/* Class and Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={formData.section} onValueChange={(value) => handleInputChange("section", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {["A", "B", "C", "D", "E"].map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    <p className="text-xs text-muted-foreground">Min 8 characters, 1 capital letter, 1 special character</p>
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

                  <div className="mt-4 gap-3 w-full">
                   
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="w-full mt-2" size="lg">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/student/login" className="text-primary hover:underline">
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
