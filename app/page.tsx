"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"student" | "driver">("student")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="w-full px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-primary/20">
              <Image
                src="/logo.jpg"
                alt="Ambari Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Ambari
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Real-time school bus tracking for students and parents
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Toggle Bar */}
          <div className="mb-8">
            <div className="bg-muted/50 backdrop-blur-sm p-1.5 rounded-xl border shadow-sm">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveTab("student")}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      activeTab === "student"
                        ? "bg-background text-foreground shadow-md scale-[0.98]"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Student</span>
                </button>
                <button
                  onClick={() => setActiveTab("driver")}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      activeTab === "driver"
                        ? "bg-background text-foreground shadow-md scale-[0.98]"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Driver</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto mb-2">
                <div
                  className={`
                    w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300
                    ${activeTab === "student" ? "bg-primary/10" : "bg-accent/10"}
                  `}
                >
                  {activeTab === "student" ? (
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  ) : (
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {activeTab === "student" ? "Student / Parent" : "Bus Driver"}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {activeTab === "student"
                  ? "Track your school bus in real-time"
                  : "Share your location with students"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              {/* Sign Up Section */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    New User
                  </h3>
                </div>
                <Link
                  href={
                    activeTab === "student"
                      ? "/auth/student/signup"
                      : "/auth/driver/signup"
                  }
                >
                  <Button
                    className={`
                      w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all
                      ${activeTab === "driver" ? "bg-accent hover:bg-accent/90" : ""}
                    `}
                    size="lg"
                  >
                    Sign Up as {activeTab === "student" ? "Student" : "Driver"}
                  </Button>
                </Link>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Section */}
              <div className="space-y-3">
                <Link
                  href={
                    activeTab === "student"
                      ? "/auth/student/login"
                      : "/auth/driver/login"
                  }
                >
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all"
                    size="lg"
                  >
                    Login as {activeTab === "student" ? "Student" : "Driver"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Secure and reliable bus tracking solution
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
