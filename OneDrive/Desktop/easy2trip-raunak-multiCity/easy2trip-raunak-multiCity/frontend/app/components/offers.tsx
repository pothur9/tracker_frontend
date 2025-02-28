"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

const styles = {
  scroll: `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 40s linear infinite;
    }
    .pause-animation {
      animation-play-state: paused;
    }
  `,
}

const offerCategories = ["All Offers", "Bank Offers", "Flights", "Hotels", "Holidays", "Cabs", "Bus"]

const offers = [
  {
    image:
      "/tra1.jpeg",
    category: "INTL FLIGHTS",
    title: "Grab Up to 40% OFF* on Flights, Stays & More.",
    description: "Tick-that-Bucket-List Sale is LIVE NOW, for your trips this year.",
  },
  {
    image:
      "/tra3.jpeg",
    category: "DOM HOTELS",
    title: "Grab Up to 40% OFF* on Domestic Hotels.",
    description: "Tick-that-Bucket-List Sale is LIVE NOW, for your trips this year.",
  },
  {
    image:
      "/tra4.jpeg",
    category: "DOM FLIGHTS",
    title: "Grab Up to 20% OFF* on Domestic Flights.",
    description: "Tick-that-Bucket-List Sale is LIVE NOW, for your trips this year.",
  },
  {
    image:
      "/tra6.jpeg",
    category: "DOM HOTELS",
    title: "Travel Through the Feeling That is India, with Taj",
    description: "& Enjoy Up to 20% Savings* on Breakfast Incl. Stays, F&B and more.",
  },
  {
    image:
      "/tra7.jpeg",
    category: "HOLIDAY PACKAGES",
    title: "Exclusive Deals on Holiday Packages",
    description: "Book now and save up to 30% on your dream vacation.",
  },
  {
    image:
      "/tra8.jpeg",
    category: "CAB SERVICES",
    title: "Ride in Comfort: 15% OFF on All Cab Bookings",
    description: "Use code RIDE15 for discounted airport transfers and city rides.",
  },
  {
    image:
      "/tra9.jpeg",
    category: "BUS TICKETS",
    title: "Long Distance Travel Made Affordable",
    description: "Get flat ₹100 off on bus tickets for routes over 500 km.",
  },
  {
    image:
      "/tra10.jpeg",
    category: "CREDIT CARD OFFER",
    title: "Extra 5% Cashback with Partner Credit Cards",
    description: "Use your eligible credit card and earn additional cashback on bookings.",
  },
]

export function Offers() {
  return (
    <div className="mt-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Offers</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <div className="flex items-center gap-2 flex-nowrap">
            {offerCategories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap",
                  category === "All Offers" && "text-red-600 bg-red-50",
                )}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="link" className="text-red-600 font-semibold">
            VIEW ALL →
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex animate-scroll hover:pause-animation"
          style={{ width: "200%", animation: "scroll 40s linear infinite" }}
        >
          <div className="flex min-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-2 lg:grid-flow-col gap-4 sm:gap-6">
              {offers.map((offer, index) => (
                <Card
                  key={index}
                  className="overflow-hidden w-full sm:w-[calc(50vw-20px)] lg:w-[calc(33vw-30px)] h-auto sm:h-[200px]"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4 h-full">
                    <div className="w-full h-48 sm:w-32 sm:h-full relative flex-shrink-0">
                      <Image
                        src={offer.image || "/placeholder.svg"}
                        alt={offer.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">{offer.category}</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">T&C'S APPLY</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-1">{offer.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                          {offer.description}
                        </p>
                      </div>
                      {/* <div className="flex justify-end mt-2 sm:mt-0">
                        <Button className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-1">BOOK NOW</Button>
                      </div> */}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex min-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-2 lg:grid-flow-col gap-4 sm:gap-6">
              {offers.map((offer, index) => (
                <Card
                  key={index + 8}
                  className="overflow-hidden w-full sm:w-[calc(50vw-20px)] lg:w-[calc(33vw-30px)] h-auto sm:h-[200px]"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4 h-full">
                    <div className="w-full h-48 sm:w-32 sm:h-full relative flex-shrink-0">
                      <Image
                        src={offer.image || "/placeholder.svg"}
                        alt={offer.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">{offer.category}</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">T&C'S APPLY</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-1">{offer.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                          {offer.description}
                        </p>
                      </div>
                      {/* <div className="flex justify-end mt-2 sm:mt-0">
                        <Button className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-1">BOOK NOW</Button>
                      </div> */}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

