"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface NavbarProps {
  showBackButton?: boolean
  backUrl?: string
}

export function Navbar({ showBackButton = false, backUrl = "/" }: NavbarProps) {
  const { user } = useAuth()
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)

  // Fetch school logo if user is a student or driver
  useEffect(() => {
    let cancelled = false
    
    async function fetchSchoolLogo() {
      if (!user || (!user.schoolId && !user.schoolName)) {
        setSchoolLogo(null)
        setSchoolName(null)
        return
      }

      try {
        // Try to fetch school by ID first, then by name
        if (user.schoolId) {
          const schoolData = await api(`/api/school/${user.schoolId}/overview`)
          if (!cancelled && schoolData?.school) {
            setSchoolLogo(schoolData.school.logoUrl || null)
            setSchoolName(schoolData.school.schoolName || null)
          }
        } else if (user.schoolName) {
          // Fallback: fetch all schools and find by name
          const schools = await api('/api/school')
          if (!cancelled && Array.isArray(schools)) {
            const school = schools.find((s: any) => 
              s.schoolName?.toLowerCase() === user.schoolName?.toLowerCase()
            )
            if (school) {
              setSchoolLogo(school.logoUrl || null)
              setSchoolName(school.schoolName || null)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch school logo:', error)
        if (!cancelled) {
          setSchoolLogo(null)
          setSchoolName(null)
        }
      }
    }

    fetchSchoolLogo()
    
    return () => {
      cancelled = true
    }
  }, [user?.schoolId, user?.schoolName])

  return (
    <header className="w-full border-b bg-gradient-to-r from-background via-background to-primary/5 shadow-sm sticky top-0 z-50">
      {/* Trust Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-1.5 sm:py-1 text-center border-b border-primary/10">
        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide px-2">
          Managed by the Sri Adavi Thatha Seva Trust
        </p>
      </div>
      
      {/* Main Navbar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 max-w-7xl mx-auto">
        {/* Left Section - Ambari Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {showBackButton && (
            <Link href={backUrl}>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          )}
          
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-12 w-12 sm:h-11 sm:w-11 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md transition-transform hover:scale-105">
              <Image
                src="/logo.jpeg"
                alt="Ambari Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
                Ambari
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium -mt-0.5 hidden sm:block">
                School Bus Tracking
              </p>
            </div>
          </Link>
        </div>

        {/* Center Section - Animated Logo */}
        <div className="flex items-center justify-center flex-1">
          <div className="relative h-10 w-24 sm:h-10 sm:w-20 lg:h-14 lg:w-28 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/logo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Right Section - School Logo */}
        {user && (user.type === "student" || user.type === "driver") && schoolLogo ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-medium text-muted-foreground">School</p>
              {schoolName && (
                <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {schoolName}
                </p>
              )}
            </div>
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
              <Image
                src={schoolLogo}
                alt={schoolName || "School Logo"}
                fill
                className="object-cover"
                onError={() => setSchoolLogo(null)}
              />
            </div>
          </div>
        ) : (
          <div className="w-10 sm:w-12" />
        )}
      </div>
    </header>
  )
}

