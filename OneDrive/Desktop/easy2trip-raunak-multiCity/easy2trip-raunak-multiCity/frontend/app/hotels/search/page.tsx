// "use client";

// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   Suspense,
// } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Input } from "@/components/ui/input";
// import { Header } from "../../components/header";
// import { Footer } from "../../components/footer";
// import {
//   Star,
//   MapPin,
//   Loader2,
//   ArrowLeft,
//   Search,
//   Calendar,
//   Users,
//   Coffee,
//   Wifi,
//   Car,
//   CreditCard,
// } from "lucide-react";

// // Types
// interface CancelPolicy {
//   FromDate: string;
//   ChargeType: string;
//   CancellationCharge: number;
// }

// interface Room {
//   Name: string[];
//   BookingCode: string;
//   Inclusion: string;
//   DayRates: Array<Array<{ BasePrice: number }>>;
//   TotalFare: number;
//   TotalTax: number;
//   RoomPromotion: string[];
//   CancelPolicies: CancelPolicy[];
//   MealType: string;
//   IsRefundable: boolean;
// }

// interface Hotel {
//   _id: string;
//   HotelCode: string;
//   HotelName: string;
//   Address: string;
//   Description: string;
//   HotelRating: string;
//   Images: string[];
//   HotelFacilities: string[];
//   CheckInTime: string;
//   CheckOutTime: string;
//   PhoneNumber?: string;
//   FaxNumber?: string;
//   Attractions?: Array<{ [key: string]: string }>;
//   Map?: string;
//   Rooms: Room[];
// }

// // LazyImage component
// const LazyImage = ({
//   src,
//   alt,
//   className,
// }: {
//   src: string;
//   alt: string;
//   className?: string;
// }) => {
//   const [loaded, setLoaded] = useState(false);

//   return (
//     <div className={`relative ${className}`}>
//       {!loaded && (
//         <div className="absolute inset-0 bg-gray-200 animate-pulse" />
//       )}
//       <img
//         src={src}
//         alt={alt}
//         className={`${className} ${
//           loaded ? "opacity-100" : "opacity-0"
//         } transition-opacity duration-300`}
//         onLoad={() => setLoaded(true)}
//         loading="lazy"
//       />
//     </div>
//   );
// };

// // Skeleton loading component
// const HotelSkeleton = () => (
//   <div className="bg-white rounded-lg p-6 flex gap-6 animate-pulse">
//     <div className="w-72 h-48 bg-gray-200 rounded-lg" />
//     <div className="flex-1">
//       <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
//       <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
//       <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
//       <div className="space-y-2">
//         <div className="h-4 bg-gray-200 rounded w-2/3" />
//         <div className="h-4 bg-gray-200 rounded w-1/2" />
//       </div>
//       <div className="flex justify-between items-end mt-8">
//         <div className="space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-24" />
//           <div className="h-4 bg-gray-200 rounded w-32" />
//         </div>
//         <div className="space-y-2">
//           <div className="h-8 bg-gray-200 rounded w-32" />
//           <div className="h-10 bg-gray-200 rounded w-40" />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Hotel card component
// const HotelCard = React.memo(
//   ({
//     hotel,
//     searchParams,
//     onClick,
//   }: {
//     hotel: Hotel;
//     searchParams: URLSearchParams;
//     onClick: (hotel: Hotel) => void;
//   }) => {
//     const lowestPrice = useMemo(
//       () => Math.min(...hotel.Rooms.map((r) => r.TotalFare)),
//       [hotel.Rooms]
//     );

//     const distance = useMemo(() => {
//       if (!hotel.Map) return "Location not available";
//       const [lat, lng] = hotel.Map.split("|").map(Number);
//       if (!lat || !lng) return "Location not available";

//       const cityCenter = { lat: 15.4989, lng: 73.8278 }; // Goa city center
//       const R = 6371;
//       const dLat = ((lat - cityCenter.lat) * Math.PI) / 180;
//       const dLon = ((lng - cityCenter.lng) * Math.PI) / 180;
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((cityCenter.lat * Math.PI) / 180) *
//           Math.cos((lat * Math.PI) / 180) *
//           Math.sin(dLon / 2) *
//           Math.sin(dLon / 2);
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       const distance = R * c;

//       return `${distance.toFixed(1)} km from city center`;
//     }, [hotel.Map]);

