// // File: components/RoomCard/index.tsx
// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { BedDouble, Utensils, Check } from "lucide-react";
// import { Room } from "@/types";
// // import { BookingModal } from './BookingModal';
// import { BookingModal } from "../../app/hotels/booking/page";

// export const RoomCard = ({ room }: { room: Room }) => {
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const discountedPrice = Math.floor(room.TotalFare * 0.8);

//   const amenityIcons: Record<string, string> = {
//     AC: "❄️",
//     TV: "📺",
//     Wifi: "📶",
//     Breakfast: "🍳",
//     "Mini Bar": "🍷",
//     Safe: "🔒",
//     "Room Service": "🛎️",
//     "Coffee Maker": "☕️",
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg p-4">
//         <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
//           <div>
//             <h3 className="font-bold text-lg">{room.Name[0]}</h3>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge variant="outline" className="bg-green-50">
//                 Best Seller 🔥
//               </Badge>
//             </div>
//           </div>
//           <div className="text-right mt-2 sm:mt-0">
//             <div className="text-gray-400 line-through text-sm">
//               ₹{room.TotalFare.toLocaleString()}
//             </div>
//             <div className="text-xl font-bold text-blue-600">
//               ₹{discountedPrice.toLocaleString()}
//             </div>
//             <div className="text-sm text-gray-600">+₹{room.TotalTax} taxes</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-sm">
//               <BedDouble className="w-4 h-4 text-gray-600" />
//               <span>Fits 2 Adults</span>
//             </div>
//             {room.MealType && (
//               <div className="flex items-center gap-2 text-sm">
//                 <Utensils className="w-4 h-4 text-gray-600" />
//                 <span>{room.MealType}</span>
//               </div>
//             )}
//           </div>
//           <div className="space-y-2">
//             {room.IsRefundable && (
//               <div className="flex items-center gap-2 text-sm text-green-600">
//                 <Check className="w-4 h-4" />
//                 <span>Free cancellation</span>
//               </div>
//             )}
//             {room.Inclusion && (
//               <div className="text-sm text-gray-600">
//                 Includes: {room.Inclusion.split(",")[0]}...
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="border-t border-b py-3 mb-4">
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {room.Inclusion?.split(",")
//               .slice(0, 6)
//               .map((amenity, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-2 text-sm text-gray-600"
//                 >
//                   <span>{amenityIcons[amenity.trim()] || "✨"}</span>
//                   <span className="truncate">{amenity.trim()}</span>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {room.IsRefundable &&
//           room.CancelPolicies &&
//           room.CancelPolicies.length > 0 && (
//             <div className="mb-4 bg-green-50 rounded-lg p-3">
//               <div className="text-sm text-green-800 font-medium mb-2">
//                 Cancellation Policy
//               </div>
//               {room.CancelPolicies.map((policy, idx) => (
//                 <div
//                   key={idx}
//                   className="text-xs text-green-700 flex items-start gap-2"
//                 >
//                   <div className="w-1 h-1 rounded-full bg-green-700 mt-1.5"></div>
//                   <span>
//                     {policy.ChargeType === "Percentage"
//                       ? `${policy.CancellationCharge}% charge`
//                       : `₹${policy.CancellationCharge} charge`}
//                     if cancelled after{" "}
//                     {new Date(policy.FromDate).toLocaleDateString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}

//         <Button
//           onClick={() => setIsBookingModalOpen(true)}
//           className="w-full bg-blue-600 hover:bg-blue-700"
//         >
//           Book Now 🚀
//         </Button>
//       </div>

//       <BookingModal
//         isOpen={isBookingModalOpen}
//         onClose={() => setIsBookingModalOpen(false)}
//         room={selectedRoom} // Must be null or full Room object
//         roomsCount={parseInt(searchParams.get("rooms") || "1")}
//         adultsCount={parseInt(searchParams.get("adults") || "1")}
//       />
//       {/* <BookingModal
//         isOpen={isBookingModalOpen}
//         onClose={() => setIsBookingModalOpen(false)}
//         room={room}
//       /> */}
//     </>
//   );
// };

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Utensils, Check } from "lucide-react";
import { Room } from "@/types";
import { BookingModal } from "./BookingModal";
import {
  HotelDetailsInterface,
  HotelRoomDetails,
} from "@/services/hotelService";

