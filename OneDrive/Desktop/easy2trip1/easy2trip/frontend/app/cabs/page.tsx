"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { NavigationMenu } from "../components/navigation-menu"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { ChevronDown, Search, MapPin, CalendarIcon, Users, LayoutGrid, LayoutList, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkout } from "../components/checkout"

const cars = [
  {
    id: 1,
    name: "Alfa Romeo: Brooklyn & Williamsburg",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.43%E2%80%AFPM-zqRUZsNoZOjB6jRSz6u5qDIqyBbVpT.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 2,
    name: "Audi: Taj Mahal Surfing Lesson",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.43%E2%80%AFPM-zqRUZsNoZOjB6jRSz6u5qDIqyBbVpT.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 3,
    name: "BMW: Eiffel Tower Observation Deck",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.43%E2%80%AFPM-zqRUZsNoZOjB6jRSz6u5qDIqyBbVpT.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 4,
    name: "Chevrolet: Machu Picchu & Amazon Rafting",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.43%E2%80%AFPM-zqRUZsNoZOjB6jRSz6u5qDIqyBbVpT.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 5,
    name: "Ferrari: Colosseum & Vatican",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.52%E2%80%AFPM-gl0fk2X4KjPTdR5U1TtTTsFtDKghBL.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 6,
    name: "Hyundai: Great Wall Hiking Experience",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.52%E2%80%AFPM-gl0fk2X4KjPTdR5U1TtTTsFtDKghBL.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 7,
    name: "Jaguar: Machu Picchu Food Tour",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.52%E2%80%AFPM-gl0fk2X4KjPTdR5U1TtTTsFtDKghBL.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
  {
    id: 8,
    name: "Jeep: Montmartre Art & Coffee",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.52%E2%80%AFPM-gl0fk2X4KjPTdR5U1TtTTsFtDKghBL.png",
    rating: 4.96,
    reviews: 672,
    location: "Manchester, England",
    miles: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 48.25,
  },
]

const filters = [
  {
    label: "Price range",
    options: ["$0-$50", "$50-$100", "$100-$200", "$200+"],
  },
  {
    label: "Hotel Type",
    options: ["Luxury", "Business", "Resort", "Boutique"],
  },
  {
    label: "Categories",
    options: ["Sedan", "SUV", "Sports", "Electric"],
  },
  {
    label: "Amenities",
    options: ["GPS", "Bluetooth", "Backup Camera", "Sunroof"],
  },
  {
    label: "Room Style",
    options: ["2-Door", "4-Door", "Convertible", "Van"],
  },
  {
    label: "Review Score",
    options: ["4.5+", "4.0+", "3.5+", "3.0+"],
  },
  {
    label: "Booking Location",
    options: ["Airport", "City Center", "Train Station", "Hotel"],
  },
]

export default function CabsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [location, setLocation] = useState("New York, USA")
  const [guests, setGuests] = useState("2 adults, 2 children")
  const [showEntries, setShowEntries] = useState("10")
  const [sortBy, setSortBy] = useState("Name")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const openBookingModal = (car) => {
    setSelectedCar(car)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedCar(null)
  }

  const handleCustomerDetailsChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleBooking = () => {
    setIsCheckoutOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-gray-900 to-gray-600 text-white">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%202.24.34%E2%80%AFPM-MOoN6Zi9zU5gxxw9xsGQYn5zsOoOOw.png"
          alt="Cars background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-4">Rent Your Perfect Ride Anytime, Anywhere</h1>
          <p className="text-xl mb-8">Search and find your best car rental with easy way</p>

          {/* Search Form */}
          <Card className="w-full max-w-5xl bg-white/5 backdrop-blur-lg border-white/20">
            <div className="p-6 grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Location</Label>
                <Select defaultValue={location}>
                  <SelectTrigger className="bg-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Popular Cities</SelectLabel>
                      <SelectItem value="New York, USA">New York, USA</SelectItem>
                      <SelectItem value="London, UK">London, UK</SelectItem>
                      <SelectItem value="Paris, France">Paris, France</SelectItem>
                      <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Check In</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20">
                      {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Check Out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20">
                      {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Guest</Label>
                <Select defaultValue={guests}>
                  <SelectTrigger className="bg-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 adult">1 adult</SelectItem>
                    <SelectItem value="2 adults">2 adults</SelectItem>
                    <SelectItem value="2 adults, 2 children">2 adults, 2 children</SelectItem>
                    <SelectItem value="4 adults">4 adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="self-end bg-black text-white hover:bg-black/90">Search</Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Left Column */}
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {filters.map((filter) => (
              <div key={filter.label} className="mb-4">
                <h3 className="font-semibold mb-2">{filter.label}</h3>
                {filter.label === "Price range" ? (
                  <div>
                    <Input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      className="w-full"
                      onChange={(e) => {
                        setActiveFilters((prev) => ({
                          ...prev,
                          [filter.label]: [e.target.value],
                        }))
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>${activeFilters[filter.label]?.[0] || 500}</span>
                    </div>
                  </div>
                ) : ["Categories", "Amenities", "Room Style"].includes(filter.label) ? (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option} className="flex items-center">
                        <Checkbox
                          id={`${filter.label}-${option}`}
                          checked={activeFilters[filter.label]?.includes(option)}
                          onCheckedChange={(checked) => {
                            setActiveFilters((prev) => {
                              const updatedOptions = checked
                                ? [...(prev[filter.label] || []), option]
                                : (prev[filter.label] || []).filter((item) => item !== option)
                              return { ...prev, [filter.label]: updatedOptions }
                            })
                          }}
                        />
                        <label
                          htmlFor={`${filter.label}-${option}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Select
                    value={activeFilters[filter.label]?.[0] || ""}
                    onValueChange={(value) => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        [filter.label]: [value],
                      }))
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            {Object.keys(activeFilters).length > 0 && (
              <Button variant="outline" className="w-full mt-4" onClick={() => setActiveFilters({})}>
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Car List - Right Column */}
          <div className="w-full md:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(viewMode === "grid" && "bg-gray-100")}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(viewMode === "list" && "bg-gray-100")}
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600">1 - 10 of 19 tours found</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <Select defaultValue={showEntries}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select defaultValue={sortBy}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Name">Name</SelectItem>
                      <SelectItem value="Price">Price</SelectItem>
                      <SelectItem value="Rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
              )}
            >
              {cars.map((car) => (
                <Card
                  key={car.id}
                  className={cn(
                    "group hover:shadow-lg transition-shadow",
                    viewMode === "list" ? "flex" : "flex flex-col h-full",
                  )}
                >
                  <div className={cn("relative", viewMode === "list" ? "w-72" : "w-full")}>
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      width={400}
                      height={300}
                      className="w-full aspect-[4/3] object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium ml-1">{car.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">({car.reviews} reviews)</span>
                    </div>
                    <h3 className="font-bold mb-2">{car.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{car.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>🛣️</span>
                        {car.miles}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>⚙️</span>
                        {car.transmission}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>⛽</span>
                        {car.fuel}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>👥</span>
                        {car.seats}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-2xl font-bold">${car.price}</span>
                        <span className="text-gray-600 text-sm">/ day</span>
                      </div>
                      {/* <Button onClick={() => openBookingModal(car)}>Book Now</Button> */}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Your Car</DialogTitle>
            <DialogDescription>Please provide your details to book {selectedCar?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleCustomerDetailsChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerDetails.email}
                onChange={handleCustomerDetailsChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customerDetails.phone}
                onChange={handleCustomerDetailsChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeBookingModal} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleBooking}>Proceed to Checkout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        carDetails={selectedCar}
        customerDetails={customerDetails}
      />
    </main>
  )
}

