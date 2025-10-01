"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Users, MapPin, Eye } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
   
      <header className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-serif font-bold text-foreground">TrackBus</h1>
        </div>
        <p className="text-muted-foreground text-lg">Real-time school bus tracking for students and parents</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">Get Started</h2>
            <p className="text-muted-foreground">Choose your account type to continue</p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Demo Access</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Preview the dashboards without creating an account</p>
            <div className="flex gap-2">
              <Link href="/dashboard/student" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Student Demo
                </Button>
              </Link>
              <Link href="/dashboard/driver" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Driver Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* Student/Parent Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
              <Link href="/auth/student/signup">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Student / Parent</CardTitle>
                  <CardDescription>Track your school bus in real-time and get notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    Sign Up as Student
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Driver Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
              <Link href="/auth/driver/signup">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Bus Driver</CardTitle>
                  <CardDescription>Share your location with students and parents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline" size="lg">
                    Sign Up as Driver
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Login Links */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">Already have an account?</p>
            <div className="flex gap-3">
              <Link href="/auth/student/login" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Student Login
                </Button>
              </Link>
              <Link href="/auth/driver/login" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Driver Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
