"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import {
  HotelDetailsInterface,
  HotelRoomDetails,
} from "@/services/hotelService";

// Complete Room interface
interface Room {
  Name: string[];
  TotalFare: number;
  BookingCode: string;
  Inclusion?: string;
  DayRates?: Array<Array<{ BasePrice: number }>>;
  RoomPromotion?: string[];
  // Add other required room properties
}

interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  email?: string;
  phone?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: HotelRoomDetails;
  roomsCount: number;
  adultsCount: number;
  hotelData: HotelDetailsInterface;
  hotelId: String;
}

const DEFAULT_ROOM: Room = {
  Name: ["Unknown Room Type"],
  TotalFare: 0,
  BookingCode: "DEFAULT_CODE",
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

export function BookingModalContent({
  isOpen,
  onClose,
  room, //= DEFAULT_ROOM,
  roomsCount = 1,
  adultsCount = 1,
  hotelData,
  hotelId,
}: BookingModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = roomsCount;
  // const hotelRoomsDetails = [];

  // Initialize guests array with proper type safety
  const [guestDetails, setGuestDetails] = useState<GuestDetails[]>(() => {
    const guests: GuestDetails[] = [];
    for (let i = 0; i < adultsCount; i++) {
      guests.push({
        title: "",
        firstName: "",
        lastName: "",
        age: "",
        ...(i === 0 && { email: "", phone: "" }),
      });
    }
    return guests;
  });

  const guestsPerRoom = useMemo(() => {
    const rooms: GuestDetails[][] = [];
    let guests = [...guestDetails];
    const baseGuests = Math.floor(adultsCount / roomsCount);
    let remaining = adultsCount % roomsCount;

    for (let i = 0; i < roomsCount; i++) {
      const count = baseGuests + (remaining > 0 ? 1 : 0);
      rooms.push(guests.splice(0, count));
      remaining = Math.max(0, remaining - 1);
    }
    return rooms;
  }, [guestDetails, roomsCount, adultsCount]);

  const handleInputChange = (
    guestIndex: number,
    field: string,
    value: string
  ) => {
    const newGuests = guestDetails.map((guest, index) =>
      index === guestIndex ? { ...guest, [field]: value } : guest
    );
    setGuestDetails(newGuests);
  };

  const validateCurrentStep = () => {
    const currentGuests = guestsPerRoom[currentStep - 1];
    return currentGuests.every((guest, index) => {
      const isValid =
        guest.title && guest.firstName && guest.lastName && guest.age;
      if (currentStep === 1 && index === 0) {
        return (
          isValid && validateEmail(guest.email!) && validatePhone(guest.phone!)
        );
      }
      return isValid;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hotelPassenger = guestDetails.map((guest, index) => ({
        Title: guest.title,
        FirstName: guest.firstName,
        LastName: guest.lastName,
        Email: index === 0 ? guest.email : undefined,
        Phone: index === 0 ? guest.phone : undefined,
        PaxType: index === 0 ? 1 : 2,
        LeadPassenger: index === 0,
        Age: parseInt(guest.age),
        // Include other necessary fields from Room
        BookingCode: room!.RoomIndex,
        TotalFare: room!.Price.OfferedPriceRoundedOff,
      }));
      const storedHotelData = localStorage.getItem(`hotel_${hotelId}`);
      console.log("Stored hotel data:", storedHotelData);
      let resultIndex = "";
      let traceId = "";
      if (storedHotelData) {
        const parsedData = JSON.parse(storedHotelData);
        resultIndex = parsedData.resultIndex;
        traceId = parsedData.traceId;
      }

      const response = await fetch("/api/hotels/blockRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultIndex: resultIndex,
          hotelCode: hotelData!.HotelCode,
          hotelName: hotelData!.HotelName,
          guestNationality: "IN",
          noOfRooms: roomsCount,
          clientReferenceNo: "0",
          isVoucherBooking: "true",
          hotelRoomsDetails: [
            {
              RoomIndex: room!.RoomIndex,
              RoomTypeCode: room!.RoomTypeCode,

              RoomTypeName: room!.RoomTypeName,
              RatePlanCode: room!.RatePlanCode,
              BedTypeCode: null,
              SmokingPreference: 0,
              Supplements: null,
              Price: {
                CurrencyCode: room!.Price.CurrencyCode,
                RoomPrice: room!.Price.RoomPrice,
                Tax: room!.Price.Tax,
                ExtraGuestCharge: room!.Price.ExtraGuestCharge,
                ChildCharge: room!.Price.ChildCharge,
                OtherCharges: room!.Price.OtherCharges,
                Discount: room!.Price.Discount,
                PublishedPrice: room!.Price.PublishedPrice,
                PublishedPriceRoundedOff: room!.Price.PublishedPriceRoundedOff,
                OfferedPrice: room!.Price.OfferedPrice,
                OfferedPriceRoundedOff: room!.Price.OfferedPriceRoundedOff,
                AgentCommission: room!.Price.AgentCommission,
                AgentMarkUp: room!.Price.AgentMarkUp,
                TDS: room!.Price.TDS,
              },
              HotelPassenger: hotelPassenger,
            },
          ],
          traceId: traceId,
          // rooms: roomsCount,
          // guests: hotelPassenger,
          // totalAmount: room!.Price.OfferedPriceRoundedOff * roomsCount,
        }),
      });

      const responseHotel = await fetch("/api/hotels/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultIndex: resultIndex,
          hotelCode: hotelData!.HotelCode,
          hotelName: hotelData!.HotelName,
          guestNationality: "IN",
          noOfRooms: roomsCount,
          clientReferenceNo: "0",
          isVoucherBooking: "true",
          hotelRoomsDetails: [
            {
              RoomIndex: room!.RoomIndex,
              RoomTypeCode: room!.RoomTypeCode,

              RoomTypeName: room!.RoomTypeName,
              RatePlanCode: room!.RatePlanCode,
              BedTypeCode: null,
              SmokingPreference: 0,
              Supplements: null,
              Price: {
                CurrencyCode: room!.Price.CurrencyCode,
                RoomPrice: room!.Price.RoomPrice,
                Tax: room!.Price.Tax,
                ExtraGuestCharge: room!.Price.ExtraGuestCharge,
                ChildCharge: room!.Price.ChildCharge,
                OtherCharges: room!.Price.OtherCharges,
                Discount: room!.Price.Discount,
                PublishedPrice: room!.Price.PublishedPrice,
                PublishedPriceRoundedOff: room!.Price.PublishedPriceRoundedOff,
                OfferedPrice: room!.Price.OfferedPrice,
                OfferedPriceRoundedOff: room!.Price.OfferedPriceRoundedOff,
                AgentCommission: room!.Price.AgentCommission,
                AgentMarkUp: room!.Price.AgentMarkUp,
                TDS: room!.Price.TDS,
              },
              HotelPassenger: hotelPassenger,
            },
          ],
          traceId: traceId,
          // rooms: roomsCount,
          // guests: hotelPassenger,
          // totalAmount: room!.Price.OfferedPriceRoundedOff * roomsCount,
        }),
      });
      if (!response.ok) throw new Error("Booking failed");
      router.push("/hotels/confirmation");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGuestForm = (
    guest: GuestDetails,
    guestIndex: number,
    roomIndex: number
  ) => (
    <div key={`${roomIndex}-${guestIndex}`} className="space-y-4">
      <div className="flex gap-4">
        <div className="space-y-2 w-full">
          <Label>Title</Label>
          <Select
            value={guest.title}
            onValueChange={(value) =>
              handleInputChange(
                guestsPerRoom.slice(0, roomIndex).flat().length + guestIndex,
                "title",
                value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label>First Name</Label>
          <Input
            value={guest.firstName}
            onChange={(e) =>
              handleInputChange(
                guestsPerRoom.slice(0, roomIndex).flat().length + guestIndex,
                "firstName",
                e.target.value
              )
            }
            placeholder="First name"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label>Last Name</Label>
          <Input
            value={guest.lastName}
            onChange={(e) =>
              handleInputChange(
                guestsPerRoom.slice(0, roomIndex).flat().length + guestIndex,
                "lastName",
                e.target.value
              )
            }
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 w-full">
          <Label>Age</Label>
          <Input
            type="number"
            value={guest.age}
            onChange={(e) =>
              handleInputChange(
                guestsPerRoom.slice(0, roomIndex).flat().length + guestIndex,
                "age",
                e.target.value
              )
            }
            placeholder="Age"
            min="1"
            max="100"
          />
        </div>

        {roomIndex === 0 && guestIndex === 0 && (
          <>
            <div className="space-y-2 w-full">
              <Label>Email</Label>
              <Input
                type="email"
                value={guest.email}
                onChange={(e) =>
                  handleInputChange(
                    guestsPerRoom.slice(0, roomIndex).flat().length +
                      guestIndex,
                    "email",
                    e.target.value
                  )
                }
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={guest.phone}
                onChange={(e) =>
                  handleInputChange(
                    guestsPerRoom.slice(0, roomIndex).flat().length +
                      guestIndex,
                    "phone",
                    e.target.value
                  )
                }
                placeholder="Phone number"
                pattern="[0-9]{10}"
              />
            </div>
          </>
        )}
      </div>
      {guestIndex < guestsPerRoom[roomIndex].length - 1 && (
        <Separator className="my-4" />
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Booking</span>
            <div className="text-sm text-gray-500">
              Room {currentStep} of {roomsCount}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Room Type:</span>{" "}
                {room!.RoomTypeName || "Standard Room"}
              </div>
              <div>
                <span className="text-gray-600">Total:</span> ₹
                {(
                  room!.Price.OfferedPriceRoundedOff * roomsCount
                ).toLocaleString()}
              </div>
              <div>
                <span className="text-gray-600">Rooms:</span> {roomsCount}
              </div>
              <div>
                <span className="text-gray-600">Guests:</span> {adultsCount}
              </div>
            </div>
          </div>

          {guestsPerRoom.map((roomGuests, roomIndex) => (
            <div
              key={roomIndex}
              className={currentStep === roomIndex + 1 ? "block" : "hidden"}
            >
              <h2 className="text-lg font-semibold mb-4">
                Room {roomIndex + 1} Guests
              </h2>
              {roomGuests.map((guest, guestIndex) =>
                renderGuestForm(guest, guestIndex, roomIndex)
              )}
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <div className="flex w-full justify-between items-center">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Previous Room
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentStep}/{roomsCount}
              </span>

              {currentStep < roomsCount ? (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!validateCurrentStep()}
                >
                  Next Room
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

BookingModalContent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.shape({
    Name: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    TotalFare: PropTypes.number.isRequired,
    BookingCode: PropTypes.string.isRequired,
  }),
  roomsCount: PropTypes.number.isRequired,
  adultsCount: PropTypes.number.isRequired,
};

export function BookingModal({
  isOpen,
  onClose,
  room,
  roomsCount,
  adultsCount,
  hotelData,
  hotelId,
}: BookingModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <BookingModalContent
        isOpen={isOpen}
        onClose={onClose}
        room={room}
        roomsCount={roomsCount}
        adultsCount={adultsCount}
        hotelData={hotelData}
        hotelId={hotelId}
      />
    </Suspense>
  );
}

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.shape({
    Name: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    TotalFare: PropTypes.number.isRequired,
    BookingCode: PropTypes.string.isRequired,
  }),
  roomsCount: PropTypes.number.isRequired,
  adultsCount: PropTypes.number.isRequired,
};
