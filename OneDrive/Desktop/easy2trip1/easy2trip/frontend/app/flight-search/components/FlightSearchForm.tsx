import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FlipHorizontalIcon as SwapHorizontal } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AirportSelect from "@/components/AirportSelect";

export default function FlightSearchForm({
  segmentIndex,
  selectedTripType,
  setSelectedTripType,
  selectedFrom,
  setSelectedFrom,
  selectedTo,
  setSelectedTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  handleSearch,
  loading,
  passengers,
  setPassengers,
  travelClass,
  setTravelClass,
}) {
  const handleSwapLocations = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
  };

  return (
    <div className="space-y-4 my-4">
      {/* Flight Search Form */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-x-2">
        <div className="w-full flex flex-2 items-center space-x-2">
          <AirportSelect
            label="From"
            value={selectedFrom}
            isOrigin={true}
            onSelect={setSelectedFrom}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8 md:w-10 md:h-10 text-red-500 hover:bg-red-50 flex-shrink-0"
            onClick={handleSwapLocations}
          >
            <SwapHorizontal className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <AirportSelect
            label="To"
            value={selectedTo}
            isOrigin={false}
            onSelect={setSelectedTo}
          />
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
                disabled={(date) => date < addDays(new Date(), 0)}
              />
            </PopoverContent>
          </Popover>
          {/* Return date */}
          {selectedTripType === "multi-city" ? (
            ""
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500",
                    selectedTripType !== "round-trip" &&
                      "opacity-50 pointer-events-none"
                  )}
                >
                  <Label className="text-xs md:text-sm text-gray-500">
                    Return
                  </Label>
                  <div className="text-sm md:text-base font-bold">
                    {returnDate ? format(returnDate, "dd MMM") : "Select"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => setReturnDate(date)}
                  initialFocus
                  disabled={(date) => date < addDays(new Date(), 0)}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Travelers and class */}
        {(selectedTripType === "multi-city" && segmentIndex === 0) ||
        selectedTripType !== "multi-city" ? (
          <div className="w-full flex flex-2">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                  <Label className="text-xs md:text-sm text-gray-500">
                    Travelers & Class
                  </Label>
                  <div className="text-sm md:text-base font-bold">
                    {passengers.adults +
                      passengers.children +
                      passengers.infants}{" "}
                    Traveler(s), {travelClass}
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
                          on the day of travel
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
                            on the day of travel
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
                            on the day of travel
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

                  {/* Travel Class */}
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">
                      CHOOSE TRAVEL CLASS
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First Class",
                      ].map((className) => (
                        <Button
                          key={className}
                          variant="outline"
                          className={cn(
                            "h-8 text-[10px] md:h-10 md:text-xs",
                            travelClass === className
                              ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                              : ""
                          )}
                          onClick={() => setTravelClass(className)}
                        >
                          {className}
                        </Button>
                      ))}
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
        ) : (
          ""
        )}

        {/* Search button */}
        {selectedTripType === "multi-city" ? (
          segmentIndex === 0 ? (
            <div className="w-full flex flex-1">
              <Button
                disabled={loading}
                className="min-w-[10rem] bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm md:text-base font-semibold rounded-full"
                onClick={handleSearch}
              >
                {loading ? "SEARCHING..." : "SEARCH"}
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-1">
              <div className="min-w-[31rem]"></div>
            </div>
          )
        ) : (
          <div className="w-full flex flex-1">
            <Button
              disabled={loading}
              className="min-w-[10rem] bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm md:text-base font-semibold rounded-full"
              onClick={handleSearch}
            >
              {loading ? "SEARCHING..." : "SEARCH"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
