"use client"

import { Button } from "@/components/ui/button"
import { Home, MapPin, Bell, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: "home" | "map" | "notifications" | "profile"
  userType: "student" | "driver"
}

export function BottomNavigation({ activeTab, userType }: BottomNavigationProps) {
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
    <nav className="bg-card border-t px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn("flex flex-col items-center gap-1 h-auto py-2 px-3", isActive && "text-primary")}
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
