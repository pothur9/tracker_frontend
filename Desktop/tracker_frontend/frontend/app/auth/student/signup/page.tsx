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

export default function StudentSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.phone.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Send OTP first
      await sendOTP(formData.phone)

      // Store form data for OTP verification
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          ...formData,
          schoolId: selectedSchoolId || undefined,
          type: "student",
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
            <CardTitle className="text-2xl font-serif">Student Registration</CardTitle>
            <CardDescription>Create your account to start tracking your school bus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
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