//     return (
//       <div className="bg-white rounded-lg p-6 flex gap-6 hover:shadow-lg transition-shadow">
//         <div className="w-72 h-48 bg-gray-200 rounded-lg overflow-hidden">
//           <LazyImage
//             src={hotel.Images[0]}
//             alt={hotel.HotelName}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-start mb-2">
//             <div>
//               <h2 className="text-xl font-bold hover:text-blue-600 cursor-pointer">
//                 {hotel.HotelName}
//               </h2>
//               <div className="flex items-center gap-2 mt-1">
//                 <div className="flex">
//                   {Array.from({ length: parseInt(hotel.HotelRating) }).map(
//                     (_, i) => (
//                       <Star
//                         key={i}
//                         className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                       />
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
//                 {parseFloat(hotel.HotelRating) > 4 ? "Excellent" : "Good"} 8.5+
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 text-gray-600 mb-4">
//             <MapPin className="w-4 h-4" />
//             <span className="text-sm">{hotel.Address}</span>
//             <span className="text-sm text-gray-400 mx-2">•</span>
//             <span className="text-sm">{distance}</span>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-4">
//             {hotel.HotelFacilities.slice(0, 4).map((facility, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
//               >
//                 {facility}
//               </span>
//             ))}
//             {hotel.HotelFacilities.length > 4 && (
//               <span className="text-sm text-blue-600">
//                 +{hotel.HotelFacilities.length - 4} more
//               </span>
//             )}
//           </div>

//           <div className="flex justify-between items-end">
//             <div>
//               <div className="text-sm font-medium">
//                 {hotel.Rooms[0]?.Name[0]}
//               </div>
//               <div className="text-sm text-gray-600">
//                 Check-in: {hotel.CheckInTime} • Check-out: {hotel.CheckOutTime}
//               </div>
//               {hotel.Rooms[0]?.IsRefundable && (
//                 <div className="text-green-600 text-sm mt-1">
//                   Free cancellation available
//                 </div>
//               )}
//             </div>
//             <div className="text-right">
//               <div className="flex items-center justify-end gap-2 mb-1">
//                 <span className="text-sm text-gray-500 line-through">
//                   ₹{Math.round(lowestPrice * 1.2).toLocaleString()}
//                 </span>
//                 <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
//                   20% OFF
//                 </span>
//               </div>
//               <div className="text-3xl font-bold text-blue-600">
//                 ₹{lowestPrice.toLocaleString()}
//               </div>
//               <div className="text-sm text-gray-500 mb-2">
//                 {searchParams.get("adults")} guests, {searchParams.get("rooms")}{" "}
//                 room
//               </div>
//               <Button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   localStorage.setItem(
//                     `hotel_${hotel._id}`,
//                     JSON.stringify({
//                       id: hotel._id,
//                       hotelName: hotel.HotelName,
//                       address: hotel.Address,
//                       rating: hotel.HotelRating,
//                       description: hotel.Description,
//                       images: JSON.stringify(hotel.Images),
//                       facilities: JSON.stringify(hotel.HotelFacilities),
//                       rooms: JSON.stringify(hotel.Rooms),
//                       checkInTime: hotel.CheckInTime,
//                       checkOutTime: hotel.CheckOutTime,
//                       phoneNumber: hotel.PhoneNumber || "",
//                       faxNumber: hotel.FaxNumber || "",
//                       attractions: JSON.stringify(hotel.Attractions || []),
//                       map: hotel.Map || "",
//                     })
//                   );

//                   // Open the new page with only the hotel ID
//                   // window.open(`/hotels/id=${hotel._id}`, "_blank");
//                   window.open(
//                     `/hotels/${hotel._id}?${new URLSearchParams({
//                       id: hotel._id,
//                     }).toString()}`,
//                     "_blank"
//                   );
//                 }}
//                 className="bg-blue-600 hover:bg-blue-700 text-white w-full"
//               >
//                 View Details
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// HotelCard.displayName = "HotelCard";

// // Main component
// export default function SearchResultsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<
//     "recommended" | "price_asc" | "price_desc" | "rating"
//   >("recommended");

//   // Filters state
//   const [filters, setFilters] = useState({
//     priceRange: [0, 50000],
//     starRating: [] as number[],
//     facilities: [] as string[],
//   });

//   // Memoized values
//   const uniqueFacilities = useMemo(
//     () => [...new Set(hotels.flatMap((h) => h.HotelFacilities))],
//     [hotels]
//   );

//   const priceRange = useMemo(
//     () => ({
//       min: hotels.length
//         ? Math.min(...hotels.flatMap((h) => h.Rooms.map((r) => r.TotalFare)))
//         : 0,
//       max: hotels.length
//         ? Math.max(...hotels.flatMap((h) => h.Rooms.map((r) => r.TotalFare)))
//         : 50000,
//     }),
//     [hotels]
//   );

