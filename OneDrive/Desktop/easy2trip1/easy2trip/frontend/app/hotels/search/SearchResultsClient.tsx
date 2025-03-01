"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { HotelCard, HotelSkeleton, LazyImage } from "./HotelComponents";
import { Loader2, Calendar, Search, Star, MapPin } from "lucide-react";
export interface Hotel {
  IsHotDeal: boolean;
  ResultIndex: number;
  HotelCode: string;
  HotelName: string;
  HotelCategory: string;
  StarRating: number;
  HotelDescription: string;
  HotelPromotion: string;
  HotelPolicy: string;
  Price: {
    CurrencyCode: string;
    RoomPrice: number;
    Tax: number;
    ExtraGuestCharge: number;
    ChildCharge: number;
    OtherCharges: number;
    Discount: number;
    PublishedPrice: number;
    PublishedPriceRoundedOff: number;
    OfferedPrice: number;
    OfferedPriceRoundedOff: number;
    AgentCommission: number;
    AgentMarkUp: number;
    ServiceTax: number;
    TCS: number;
    TDS: number;
    ServiceCharge: number;
    TotalGSTAmount: number;
    GST: {
      CGSTAmount: number;
      CGSTRate: number;
      CessAmount: number;
      CessRate: number;
      IGSTAmount: number;
      IGSTRate: number;
      SGSTAmount: number;
      SGSTRate: number;
      TaxableAmount: number;
    };
  };
  HotelPicture: string;
  HotelAddress: string;
  HotelContactNo: string;
  HotelMap: string | null;
  Latitude: string;
  Longitude: string;
  HotelLocation: string | null;
  SupplierPrice: number | null;
  RoomDetails: RoomDetail[];
}

interface RoomDetail {
  Name: string;
  TotalFare: number;
  IsRefundable: boolean;
}

