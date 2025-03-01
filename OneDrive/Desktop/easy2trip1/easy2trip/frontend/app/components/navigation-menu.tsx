"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Building2, Briefcase, User, ClipboardList, UserCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { ComingSoonPopup } from "./coming-soon-popup"

const navItems = [
  {
    icon: "✈️",
    label: "Flights",
    path: "/",
    active: false,
  },
  {
    icon: "🏨",
    label: "Hotels",
    path: "/hotels",
    active: false,
  },
  {
    icon: "🏠",
    label: "Homestays & Villas",
    path: "/homestays",
    active: false,
    comingSoon: true,
  },
  {
    icon: "🌴",
    label: "Holiday Packages",
    path: "/holidays",
    active: false,
    // comingSoon: true,
  },
  {
    icon: "🚕",
    label: "Cabs",
    path: "/cabs",
    active: false,
  },
  {
    icon: "🛡️",
    label: "Travel Insurance",
    path: "/insurance",
    active: false,
    comingSoon: true,
  },
  {
    icon: "📄",
    label: "e-Visa",
    path: "/e-visa",
    active: false,
  },
  {
    icon: "📝",
    label: "Blog",
    path: "/blog",
    active: false,
  },
]

export function NavigationMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)
  const isHotelSearch = pathname === "/hotels/search"
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [showAllItems, setShowAllItems] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrollPosition(scrollY)
      setIsSticky(scrollY > 100)

      const existingNavbar = document.querySelector(".existing-navbar")
      if (existingNavbar) {
        if (scrollPosition > 100) {
          existingNavbar.classList.add("hidden")
        } else {
          existingNavbar.classList.remove("hidden")
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavItemClick = (item) => {
    if (item.comingSoon) {
      setIsPopupOpen(true)
    } else {
      router.push(item.path)
    }
  }

  return (
    <> 
      <div
        className={cn(
          "transition-all duration-500 text-black overflow-x-auto scrollbar-hide",
          // Enhanced shadow and padding
          "shadow-2xl",
          scrollPosition <= 100 ? "rounded-3xl"  : "rounded-none",
          // Existing sticky and background styles
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-2 py-3"
            : "w-full md:w-[800px] lg:w-[1000px] mx-auto bg-white/90 backdrop-blur-sm p-4",
        )}
      >
        {!isHotelSearch && (
          <div className="relative">
            <div className="flex justify-start md:justify-center items-center w-full py-2 px-4 md:px-0">
              {/* Desktop View - All Items */}
              <div className="hidden md:flex justify-center items-center w-full">
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavItemClick(item)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-3 lg:px-6 py-3 rounded-xl cursor-pointer transition-all duration-300",
                      pathname === item.path 
                        ? "text-red-600 bg-red-50/50" 
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50/30",
                      "relative group",
                      // Added subtle shadow on hover
                      "hover:shadow-md"
                    )}
                  >
                    <span className={cn(
                      "text-2xl lg:text-3xl transition-all duration-300 transform",
                      hoveredIndex === index ? "scale-125 -translate-y-1" : "scale-100",
                      pathname === item.path && "animate-bounce"
                    )}>
                      {item.icon}
                    </span>
                    <span className={cn(
                      "text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-300",
                      hoveredIndex === index ? "scale-105 font-semibold" : "scale-100"
                    )}>
                      {item.label}
                    </span>
                    {pathname === item.path && (
                      <div className="h-0.5 w-full bg-red-600 absolute -bottom-2 left-0 rounded-full" />
                    )}
                    {item.comingSoon && hoveredIndex === index && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Soon
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile View - 5 Items + More */}
              <div className="flex md:hidden items-center">
                {navItems.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavItemClick(item)}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 shrink-0 relative",
                      pathname === item.path 
                        ? "text-red-600 bg-red-50/50" 
                        : "text-gray-700 hover:text-red-600 active:scale-95"
                    )}
                  >
                    <span className="text-lg transform transition-transform active:scale-110">
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    {pathname === item.path && (
                      <div className="h-0.5 w-full bg-red-600 absolute -bottom-1 left-0 rounded-full" />
                    )}
                  </div>
                ))}
                
                {/* Mobile More Button */}
                <button
                  onClick={() => setShowAllItems(true)}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl cursor-pointer text-gray-700 hover:text-red-600 hover:bg-red-50/30 transition-all duration-300 shrink-0 active:scale-95"
                >
                  <span className="text-lg transform transition-transform active:scale-110">⋮</span>
                  <span className="text-[10px] font-medium">More</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Gradient Overlay */}
            {/* <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden" /> */}
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Sheet */}
      {showAllItems && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowAllItems(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transform transition-all duration-500 animate-slide-up shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <div className="grid grid-cols-4 gap-6">
              {navItems.slice(5).map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    handleNavItemClick(item)
                    setShowAllItems(false)
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer hover:bg-red-50/50 transition-all duration-300 active:scale-95 hover:shadow-md"
                >
                  <span className="text-3xl transform transition-transform hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="text-xs text-center font-medium">
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <span className="text-[10px] text-red-500 font-medium">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ComingSoonPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}