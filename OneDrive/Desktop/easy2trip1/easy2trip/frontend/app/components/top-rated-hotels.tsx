import { Heart, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const hotels = [
  {
    id: 1,
    image: "/img9.jpeg",
    title: "Grand Canyon Horseshoe Bend 2 days",
    location: "Manchester, England",
    rating: 4.96,
    reviews: 672,
    price: 15.63,
  },
  {
    id: 2,
    image: "/img8.jpeg",
    title: "California Sunset/Twilight Boat Cruise",
    location: "Manchester, England",
    rating: 4.96,
    reviews: 672,
    price: 48.25,
  },
  {
    id: 3,
    image: "/img7.jpeg",
    title: "NYC: Food Tastings and Culture Tour",
    location: "Manchester, England",
    rating: 4.96,
    reviews: 672,
    price: 17.32,
  },
  {
    id: 4,
    image: "/img6.jpeg",
    title: "Grand Canyon Horseshoe Bend 2 days",
    location: "Manchester, England",
    rating: 4.96,
    reviews: 672,
    price: 15.63,
  },
]

export function TopRatedHotels() {
  return (
    <div className="mt-8 sm:mt-16 mb-8 sm:mb-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Top Rated Hotels</h2>
          <p className="text-gray-600 text-sm sm:text-base">Quality as judged by customers. Book at the ideal price!</p>
        </div>
        <Button variant="outline" className="rounded-full bg-black text-white hover:bg-black/90 px-4 sm:px-6 w-full sm:w-auto">
          View More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden group">
            <div className="relative">
              <Image
                src={hotel.image || "/placeholder.svg"}
                alt={hotel.title}
                width={400}
                height={300}
                className="w-full h-[180px] sm:h-[200px] object-cover"
              />
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-sm sm:text-base">{hotel.rating}</span>
                <span className="text-gray-600 text-sm sm:text-base">({hotel.reviews} reviews)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{hotel.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base truncate">{hotel.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold">${hotel.price}</span>
                  <span className="text-gray-600 text-sm sm:text-base ml-1">/ person</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}