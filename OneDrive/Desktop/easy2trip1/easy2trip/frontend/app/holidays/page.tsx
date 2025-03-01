"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenu } from "../components/navigation-menu";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  Building,
  Users2,
} from "lucide-react";

export default function HolidaysPage() {
  const router = useRouter();
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleSearch = () => {
    if (!selectedFrom || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    const searchParams = new URLSearchParams({
      from: selectedFrom,
      to: "Goa",
      date: format(departureDate, "yyyy-MM-dd"),
      rooms: guests.rooms.toString(),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
    });

    router.push(`/holidays/search?${searchParams.toString()}`);
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
                  Find your perfect Holiday Plan
                </h2>
                <p className="text-gray-700">
                  Search deals on hotels, homes, and much more...
                </p>
              </div>
              {/* Search Form */}
              <div className="grid lg:grid-cols-[2fr,1fr,1fr,1fr] gap-4 mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        From
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <Input
                          className="border-0 p-0 text-lg focus-visible:ring-0 placeholder:text-gray-400"
                          placeholder="Where are you going?"
                          value={selectedFrom}
                          onChange={(e) => setSelectedFrom(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-500">
                        Popular Holiday Destinations
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {popularDestinations.map((dest) => (
                          <Button
                            key={dest}
                            variant="outline"
                            className="justify-start"
                            onClick={() => setSelectedFrom(dest)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {dest}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Location */}
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        To
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <Input
                          className="border-0 p-0 text-lg focus-visible:ring-0 placeholder:text-gray-400"
                          placeholder="Where are you going?"
                          value={selectedTo}
                          onChange={(e) => setSelectedTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-500">
                        Popular Holiday Destinations
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {popularDestinations.map((dest) => (
                          <Button
                            key={dest}
                            variant="outline"
                            className="justify-start"
                            onClick={() => setSelectedTo(dest)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {dest}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover> */}

                {/* Check-in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="border rounded-xl p-3 cursor-pointer hover:border-blue-500 bg-white transition-all duration-300 shadow-sm">
                      <Label className="text-xs font-medium text-gray-500">
                        Departure
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <div className="text-lg">
                          {departureDate
                            ? format(departureDate, "MMM d, yyyy")
                            : "Add date"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => {
                        setDepartureDate(date);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
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
                          {guests.rooms} {guests.rooms === 1 ? "room" : "rooms"}
                          , {guests.adults + guests.children} guests
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
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
                              setGuests((prev) => ({
                                ...prev,
                                children: Math.max(0, prev.children - 1),
                              }))
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
                              setGuests((prev) => ({
                                ...prev,
                                children: prev.children + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
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
                  Search Holiday
                </Button>
              </div>
            </div>

            {/* <div className="relative z-20">
            <ExploreMore />
          </div> */}
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
