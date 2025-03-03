// FeaturedTours.jsx
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const tours = [
  {
    id: 1,
    image: "/img1.jpeg",
    badge: "Top Rated",
    badgeColor: "bg-orange-50 text-orange-700",
    title: "California Sunset/Twilight Boat Cruise",
    rating: 4.96,
    reviews: 672,
    duration: "2 days 3 nights",
    guests: "4-6 guest",
    price: 48.25,
  },
  {
    id: 2,
    image: "/img2.jpeg",
    badge: "Best Sale",
    badgeColor: "bg-green-50 text-green-700",
    title: "NYC: Food Tastings and Culture Tour",
    rating: 4.96,
    reviews: 672,
    duration: "3 days 3 nights",
    guests: "4-6 guest",
    price: 17.32,
  },
  {
    id: 3,
    image: "/img3.jpeg",
    badge: "25% Off",
    badgeColor: "bg-blue-50 text-blue-700",
    title: "Grand Canyon Horseshoe Bend 2 days",
    rating: 4.96,
    reviews: 672,
    duration: "7 days 6 nights",
    guests: "4-6 guest",
    price: 15.63,
  },
]

export function FeaturedTours() {
  return (
    <div className="mt-8 sm:mt-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Our Featured Tours</h2>
          <p className="text-gray-600">Favorite destinations based on customer reviews</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["Categories", "Duration", "Review / Rating", "Price range"].map((filter) => (
            <Button key={filter} variant="outline" className="bg-gray-100 border-0 hover:bg-gray-200 text-sm sm:text-base">
              {filter}
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="overflow-hidden group">
            <div className="relative">
              <Image
                src={tour.image || "/placeholder.svg"}
                alt={tour.title}
                width={400}
                height={300}
                className="w-full h-[200px] sm:h-[250px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium ${tour.badgeColor}`}>
                  {tour.badge}
                </span>
              </div>
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{tour.rating}</span>
                <span className="text-gray-600">({tour.reviews} reviews)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">{tour.title}</h3>
              <div className="flex items-center gap-4 sm:gap-6 mb-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {tour.duration}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {tour.guests}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold">${tour.price}</span>
                  <span className="text-gray-600 ml-1">/ person</span>
                </div>
                <Button variant="outline" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
                  Book Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}