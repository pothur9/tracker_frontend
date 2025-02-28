"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Hotel, 
  Plane, 
  History, 
  Users, 
  Settings, 
  MessageSquare,
  Receipt,
  Tag,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Hotels",
    icon: Hotel,
    href: "/hotels",
  },
  {
    label: "Flights",
    icon: Plane,
    href: "/flights",
  },
  {
    label: "Booking History",
    icon: History,
    href: "/history",
  },
  {
    label: "Analytics",
    icon: LayoutDashboard,
    href: "/analytics",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    label: "Customers",
    icon: MessageSquare,
    href: "/customers",
  },
  {
    label: "Payments",
    icon: Receipt,
    href: "/payments",
  },
  {
    label: "Offers",
    icon: Tag,
    href: "/offers",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14" onClick={handleLinkClick}>
          <h1 className="text-2xl font-bold text-red-600">TravelAdmin</h1>
        </Link>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-red-50 text-red-600"
                )}
                onClick={handleLinkClick}
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="px-3">
        <Button variant="ghost" className="w-full justify-start text-red-600">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}