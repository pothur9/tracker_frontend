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

  useEffect(() => {
    let cancelled = false

    async function fetchSchoolLogo() {
      if (!user || (!user.schoolId && !user.schoolName)) {
        setSchoolLogo(null)
        setSchoolName(null)
        return
      }

      try {
        if (user.schoolId) {
          const schoolData = await api(`/api/school/${user.schoolId}/overview`)
          if (!cancelled && schoolData?.school) {
            setSchoolLogo(schoolData.school.logoUrl || null)
            setSchoolName(schoolData.school.schoolName || null)
          }
        } else if (user.schoolName) {
          const schools = await api("/api/school")
          if (!cancelled && Array.isArray(schools)) {
            const school = schools.find(
              (s: any) =>
                s.schoolName?.toLowerCase() ===
                user.schoolName?.toLowerCase()
            )
            if (school) {
              setSchoolLogo(school.logoUrl || null)
              setSchoolName(school.schoolName || null)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch school logo:", error)
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
    <header className="w-full border-b bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 shadow-sm sticky top-0 z-50">
      {/* Trust Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-1.5 text-center border-b border-primary/10">
        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide px-2">
          Managed by the Sri Adavi Thatha Seva Trust
        </p>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 px-2 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 max-w-7xl mx-auto">
        
        {/* Left Section - Logo + Back */}
        <div className="flex items-center gap-2 sm:gap-4">
          {showBackButton && (
            <Link href={backUrl}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
              <Image
                src="/logo.jpeg"
                alt="Ambari Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center Section - Large Responsive Video */}
<div className="flex items-center justify-center flex-1 px-1 sm:px-4 md:px-6">
  <div
    className="
      relative 
      w-full                     /* full width on all screens */
      aspect-[16/3.5]            /* wider aspect ratio for bigger display */
      sm:aspect-[16/3]           /* slightly taller on tablets */
      md:aspect-[16/2.5]         /* even taller on desktop */
      max-h-[90px]               /* larger max height on mobile */
      sm:max-h-[110px]           /* larger on tablets */
      md:max-h-[140px]           /* much larger on desktop */
      overflow-hidden
      rounded-md                 /* subtle rounded corners */
    "
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-contain scale-105"
    >
      <source src="/logo.mp4" type="video/mp4" />
    </video>
  </div>
</div>


        {/* Right Section - School Logo */}
        {user && (user.type === "student" || user.type === "driver") && schoolLogo ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-medium text-muted-foreground">School</p>
              {schoolName && (
                <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {schoolName}
                </p>
              )}
            </div>
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md shrink-0">
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
          <div className="w-9 sm:w-10 md:w-12 shrink-0" />
        )}
      </div>
    </header>
  )
}
