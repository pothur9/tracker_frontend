"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Edit3, Save, X, LogOut, Settings, Moon, Sun, Phone, MapPin, Bus, Shield } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

export default function DriverProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    schoolName: "",
    schoolCity: "",
    busNumber: "",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/driver/login")
      return
    }
    if (user.type !== "driver") {
      router.push("/")
      return
    }

    // Initialize form data
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      schoolName: user.schoolName || "",
      schoolCity: user.schoolCity || "",
      busNumber: user.busNumber || "",
    })
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data in localStorage (in real app, this would be API call)
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/driver">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg">Driver Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isLoading}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bus className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-xl font-serif font-bold">{user.name}</h2>
            <p className="text-muted-foreground">Bus Driver • {user.busNumber}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Verified Driver</span>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolCity">School City</Label>
              <Input
                id="schoolCity"
                value={formData.schoolCity}
                onChange={(e) => handleInputChange("schoolCity", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busNumber">Bus Number</Label>
              <Input
                id="busNumber"
                value={formData.busNumber}
                onChange={(e) => handleInputChange("busNumber", e.target.value.toUpperCase())}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Driver Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Days Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">12</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">4.8</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>Dark Mode</span>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Change Password
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Location Settings
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>

            <Separator />

            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" userType="driver" />
    </div>
  )
}
