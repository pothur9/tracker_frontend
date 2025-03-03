"use client";

import { useState, useMemo } from "react";
import { Star, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hotel } from "./SearchResultsClient";

export const HotelSkeleton = () => (
  <div className="bg-white rounded-lg p-6 flex gap-6 animate-pulse">
    <div className="w-72 h-48 bg-gray-200 rounded-lg" />
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-end mt-8">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>
      </div>
    </div>
  </div>
);

export const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export const HotelCard = ({
  hotel,
  searchParams,
  onClick,
}: {
  hotel: Hotel;
  searchParams: URLSearchParams;
  onClick: () => void;
}) => {
  // const lowestPrice = useMemo(
  //   () => Math.min(...hotel.Rooms.map((r: any) => r.TotalFare)),
  //   [hotel.Rooms]
  // );

  // const distance = useMemo(() => {
  //   if (!hotel.HotelAddress) return "Location not available";
  //   // const [lat, lng] = hotel.Map.split("|").map(Number);
  //   // if (!lat || !lng) return "Location not available";

  //   const cityCenter = { lat: 15.4989, lng: 73.8278 };
  //   const R = 6371;
  //   const dLat = ((lat - cityCenter.lat) * Math.PI) / 180;
  //   const dLon = ((lng - cityCenter.lng) * Math.PI) / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos((cityCenter.lat * Math.PI) / 180) *
  //       Math.cos((lat * Math.PI) / 180) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return `${(R * c).toFixed(1)} km from city center`;
  // }, [hotel.Map]);

  return (
    <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
      <div className="w-full md:w-72 h-48 bg-gray-200 rounded-lg overflow-hidden">
        <LazyImage
          src={hotel.HotelPicture}
          alt={hotel.HotelName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold hover:text-blue-600 cursor-pointer">
              {hotel.HotelName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {Array.from({ length: hotel.StarRating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            {/* <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs md:text-sm">
              {hotel.StarRating > 4 ? "Excellent" : "Good"} 8.5+
            </div> */}
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-xs md:text-sm">{hotel.HotelAddress}</span>
          <span className="text-xs md:text-sm text-gray-400 mx-2">•</span>
          {/* <span className="text-xs md:text-sm">{distance}</span> */}
        </div>

        {/* <div className="flex flex-wrap gap-2 mb-4">
          {hotel.HotelFacilities.slice(0, 4).map(
            (facility: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm text-gray-600"
              >
                {facility}
              </span>
            )
          )}
          {hotel.HotelFacilities.length > 4 && (
            <span className="text-xs md:text-sm text-blue-600">
              +{hotel.HotelFacilities.length - 4} more
            </span>
          )}
        </div> */}

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs md:text-sm font-medium">
              {hotel.HotelName}
            </div>
            {/* <div className="text-xs md:text-sm text-gray-600">
              Check-in: {hotel.CheckInTime} • Check-out: {hotel.CheckOutTime}
            </div> */}
            {/* {hotel.Rooms[0]?.IsRefundable && (
              <div className="text-green-600 text-xs md:text-sm mt-1">
                Free cancellation available
              </div>
            )} */}
          </div>
          <div className="text-right">
            {/* <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-xs md:text-sm text-gray-500 line-through">
                ₹
                {Math.round(
                  hotel.Price.OfferedPriceRoundedOff
                ).toLocaleString()}
              </span>
              <span className="text-xs md:text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                20% OFF
              </span>
            </div> */}
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              ₹{hotel.Price.OfferedPriceRoundedOff}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mb-2">
              {searchParams.get("adults")} guests, {searchParams.get("rooms")}{" "}
              room
            </div>
            <Button
              onClick={onClick}
              className="bg-blue-600 text-xs hover:bg-blue-700 text-white w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
