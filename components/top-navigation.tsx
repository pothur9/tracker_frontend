"use client"

import { Button } from "@/components/ui/button"
import { Home, MapPin, Bell, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TopNavigationProps {
  activeTab: "home" | "map" | "notifications" | "profile"
  userType: "student" | "driver"
}

export function TopNavigation({ activeTab, userType }: TopNavigationProps) {
  const basePath = `/dashboard/${userType}`

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: basePath,
    },
    {
      id: "map",
      label: "Map",
      icon: MapPin,
      href: `${basePath}/map`,
    },
    {
      id: "notifications",
      label: "Alerts",
      icon: Bell,
      href: `${basePath}/notifications`,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: `${basePath}/profile`,
    },
  ]

  return (
    <nav className="bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 border-b border-orange-200/50 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Small Logo before navigation items */}
        <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-1 ring-primary/20 shadow-sm shrink-0">
          <Image
            src="/Alogo.png"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className={cn("text-xs", isActive && "text-primary font-medium")}>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
