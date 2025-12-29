"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="w-full px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-primary/20">
              <Image
                src="/logo.jpeg"
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
            Real-time bus tracking for students and parents
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Content Card */}
          <Card className="border-2 border-amber-200/60 bg-amber-50/30 shadow-xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-primary/10">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Student / Parent
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Track your school bus in real-time
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
                <Link href="/auth/student/signup">
                  <Button
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    Sign Up as Student
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
                <Link href="/auth/student/login">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all"
                    size="lg"
                  >
                    Login as Student
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

