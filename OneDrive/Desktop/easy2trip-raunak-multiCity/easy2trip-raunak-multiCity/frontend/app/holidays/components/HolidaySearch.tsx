import React from "react";
// import HolidayFilter from './HolidayFilter'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

const HolidaySearch = ({
  selectedFrom,
  setSelectedFrom,
  selectedTo,
  setSelectedTo,
  departureDate,
  setDepartureDate,
  handleSearch,
  loading,
  passengers,
  setPassengers,
}) => {
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
    <>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-x-2">
        <div className="w-full flex flex-2 items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 flex gap-1 items-center border rounded-lg p-2 cursor-pointer hover:border-red-500">
                <MapPin className="w-4 h-4" />
                <Input
                  className="border-0 p-0 text-md focus-visible:ring-0 placeholder:text-gray-400"
                  placeholder="From"
                  value={selectedFrom}
                  onChange={(e) => setSelectedFrom(e.target.value)}
                />
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
          {/* <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 flex gap-1 items-center border rounded-lg p-2 cursor-pointer hover:border-red-500">
                <MapPin className="w-4 h-4" />
                <Input className="border-0 p-0 text-md focus-visible:ring-0 placeholder:text-gray-400" placeholder='To' value={selectedTo} onChange={(e) => setSelectedTo(e.target.value)}/>
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
        </div>
        <div className="w-full flex flex-3 items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                <Label className="text-xs md:text-sm text-gray-500">
                  Departure
                </Label>
                <div className="text-sm md:text-base font-bold">
                  {format(departureDate, "dd MMM")}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={(date) => date && setDepartureDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full flex flex-2">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                <Label className="text-xs md:text-sm text-gray-500">
                  Room&Guests
                </Label>
                <div className="text-sm md:text-base font-bold">
                  {passengers.rooms}Room(s){" "}
                  {passengers.adults + passengers.children}Traveler(s)
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[500px] p-3 max-h-[80vh] overflow-y-auto"
              align="start"
              side="bottom"
              alignOffset={-150}
            >
              <div className="space-y-3 text-xs md:text-sm">
                {/* Adults */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-sm md:text-base mb-1">
                        ADULTS (12y +)
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        on holidays
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, ">9"].map((num) => (
                      <Button
                        key={num}
                        variant="outline"
                        className={cn(
                          "h-6 w-6 text-[10px] md:h-8 md:w-8 md:text-xs",
                          passengers.adults ===
                            (num === ">9" ? 10 : Number(num))
                            ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                            : ""
                        )}
                        onClick={() =>
                          setPassengers((prev) => ({
                            ...prev,
                            adults: num === ">9" ? 10 : Number(num),
                          }))
                        }
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Children and Infants */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-sm md:text-base mb-1">
                          CHILDREN (2y - 12y)
                        </h3>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          on holidays
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[0, 1, 2, 3, 4, 5, 6, ">6"].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          className={cn(
                            "h-6 w-6 text-[10px] md:h-8 md:w-8 md:text-xs",
                            passengers.children ===
                              (num === ">6" ? 7 : Number(num))
                              ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                              : ""
                          )}
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              children: num === ">6" ? 7 : Number(num),
                            }))
                          }
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-sm md:text-base mb-1">
                          INFANTS (below 2y)
                        </h3>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          on holidays
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[0, 1, 2, 3, 4, 5, 6, ">6"].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          className={cn(
                            "h-6 w-6 text-[10px] md:h-8 md:w-8 md:text-xs",
                            passengers.infants ===
                              (num === ">6" ? 7 : Number(num))
                              ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                              : ""
                          )}
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              infants: num === ">6" ? 7 : Number(num),
                            }))
                          }
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm py-1"
                  onClick={() => {
                    // Close the popover
                    const popoverTrigger = document.querySelector(
                      '[data-state="open"]'
                    ) as HTMLElement;
                    if (popoverTrigger) {
                      popoverTrigger.click();
                    }
                  }}
                >
                  APPLY
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full flex flex-1">
          <Button
            disabled={loading}
            className="min-w-[10rem] bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm md:text-base font-semibold rounded-full"
            onClick={handleSearch}
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default HolidaySearch;