export default function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  // State for editable search parameters
  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") || ""
  );
  const [checkInDate, setCheckInDate] = useState(
    searchParams.get("checkIn") || ""
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get("checkOut") || ""
  );
  const [guests, setGuests] = useState(() => {
    const guestsParam = searchParams.get("guests");
    return guestsParam ? JSON.parse(guestsParam) : [];
  });
  const [sortOrder, setSortOrder] = useState<
    "recommended" | "price_asc" | "price_desc" | "rating"
  >("recommended");
  
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    starRating: [] as number[],
    facilities: [] as string[],
  });

  // const uniqueFacilities = useMemo(
  //   () => [...new Set(hotels.flatMap((h) => h.HotelFacilities))],
  //   [hotels]
  // );

  const priceRange = useMemo(
    () => ({
      min: hotels.length
        ? Math.min(...hotels.flatMap((h) => h.Price.PublishedPriceRoundedOff))
        : 0,
      max: hotels.length
        ? Math.max(...hotels.flatMap((h) => h.Price.PublishedPriceRoundedOff))
        : 50000,
    }),
    [hotels]
  );

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const lowestPrice = Math.min(hotel.Price.PublishedPriceRoundedOff);
      const matchesPrice =
        lowestPrice >= filters.priceRange[0] &&
        lowestPrice <= filters.priceRange[1];
      const matchesRating =
        filters.starRating.length === 0 ||
        filters.starRating.includes(hotel.StarRating);
      // const matchesFacilities =
      //   filters.facilities.length === 0 ||
      //   filters.facilities.every((f) => hotel.HotelFacilities.includes(f));
      return matchesPrice && matchesRating; //&& matchesFacilities;
    });

    switch (sortOrder) {
      // case "price_asc":
      //   return result.sort(
      //     (a, b) =>
      //       Math.min(...a.Rooms.map((r) => r.TotalFare)) -
      //       Math.min(...b.Rooms.map((r) => r.TotalFare))
      //   );
      // case "price_desc":
      //   return result.sort(
      //     (a, b) =>
      //       Math.min(...b.Rooms.map((r) => r.TotalFare)) -
      //       Math.min(...a.Rooms.map((r) => r.TotalFare))
      //   );
      // case "rating":
      //   return result.sort(
      //     (a, b) => parseInt(b.HotelRating) - parseInt(a.HotelRating)
      //   );
      default:
        return result;
    }
  }, [hotels, filters, sortOrder]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const handleModifySearch = () => {
    // Validate required fields
    if (!locationInput || !checkInDate || !checkOutDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate check-out date is after check-in date
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Check-out date must be after check-in date");
      return;
    }

    // Create new search parameters
    const newParams = new URLSearchParams({
      location: locationInput,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests : guests,
    });

    router.push(`/hotels/search?${newParams.toString()}`);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const paxRooms = guests.map(room => ({
          ...room,
          ChildAge: room.ChildAge.map(age => Number(age))
        }));
        const response = await fetch(
          "https://easy2trip.com/easy2trip/api/hotels/search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: searchParams.get("location"),
              cityId: "130443",
              checkIn: searchParams.get("checkIn"),
              checkOut: searchParams.get("checkOut"),
              guestNationality: "IN",
              noOfRooms: guests.length,
              paxRooms: paxRooms,
              ResponseTime: 10.0,
              IsDetailedResponse: true,
              Filters: {
                Refundable: false,
                NoOfRooms: parseInt(searchParams.get("rooms") || "1"),
                MealType: 0,
                OrderBy: 0,
                StarRating: 0,
                HotelName: null,
              },
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setTraceId(data?.HotelSearchResult.TraceId);

        if (data?.HotelSearchResult.HotelResults) {
          console.log("Hotels Data", data?.HotelSearchResult.HotelResults);
          setHotels(data?.HotelSearchResult.HotelResults);
          const prices = data?.HotelSearchResult.HotelResults.flatMap(
            (h: Hotel) => h.Price.PublishedPriceRoundedOff
          );
          setFilters((prev) => ({
            ...prev,
            priceRange: [Math.min(...prices), Math.max(...prices)],
          }));
        }
      } catch (err) {
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchHotels, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse" />
        </div>
        <div className="flex">
          <div className="w-80 bg-white p-6 min-h-screen">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded mb-4 animate-pulse"
              />
            ))}
          </div>
          <div className="flex-1 p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <HotelSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                defaultValue={searchParams.get("location") || ""}
                placeholder="Where are you going?"
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="text-sm">
                <div className="font-medium">
                  {formatDate(searchParams.get("checkIn"))} -{" "}
                  {formatDate(searchParams.get("checkOut"))}
                </div>
                <div className="text-gray-500 text-xs">
                  {searchParams.get("adults")} Adults,{" "}
                  {searchParams.get("rooms")} Room
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Modify Search
            </Button>
          </div>
        </div>
      </div> */}
      <div className="bg-white border-b md:sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
            {/* Location Input */}
            <div className="w-full relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Where are you going?"
                className="pl-10 text-sm md:text-base"
              />
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-2 border rounded-md px-3 py-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="text-xs md:text-sm">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-transparent focus:outline-none"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="bg-transparent focus:outline-none"
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {/* {parseInt(searchParams.get("adults") || 1} Adults,{" "}
                {parseInt(searchParams.get("rooms") || 1} Rooms */}
                </div>
              </div>
            </div>

            {/* Modified Search Button */}
            <Button
              onClick={handleModifySearch}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Update Search
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row">
        <div className="w-100 md:w-80 bg-white p-6 sticky top-0 md:top-24 md:h-[calc(100vh-6rem)] overflow-y-auto z-10">
          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-6 justify-between z-2">
            <div className="wd-30 md:w-full">
              <h2 className="font-semibold mb-4 text-sm md:text-base">
                Price Range
              </h2>
              <div className="space-y-2 md:space-y-4">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [
                        prev.priceRange[0],
                        parseInt(e.target.value),
                      ],
                    }))
                  }
                  className="w-full accent-blue-600"
                />
                <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm text-gray-600">
                  <span>₹{priceRange.min.toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="wd-30 md:w-full">
              <h2 className="font-semibold mb-4 text-sm md:text-base">
                Star Rating
              </h2>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.starRating.includes(rating)}
                      onChange={(e) => {
                        const newRatings = e.target.checked
                          ? [...filters.starRating, rating]
                          : filters.starRating.filter((r) => r !== rating);
                        setFilters((prev) => ({
                          ...prev,
                          starRating: newRatings,
                        }));
                      }}
                      className="rounded border-gray-300 text-xs md:text-base text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex text-xs md:text-base">
                      {Array(rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="wd-30 md:w-full">
              <h2 className="font-semibold mb-4 text-sm md:text-base">
                Popular Facilities
              </h2>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {/* {uniqueFacilities.slice(0, 15).map((facility) => (
                  <label
                    key={facility}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.facilities.includes(facility)}
                      onChange={(e) => {
                        const newFacilities = e.target.checked
                          ? [...filters.facilities, facility]
                          : filters.facilities.filter((f) => f !== facility);
                        setFilters((prev) => ({
                          ...prev,
                          facilities: newFacilities,
                        }));
                      }}
                      className="rounded border-gray-300 text-xs md:text-base text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs md:text-sm">{facility}</span>
                  </label>
                ))} */}
              </div>
            </div>
          </div>
          {(filters.starRating.length > 0 ||
            filters.facilities.length > 0 ||
            filters.priceRange[1] !== priceRange.max) && (
            <Button
              onClick={() =>
                setFilters({
                  priceRange: [0, priceRange.max],
                  starRating: [],
                  facilities: [],
                })
              }
              variant="outline"
              className="w-full text-sm md:text-base mt-2 md:mt-6"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        <div className="flex-1 p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {filteredHotels.length}{" "}
              {filteredHotels.length === 1 ? "hotel" : "hotels"} in{" "}
              {searchParams.get("location")}
            </h1>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="border rounded-md p-2"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          <div className="space-y-6">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.HotelCode}
                hotel={hotel}
                searchParams={searchParams}
                onClick={() => {
                  //   const params = new URLSearchParams({
                  //     id: hotel._id,
                  //     hotelName: hotel.HotelName,
                  //     address: hotel.Address,
                  //     rating: hotel.HotelRating,
                  //     images: JSON.stringify(hotel.Images),
                  //     facilities: JSON.stringify(hotel.HotelFacilities),
                  //     rooms: JSON.stringify(hotel.Rooms),
                  //     checkInTime: hotel.CheckInTime,
                  //     checkOutTime: hotel.CheckOutTime,
                  //     map: hotel.Map || "",
                  //   });
                  //   router.push(`/hotels/${hotel._id}?${params.toString()}`);
                  localStorage.setItem(
                    `hotel_${hotel.HotelCode}`,
                    JSON.stringify({
                      id: hotel.HotelCode,
                      resultIndex: hotel.ResultIndex,
                      traceId: traceId,

                      // facilities: JSON.stringify(hotel.HotelFacilities),
                      // rooms: JSON.stringify(hotel.Rooms),
                      // checkInTime: hotel.CheckInTime,
                      // checkOutTime: hotel.CheckOutTime,
                      // phoneNumber: hotel.PhoneNumber || "",
                      // faxNumber: hotel.FaxNumber || "",
                      // attractions: JSON.stringify(hotel.Attractions || []),
                      // map: hotel.Map || "",
                    })
                  );

                  // Open the new page with only the hotel ID
                  // window.open(`/hotels/id=${hotel._id}`, "_blank");
                  //   window.open(
                  //     `/hotels/${hotel._id}?${new URLSearchParams({
                  //       id: hotel._id,
                  //       rooms: searchParams.get("rooms") || "1", // Fallback to "1" if null
                  //       adults: searchParams.get("adults") || "1", // Fallback to "1" if null
                  //       map: hotel.Map || "",
                  //     }).toString()}`,
                  //     "_blank"
                  //   );
                  router.push(
                    `/hotels/${hotel.HotelCode}?${new URLSearchParams({
                      id: hotel.HotelCode,
                      rooms: searchParams.get("rooms") || "1",
                      adults: searchParams.get("adults") || "1",
                      // map: hotel.Map || "",
                    }).toString()}`
                  );
                }}
              />
            ))}
          </div>

          {filteredHotels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hotels found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or changing your search criteria
              </p>
              <Button
                onClick={() =>
                  setFilters({
                    priceRange: [0, priceRange.max],
                    starRating: [],
                    facilities: [],
                  })
                }
                className="mt-4"
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
