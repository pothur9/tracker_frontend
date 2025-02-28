import { Heart, ArrowLeft, ArrowRight, FlipHorizontalIcon as SwapHorizontal } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const styles = {
  scroll: `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 30s linear infinite;
    }
    .pause-animation {
      animation-play-state: paused;
    }
  `,
}

const flightDeals = [
  {
    id: 1,
    image:
      "/f1.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
  {
    id: 2,
    image:
      "/f2.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
  {
    id: 3,
    image:
      "/f3.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
  {
    id: 4,
    image:
      "/f4.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
  {
    id: 5,
    image:
      "/f5.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
  {
    id: 6,
    image:
      "/f1.jpeg",
    departureDate: "09 Jun 2024",
    returnDate: "16 Jun 2024",
    from: "Denmark",
    to: "New York",
    fromClass: "Business",
    toClass: "Business",
    price: 288.15,
    seatsLeft: 18,
  },
]

export function FlightOfferDeals() {
  return (
    <>
      <style>{styles.scroll}</style>
      <div className="mt-16 mb-16">
        {" "}
        {/* Updated line */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Flight Offer Deals</h2>
            <p className="text-gray-600">Competitive fares for your route-specific searches.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-6 hover:pause-animation">
            {[...flightDeals, ...flightDeals].map((deal, index) => (
              <Card key={`${deal.id}-${index}`} className="overflow-hidden group flex-shrink-0 w-[380px]">
                <div className="relative">
                  <Image
                    src={deal.image || "/placeholder.svg"}
                    alt={`${deal.from} to ${deal.to}`}
                    width={400}
                    height={250}
                    className="w-full h-[200px] object-cover rounded-t-xl"
                  />
                  <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        <span className="inline-block">⌚</span> {deal.departureDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{deal.from}</span>
                        <SwapHorizontal className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{deal.to}</span>
                      </div>
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span>{deal.fromClass}</span>
                        <span>-</span>
                        <span>{deal.toClass}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">{deal.seatsLeft} Seats left</span>
                      <div className="text-2xl font-bold">${deal.price}</div>
                    </div>
                    {/* <Button variant="outline" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
                      Book Now
                    </Button> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

