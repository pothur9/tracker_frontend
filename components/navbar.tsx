import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NavbarProps {
  showBackButton?: boolean
  backUrl?: string
}

export function Navbar({ showBackButton = false, backUrl = "/" }: NavbarProps) {
  return (
    <header className="w-full border-b bg-gradient-to-r from-background via-background to-primary/5 shadow-sm sticky top-0 z-50">
      {/* Trust Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-1.5 sm:py-1 text-center border-b border-primary/10">
        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide px-2">
          Managed by the Adaviswamy Trust
        </p>
      </div>
      
      {/* Main Navbar */}
      <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 max-w-7xl mx-auto">
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
        
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md transition-transform hover:scale-105">
            <Image
              src="/logo.jpg"
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

        {/* Spacer for centering on mobile when back button is present */}
        {showBackButton && (
          <div className="w-9 sm:hidden" />
        )}
      </div>
    </header>
  )
}
