"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NavigationMenu } from "../components/navigation-menu";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ExploreMore } from "../components/explore-more";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// import { ChevronDown, Search, MapPin, CalendarIcon, Users } from "lucide-react";
import { Offers } from "../components/offers";
import { FeaturedTours } from "../components/featured-tours";
import { FlightOfferDeals } from "../components/flight-offer-deals";
import { TopRatedHotels } from "../components/top-rated-hotels";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  Building,
  Users2,
} from "lucide-react";
import GuestsForm from "./components/GuestsForm"

export default function HotelsPage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState([{ adults: 1, children: 0, ChildAge: [] }]);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [searchType, setSearchType] = useState<"rooms" | "group">("rooms");

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      alert("Please fill in all required fields");
      return;
    }

    const searchParams = new URLSearchParams({
      location: location,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests: JSON.stringify(guests),
    });

    router.push(`/hotels/search?${searchParams.toString()}`);
  };

  const popularDestinations = [
    "Goa",
    "Mumbai",
    "Delhi",
    "Jaipur",
    "Bangalore",
    "Chennai",
    "Kerala",
    "Agra",
    "Udaipur",
    "Shimla",
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="w-full mx-auto bg-white px- sm:px-4 lg:px-0 my- sm:my-0">
        <div className="bg-white flex-col justify-center items-center relative p-2 sm:p-4 shadow-lg rounded-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/bg5.jpg"
              alt="Travel Background"
              layout="fill"
              objectFit="cover"
              quality={90}
            />
          </div>
          <div className="w-full overflow-x-hidden z-10">
            <NavigationMenu />
          </div>

          <Card className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border-0 mt-10">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find your perfect stay
                </h2>
                <p className="text-gray-700">
                  Search deals on hotels, homes, and much more...
                </p>
              </div>

              {/* Booking Type Selection */}
              <RadioGroup
                defaultValue={searchType}
                onValueChange={setSearchType}
                className="flex flex-wrap gap-4 mb-6"
              >
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border hover:border-blue-500 transition-all cursor-pointer">
                  <RadioGroupItem
                    value="rooms"
                    id="rooms"
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="rooms"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Regular Booking</span>
                  </Label>
                </div>
                {/* <div className="flex items-center gap-2 bg-white p-3 rounded-lg border hover:border-blue-500 transition-all cursor-pointer">
                  <RadioGroupItem
                    value="group"
                    id="group"
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="group"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Users2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Group Booking</span>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      Save up to 25%
                    </span>
                  </Label>
                </div> */}
              </RadioGroup>

              {/* Search Form */}
              <div className="grid lg:grid-cols-[2fr,1fr,1fr,1fr] gap-4 mb-6">
                {/* Location */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        DESTINATION
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <Input
                          className="border-0 p-0 text-lg focus-visible:ring-0 placeholder:text-gray-400"
                          placeholder="Where are you going?"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-500">
                        Popular Destinations
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {popularDestinations.map((dest) => (
                          <Button
                            key={dest}
                            variant="outline"
                            className="justify-start"
                            onClick={() => setLocation(dest)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {dest}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Check-in */}
                <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        CHECK-IN
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <div className="text-lg">
                          {checkIn
                            ? format(checkIn, "MMM d, yyyy")
                            : "Add date"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date);
                        setIsCheckInOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        CHECK-OUT
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <div className="text-lg">
                          {checkOut
                            ? format(checkOut, "MMM d, yyyy")
                            : "Add date"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => {
                        setCheckOut(date);
                        setIsCheckOutOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date <= checkIn || date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {/* Guests */}
                <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        GUESTS
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div className="text-lg">
                        {guests.length} {guests.length === 1 ? "room" : "rooms"}
                        , {guests.reduce((sum, room) => sum + room.adults, 0) + guests.reduce((sum, room) => sum + room.children, 0)} guests
                      </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    {/* <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rooms</div>
                          <div className="text-sm text-gray-500">
                            Number of rooms needed
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                rooms: Math.max(1, prev.rooms - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-4 text-center">
                            {guests.rooms}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                rooms: Math.min(4, prev.rooms + 1),
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-gray-500">
                            Ages 13 or above
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                adults: Math.max(1, prev.adults - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-4 text-center">
                            {guests.adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                adults: prev.adults + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-gray-500">Ages 0-12</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => {
                                const newChildren = Math.max(0, prev.children - 1)
                                const newChildAge = prev.ChildAge.slice(0, newChildren)
                                return {
                                  ...prev,
                                  children: newChildren,
                                  ChildAge: newChildAge
                                }
                              })
                            }
                          >
                            -
                          </Button>
                          <span className="w-4 text-center">
                            {guests.children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setGuests((prev) => {
                                const newChildren = prev.children + 1;
                                return {
                                  ...prev,
                                  children: newChildren,
                                  ChildAge: [...prev.ChildAge, ""],
                                };
                              })
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      {guests.children > 0 && (
                        <div className="space-y-2 mt-4">
                        <Label className="text-xs font-medium text-gray-500">
                          Age of each child
                        </Label>
                        {guests.ChildAge.map((age, index) => (
                          <Input
                            key={index}
                            type="number"
                            placeholder={`Child ${index + 1} Age`}
                            className="w-full"
                            value={age}
                            onChange={(e) => {
                              const newAges = [...guests.ChildAge];
                              newAges[index] = e.target.value;
                              setGuests((prev) => ({
                                ...prev,
                                ChildAge: newAges,
                              }));
                            }}
                            min="0"
                            max="12"
                          />
                        ))}
                      </div>
                      )}
                    </div> */}
                    <GuestsForm guests={guests} setGuests={setGuests} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSearch}
                  className="bg-red-600 hover:bg-red-800 text-white px-16 py-6 text-xl font-semibold rounded-xl w-full lg:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Hotels
                </Button>
              </div>
            </div>
          </Card>

          {/* <div className="relative z-20">
            <ExploreMore />
          </div> */}
        </div>
      </div>
      {/* <div className="mx-4 sm:mx-6 lg:mx-20">
        <Offers />
        <FeaturedTours />
        <TopRatedHotels />
        <FlightOfferDeals />
      </div> */}
      <Footer />
    </main>
  );
}