//   // Memoized filtered and sorted hotels
//   const filteredHotels = useMemo(() => {
//     let result = hotels.filter((hotel) => {
//       const lowestPrice = Math.min(...hotel.Rooms.map((r) => r.TotalFare));
//       const matchesPrice =
//         lowestPrice >= filters.priceRange[0] &&
//         lowestPrice <= filters.priceRange[1];
//       const matchesRating =
//         filters.starRating.length === 0 ||
//         filters.starRating.includes(parseInt(hotel.HotelRating));
//       const matchesFacilities =
//         filters.facilities.length === 0 ||
//         filters.facilities.every((f) => hotel.HotelFacilities.includes(f));

//       return matchesPrice && matchesRating && matchesFacilities;
//     });

//     switch (sortOrder) {
//       case "price_asc":
//         return result.sort(
//           (a, b) =>
//             Math.min(...a.Rooms.map((r) => r.TotalFare)) -
//             Math.min(...b.Rooms.map((r) => r.TotalFare))
//         );
//       case "price_desc":
//         return result.sort(
//           (a, b) =>
//             Math.min(...b.Rooms.map((r) => r.TotalFare)) -
//             Math.min(...a.Rooms.map((r) => r.TotalFare))
//         );
//       case "rating":
//         return result.sort(
//           (a, b) => parseInt(b.HotelRating) - parseInt(a.HotelRating)
//         );
//       default:
//         return result;
//     }
//   }, [hotels, filters, sortOrder]);

//   // Handle hotel click
//   const handleHotelClick = useCallback(
//     (hotel: Hotel) => {
//       const params = new URLSearchParams({
//         id: hotel._id,
//         hotelName: hotel.HotelName,
//         address: hotel.Address,
//         rating: hotel.HotelRating,
//         description: hotel.Description,
//         images: JSON.stringify(hotel.Images),
//         facilities: JSON.stringify(hotel.HotelFacilities),
//         rooms: JSON.stringify(hotel.Rooms),
//         checkInTime: hotel.CheckInTime,
//         checkOutTime: hotel.CheckOutTime,
//         phoneNumber: hotel.PhoneNumber || "",
//         faxNumber: hotel.FaxNumber || "",
//         attractions: JSON.stringify(hotel.Attractions || []),
//         map: hotel.Map || "",
//       });

//       router.push(`/hotels/${hotel._id}?${params.toString()}`);
//     },
//     [router]
//   );

//   // Format date helper
//   const formatDate = (dateStr: string | null) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Fetch hotels
//   useEffect(() => {
//     const fetchHotels = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           "https://easy2trip.com/easy2trip/api/hotels/search",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               location: searchParams.get("location"),
//               checkIn: searchParams.get("checkIn"),
//               checkOut: searchParams.get("checkOut"),
//               guestNationality: "IN",
//               paxRooms: [
//                 {
//                   Adults: parseInt(searchParams.get("adults") || "1"),
//                   Children: parseInt(searchParams.get("children") || "0"),
//                   ChildrenAges: [],
//                 },
//               ],
//               ResponseTime: 10.0,
//               IsDetailedResponse: true,
//               Filters: {
//                 Refundable: false,
//                 NoOfRooms: parseInt(searchParams.get("rooms") || "1"),
//                 MealType: 0,
//                 OrderBy: 0,
//                 StarRating: 0,
//                 HotelName: null,
//               },
//             }),
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch hotels");