interface RoomCardProps {
  room: HotelRoomDetails;
  roomsCount: number;
  adultsCount: number;
  hotelData: HotelDetailsInterface;
  hotelId: String;
}

export const RoomCard = ({
  room,
  roomsCount,
  adultsCount,
  hotelData,
  hotelId,
}: RoomCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const discountedPrice = room.Price.OfferedPriceRoundedOff; //Math.floor(room.Price.OfferedPriceRoundedOff * 0.8);

  const amenityIcons: Record<string, string> = {
    AC: "❄️",
    TV: "📺",
    Wifi: "📶",
    Breakfast: "🍳",
    "Mini Bar": "🍷",
    Safe: "🔒",
    "Room Service": "🛎️",
    "Coffee Maker": "☕️",
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg">{room.RoomTypeName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-green-50 text-green-800">
                Best Seller 🔥
              </Badge>
            </div>
          </div>
          <div className="text-right mt-2 sm:mt-0">
            <div className="text-gray-400 line-through text-sm">
              ₹{room.Price.OfferedPriceRoundedOff.toLocaleString()}
            </div>
            <div className="text-xl font-bold text-blue-600">
              ₹{discountedPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              +₹{room.Price.Tax} taxes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="w-4 h-4 text-gray-600" />
              <span>Fits 2 Adults</span>
            </div>
            {/* {room.MealType && (
              <div className="flex items-center gap-2 text-sm">
                <Utensils className="w-4 h-4 text-gray-600" />
                <span>{room.MealType}</span>
              </div>
            )} */}
          </div>
          <div className="space-y-2">
            {/* {room.IsRefundable && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Check className="w-4 h-4" />
                <span>Free cancellation</span>
              </div>
            )} */}
            {room.Inclusion && (
              <div className="text-sm text-gray-600">
                Includes: {room.Inclusion}...
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-b py-3 mb-4">
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {room.Inclusion?.split(",")
              .slice(0, 6)
              .map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span>{amenityIcons[amenity.trim()] || "✨"}</span>
                  <span className="truncate">{amenity.trim()}</span>
                </div>
              ))}
          </div> */}
        </div>

        {room.CancellationPolicy && (
          <div className="mb-4 bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-800 font-medium mb-2">
              Cancellation Policy
            </div>
            <div
              // key={idx}
              className="text-xs text-green-700 flex items-start gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-green-700 mt-1.5"></div>
              <span>
                {room.CancellationPolicy}
                {/* {policy.ChargeType === "Percentage"
                    ? `${policy.CancellationCharge}% charge`
                    : `₹${policy.CancellationCharge} charge`}
                  if cancelled after{" "}
                  {new Date(policy.FromDate).toLocaleDateString()} */}
              </span>
            </div>
            {/* {room.CancelPolicies.map((policy, idx) => (
              <div
                key={idx}
                className="text-xs text-green-700 flex items-start gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-green-700 mt-1.5"></div>
                <span>
                  {policy.ChargeType === "Percentage"
                    ? `${policy.CancellationCharge}% charge`
                    : `₹${policy.CancellationCharge} charge`}
                  if cancelled after{" "}
                  {new Date(policy.FromDate).toLocaleDateString()}
                </span>
              </div>
            ))} */}
          </div>
        )}

        <Button
          onClick={() => setIsBookingModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Book Now 🚀
        </Button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={room}
        roomsCount={roomsCount}
        adultsCount={adultsCount}
        hotelData={hotelData}
        hotelId={hotelId}
      />
    </>
  );
};
