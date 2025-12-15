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
import { sendOTP, checkUserExists } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { validatePhoneNumber } from "@/lib/validation"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/translations"
import { LanguageSelector } from "@/components/language-selector"

export default function StudentSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [schools, setSchools] = useState<Array<{ id: string; schoolName: string; district: string; schoolAddress: string }>>([])
  const [filteredSchools, setFilteredSchools] = useState<Array<{ id: string; schoolName: string; schoolAddress: string }>>([])
  const [selectedSchoolAddress, setSelectedSchoolAddress] = useState<string>("")
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [districts, setDistricts] = useState<string[]>([])
  const [formData, setFormData] = useState({
    schoolName: "",
    name: "",
    fatherName: "",
    gender: "",
    phone: "",
    busNumber: "",
    class: "",
    section: "",
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

  // Load districts from JSON file
  useEffect(() => {
    fetch('/districts.json')
      .then(res => res.json())
      .then(data => {
        const karnatakaDistricts = data['Karnataka'] || []
        setDistricts(karnatakaDistricts)
      })
      .catch(e => console.error('Failed to load districts:', e))
  }, [])

  // Load list of all schools for dropdown
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api("/api/school")
        if (!cancelled) {
          setSchools(Array.isArray(data) ? data.map((s: any) => ({ id: s.id, schoolName: s.schoolName, district: s.district, schoolAddress: s.schoolAddress || "" })) : [])
        }
      } catch (e) {
        // ignore fetch errors for now; user can still type manually if needed
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Filter schools when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = schools.filter(s => s.district === selectedDistrict)
      setFilteredSchools(filtered)
    } else {
      setFilteredSchools(schools)
    }
  }, [selectedDistrict, schools])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
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

    setIsLoading(true)

    try {
      // Check if user already exists
      const userExists = await checkUserExists(formData.phone)
      
      if (userExists) {
        toast({
          title: "Account Already Exists",
          description: "An account with this number already exists. Please login instead.",
          variant: "destructive",
        })
        setIsLoading(false)
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/student/login")
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar showBackButton backUrl="/" />
      
      <div className="max-w-md mx-auto w-full p-4 sm:p-6 pt-8">
        <Card className="w-full">
          <CardHeader className="text-center pb-4 px-4 sm:px-6">
            <div className="flex justify-end mb-2">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
            <CardTitle className="text-2xl font-serif">{getTranslation('studentSignup.title', language)}</CardTitle>
            <CardDescription>{getTranslation('studentSignup.description', language)}</CardDescription>
            
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
                  {/* District Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
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
                    {filteredSchools.length > 0 ? (
                      <Select
                        value={selectedSchoolId}
                        onValueChange={(value) => {
                          setSelectedSchoolId(value)
                          const sel = filteredSchools.find((s) => s.id === value)
                          handleInputChange("schoolName", sel?.schoolName || "")
                          setSelectedSchoolAddress(sel?.schoolAddress || "")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSchools.map((s) => (
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

                  {/* School Address Display */}
                  {selectedSchoolAddress && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">School Address</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{selectedSchoolAddress}</p>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{getTranslation('studentSignup.studentName', language)}</Label>
                    <Input
                      id="name"
                      placeholder={getTranslation('studentSignup.studentName', language)}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  {/* Father Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">{getTranslation('studentSignup.fatherName', language)}</Label>
                    <Input
                      id="fatherName"
                      placeholder={getTranslation('studentSignup.fatherName', language)}
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
                      <Label htmlFor="class">{getTranslation('studentSignup.class', language)}</Label>
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
                      <Label htmlFor="section">{getTranslation('studentSignup.section', language)}</Label>
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

                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-xs text-primary">
                      <strong>Secure Signup:</strong> We'll send a one-time password (OTP) to your phone number to verify your account.
                    </p>
                  </div>

                  <div className="mt-4 gap-3 w-full">
                   
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
                {getTranslation('studentSignup.haveAccount', language)}{" "}
                <Link href="/auth/student/login" className="text-primary hover:underline">
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