//         const data = await response.json();
//         if (data && Array.isArray(data.hotels)) {
//           setHotels(data.hotels);
//           // Initialize price range based on actual data
//           const prices = data.hotels.flatMap((h) =>
//             h.Rooms.map((r) => r.TotalFare)
//           );
//           setFilters((prev) => ({
//             ...prev,
//             priceRange: [Math.min(...prices), Math.max(...prices)],
//           }));
//         } else {
//           throw new Error("Invalid response format");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         setError("Failed to fetch hotels. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timeoutId = setTimeout(fetchHotels, 300);
//     return () => clearTimeout(timeoutId);
//   }, [searchParams]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="bg-white border-b shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4">
//             <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse" />
//           </div>
//         </div>
//         <div className="flex">
//           <div className="w-80 bg-white p-6 min-h-screen">
//             <div className="space-y-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
//                   <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
//                   <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="flex-1 p-6 space-y-6">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <HotelSkeleton key={i} />
//             ))}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       {/* Search Bar */}
//       <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <Input
//                 defaultValue={searchParams.get("location")}
//                 placeholder="Where are you going?"
//                 className="pl-10"
//               />
//             </div>
//             <div className="flex items-center gap-2 border rounded-md px-3 py-2">
//               <Calendar className="w-5 h-5 text-gray-400" />
//               <div className="text-sm">
//                 <div className="font-medium">
//                   {formatDate(searchParams.get("checkIn"))} -{" "}
//                   {formatDate(searchParams.get("checkOut"))}
//                 </div>
//                 <div className="text-gray-500 text-xs">
//                   {searchParams.get("adults")} Adults,{" "}
//                   {searchParams.get("rooms")} Room
//                 </div>
//               </div>
//             </div>
//             <Button
//               onClick={() => router.push("/")}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Modify Search
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         {/* Filters Sidebar */}
//         <div className="w-80 bg-white p-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
//           <div className="space-y-6">
//             {/* Price Range Filter */}
//             <div>
//               <h2 className="font-semibold mb-4">Price Range</h2>
//               <div className="space-y-4">
//                 <input
//                   type="range"
//                   min={priceRange.min}
//                   max={priceRange.max}
//                   value={filters.priceRange[1]}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       priceRange: [
//                         prev.priceRange[0],
//                         parseInt(e.target.value),
//                       ],
//                     }))
//                   }
//                   className="w-full accent-blue-600"
//                 />
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>₹{priceRange.min.toLocaleString()}</span>
//                   <span>₹{filters.priceRange[1].toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Star Rating Filter */}
//             <div>
//               <h2 className="font-semibold mb-4">Star Rating</h2>
//               <div className="space-y-3">
//                 {[5, 4, 3, 2, 1].map((rating) => (
//                   <label
//                     key={rating}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={filters.starRating.includes(rating)}
//                       onChange={(e) => {
//                         const newRatings = e.target.checked
//                           ? [...filters.starRating, rating]
//                           : filters.starRating.filter((r) => r !== rating);
//                         setFilters((prev) => ({
//                           ...prev,
//                           starRating: newRatings,
//                         }));
//                       }}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     <div className="flex items-center">
//                       {Array.from({ length: rating }).map((_, i) => (
//                         <Star
//                           key={i}
//                           className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                         />
//                       ))}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Facilities Filter */}
//             <div>
//               <h2 className="font-semibold mb-4">Popular Facilities</h2>
//               <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
//                 {uniqueFacilities.slice(0, 15).map((facility) => (
//                   <label
//                     key={facility}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={filters.facilities.includes(facility)}
//                       onChange={(e) => {
//                         const newFacilities = e.target.checked
//                           ? [...filters.facilities, facility]
//                           : filters.facilities.filter((f) => f !== facility);
//                         setFilters((prev) => ({
//                           ...prev,
//                           facilities: newFacilities,
//                         }));
//                       }}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm">{facility}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Clear Filters */}
//             {(filters.starRating.length > 0 ||
//               filters.facilities.length > 0 ||
//               filters.priceRange[1] !== priceRange.max) && (
//               <Button
//                 onClick={() =>
//                   setFilters({
//                     priceRange: [0, priceRange.max],
//                     starRating: [],
//                     facilities: [],
//                   })
//                 }
//                 variant="outline"
//                 className="w-full"
//               >
//                 Clear All Filters
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6">
//           {error && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="mb-6 flex justify-between items-center">
//             <h1 className="text-2xl font-bold">
//               {filteredHotels.length}{" "}
//               {filteredHotels.length === 1 ? "hotel" : "hotels"} in{" "}
//               {searchParams.get("location")}
//             </h1>
//             <select
//               className="border rounded-md p-2"
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value as any)}
//             >
//               <option value="recommended">Recommended</option>
//               <option value="price_asc">Price: Low to High</option>
//               <option value="price_desc">Price: High to Low</option>
//               <option value="rating">Rating: High to Low</option>
//             </select>
//           </div>

//           <div className="space-y-6">
//             {filteredHotels.map((hotel) => (
//               <HotelCard
//                 key={hotel._id}
//                 hotel={hotel}
//                 searchParams={searchParams}
//                 onClick={handleHotelClick}
//               />
//             ))}
//           </div>

//           {filteredHotels.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 mb-4">
//                 <Search className="w-12 h-12 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No hotels found
//               </h3>
//               <p className="text-gray-600">
//                 Try adjusting your filters or changing your search criteria
//               </p>
//               <Button
//                 onClick={() =>
//                   setFilters({
//                     priceRange: [0, priceRange.max],
//                     starRating: [],
//                     facilities: [],
//                   })
//                 }
//                 className="mt-4"
//                 variant="outline"
//               >
//                 Clear All Filters
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// SearchResultsContent;

// export function SearchResults() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SearchResultsContent />
//     </Suspense>
//   );
// }

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Loader2 } from "lucide-react";

const SearchResultsContent = dynamic(() => import("./SearchResultsClient"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
    </div>
  ),
});

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        }
      >
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
