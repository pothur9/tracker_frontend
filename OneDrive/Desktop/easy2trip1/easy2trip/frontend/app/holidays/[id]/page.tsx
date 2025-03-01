// File: pages/hotel-details.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { AboutProperty } from "../../../components/AboutProperty";
import { PhotoGallery } from "../../../components/PhotoGallery";
import { RoomCard } from "../../../components/RoomCard/index";
import { LocationMap } from "../../../components/LocationMap";
import { HotelBookingService } from "../../../services/hotelBooking";
// import { safeJSONParse } from "../../../utils/helpers";
import { Room } from "../../../types/index";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Camera,
  Heart,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function HotelDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("rooms");
  const [hoildayData, setHolidayData] = useState({
    title: "Holiday Package Exclusive",
    rating: "5",
    address: "123 Holiday St, Vacation City",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    phoneNumber: "123-456-7890",
    images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080",
    ],
    description: "This is a beautiful holiday package that includes everything you need for a perfect vacation.",
    rooms: [
      {
        BookingCode: "ABC123",
        TotalFare: 5000,
        Name : ["Deluxe Room"],
      },
      {
        BookingCode: "DEF456",
        TotalFare: 6000,
        Name : ["Superior Room"],
      },
    ],
  });

  useEffect(() => {
    const id = searchParams.get("id"); // Get the holiday ID from the URL
    console.log("Holday ID from URL:", id);

    if (id) {
      const storedhoildayData = localStorage.getItem(`holiday_${id}`);
      console.log("Stored holiday data:", storedhoildayData);

      if (storedhoildayData) {
        const parsedData = JSON.parse(storedhoildayData);
        console.log("Parsed holiday data:", parsedData);
        // Log the parsed data
        if (typeof parsedData.images === "string") {
          parsedData.images = JSON.parse(parsedData.images); // Parse the images string into an array
        }
        if (typeof parsedData.rooms === "string") {
          parsedData.rooms = JSON.parse(parsedData.rooms); // Parse the rooms string into an array
        }
        // setHolidayData(parsedData); // Use storedhoildayData here
      } else {
        // setHolidayData(null); // Set hoildayData to null if not found in localStorage
      }
    }
  }, [searchParams]);

  // Add another useEffect to monitor hoildayData state
  useEffect(() => {
    console.log("hoildayData state:", hoildayData); // Monitor hoildayData state changes
  }, [hoildayData]);

  // Parsing data from URL parameters
  // const hoildayData = {
  //   id: searchParams.get("id") || "",
  //   hotelName: searchParams.get("hotelName") || "Hotel Name Not Available",
  //   address: searchParams.get("address") || "Address Not Available",
  //   rating: searchParams.get("rating") || "0",
  //   description: searchParams.get("description") || "",
  //   images: safeJSONParse(searchParams.get("images"), []),
  //   facilities: safeJSONParse(searchParams.get("facilities"), []),
  //   rooms: safeJSONParse(searchParams.get("rooms"), []),
  //   checkInTime: searchParams.get("checkInTime") || "12:00 PM",
  //   checkOutTime: searchParams.get("checkOutTime") || "11:00 AM",
  //   phoneNumber: searchParams.get("phoneNumber") || "",
  //   attractions: safeJSONParse(searchParams.get("attractions"), []),
  // };

  const nearbyPlaces = [
    { name: "Airport", distance: "4.7 km", type: "Transport" },
    { name: "Metro Station", distance: "800m", type: "Transport" },
    { name: "Bus Stop", distance: "200m", type: "Transport" },
    { name: "City Center", distance: "2.5 km", type: "Landmarks" },
    { name: "Shopping Mall", distance: "1.2 km", type: "Landmarks" },
    { name: "Beach", distance: "3.8 km", type: "Landmarks" },
  ];

  // useEffect(() => {
  //   if (hoildayData?.images?.length > 0) {
  //     setSelectedImage(hoildayData?.images[0]);
  //   }
  //   setLoading(false);
  // }, [hoildayData?.images]);
  useEffect(() => {
    if (hoildayData && hoildayData?.images?.length > 0) {
      setSelectedImage(hoildayData?.images[0]); // Set the first image as selected
    }
    setLoading(false); // Set loading to false once data is loaded
  }, [hoildayData]);

  const handleBookNow = async (room: Room) => {
    try {
      await HotelBookingService.preBook(room.BookingCode);
      router.push(
        `/holidays/booking?bookingCode=${room.BookingCode}&amount=${room.TotalFare}`
      );
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const navigationTabs = [
    { id: "rooms", label: "Rooms 🛏️" },
    { id: "about", label: "About ✨" },
    { id: "location", label: "Location 📍" },
    { id: "reviews", label: "Reviews ⭐" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading your next adventure... ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        {/* Hotel Header */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {hoildayData ? hoildayData?.title  : "Holiday Package Exclusive"}
                <Heart className="w-5 h-5 text-red-400 cursor-pointer hover:fill-red-400 transition-colors" />
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({
                    length: parseInt(
                      hoildayData ? hoildayData?.rating : "Loading..."
                    ),
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">•</span>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{hoildayData?.address}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 mt-2 sm:mt-0">
              Easy2trip Premium ⚡️
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Check-in: {hoildayData?.checkInTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Check-out: {hoildayData?.checkOutTime}</span>
            </div>
            {hoildayData?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{hoildayData?.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-4">
          {/* Main Image */}
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-sm">
            <img
              src={selectedImage || hoildayData?.images[0]}
              alt={hoildayData?.hotelName}
              className="w-full h-[300px] lg:h-[400px] object-cover"
            />
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-black/60"
            >
              <Camera className="w-4 h-4" />
              <span>View All Photos</span>
            </button>
          </div>
          {/* Side Images */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2">
            {hoildayData?.images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-sm"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${hoildayData?.hotelName} - ${index + 1}`}
                  className="w-full h-[150px] lg:h-[197px] object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-8">
            {selectedTab === "about" && (
              <AboutProperty description={hoildayData?.description} />
            )}

            {selectedTab === "location" && (
              <LocationMap
                address={hoildayData?.address}
                nearbyPlaces={nearbyPlaces}
              />
            )}

            {selectedTab === "rooms" && (
              <div className="space-y-4">
                {hoildayData?.rooms.map((room, index) => (
                  <RoomCard
                    key={room.BookingCode}
                    room={room}
                    roomsCount={parseInt(searchParams.get("rooms") || "1")}
                    adultsCount={parseInt(searchParams.get("adults") || "1")}
                  />
                ))}
              </div>
            )}

            {selectedTab === "reviews" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Guest Reviews</h2>
                <p className="text-gray-600">Reviews coming soon...</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-4">
              {/* Special Offer */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                  <span>🔥</span>
                  <span>Limited Time Deal!</span>
                </div>
                <p className="text-amber-700 text-sm">
                  Save up to 20% when you book now! Offer ends soon.
                </p>
              </div>

              {/* Property Policies */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-3">Property Policies</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-600">Check-in Time</div>
                      <div>{hoildayData?.checkInTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-600">Check-out Time</div>
                      <div>{hoildayData?.checkOutTime}</div>
                    </div>
                  </div>
                  <div className="pt-2 space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>Valid ID required at check-in</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>Early check-in subject to availability</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showGallery && (
        <PhotoGallery
          images={hoildayData?.images}
          onClose={() => setShowGallery(false)}
          startIndex={hoildayData?.images.indexOf(selectedImage)}
        />
      )}

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 lg:hidden">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <div className="text-lg font-bold text-blue-600">
              ₹{" "}
              {/* {Math.min(
                ...hoildayData?.rooms.map((room) => room.TotalFare)
              ).toLocaleString()} */}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
          <Button
            onClick={() => setSelectedTab("rooms")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select Room 🚀
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
