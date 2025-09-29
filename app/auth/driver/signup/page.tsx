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
  const [schools, setSchools] = useState<{ id: string; schoolName: string }[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")
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
        const data = await api("/api/school")
        if (!cancelled) {
          setSchools(Array.isArray(data) ? data.map((s: any) => ({ id: s.id, schoolName: s.schoolName })) : [])
        }
      } catch (e) {
        // ignore
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
      // Send OTP first (driver)
      await sendOTP(formData.phone, "driver")

      // Store form data for OTP verification
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          ...formData,
          schoolId: selectedSchoolId || undefined,
          type: "driver",
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
            <CardTitle className="text-2xl font-serif">Driver Registration</CardTitle>
            <CardDescription>Create your driver account to start sharing location</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter school name"
                    value={formData.schoolName}
                    onChange={(e) => {
                      setSelectedSchoolId("")
                      handleInputChange("schoolName", e.target.value)
                    }}
                    required
                  />
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
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

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

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Create Driver Account"
                )}
              </Button>
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
