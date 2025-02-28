"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

interface Room {
  Name: string[];
  BookingCode: string;
  Inclusion: string;
  TotalFare: number;
  TotalTax: number;
  IsRefundable: boolean;
}

export function HotelDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState("");

  // Get hotel data from URL params
  const hotelName = searchParams.get("hotelName") || "";
  const address = searchParams.get("address") || "";
  const rating = searchParams.get("rating") || "0";
  const description = searchParams.get("description") || "";
  const images = JSON.parse(searchParams.get("images") || "[]");
  const facilities = JSON.parse(searchParams.get("facilities") || "[]");
  const rooms = JSON.parse(searchParams.get("rooms") || "[]");

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleBookNow = async (room: Room) => {
    try {
      const response = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/preBook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingCode: room.BookingCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Prebooking failed");
      }

      router.push(
        `/hotels/booking?bookingCode=${room.BookingCode}&amount=${room.TotalFare}`
      );
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hotel Name and Rating */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {hotelName}
            <div className="flex">
              {Array.from({ length: parseInt(rating) }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <MapPin className="w-5 h-5" />
            <span>{address}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-8">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt={hotelName}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="col-span-4 grid grid-rows-3 gap-4">
            {images.slice(1, 4).map((image: string, index: number) => (
              <div
                key={index}
                className="aspect-[4/3] relative rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${hotelName} - ${index + 2}`}
                  className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-8">
            {/* Room Options */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
              <div className="space-y-6">
                {rooms.map((room: Room, index: number) => (
                  <div
                    key={index}
                    className="border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {room.Name[0]}
                        </h3>
                        <p className="text-gray-600 mt-1">Fits 2 Adults</p>
                        <ul className="mt-2 space-y-1">
                          <li className="text-gray-600">
                            {room.Inclusion || "No meals included"}
                          </li>
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-gray-400 line-through">
                          ₹{(room.TotalFare * 1.2).toFixed(0)}
                        </div>
                        <div className="text-3xl font-bold">
                          ₹{room.TotalFare}
                        </div>
                        <div className="text-sm text-gray-500">
                          + ₹{room.TotalTax} taxes & fees
                        </div>
                        <Button
                          onClick={() => handleBookNow(room)}
                          className="bg-red-600 hover:bg-red-700 text-white mt-4"
                        >
                          Book This Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About This Property</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="space-y-2">
                {facilities.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelDetailsContent />
    </Suspense>
  );
}
