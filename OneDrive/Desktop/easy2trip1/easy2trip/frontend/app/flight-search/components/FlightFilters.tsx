// app/flight-search/components/FlightFilters.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Flight, FlightFilters } from "@/types/flight";

interface FlightFiltersProps {
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
  flights?: Flight[];
  loading:any
}

export default function FlightFilters({ 
  filters, 
  setFilters, 
  flights = [] ,
  loading// Provide default empty array
}: FlightFiltersProps) {
  // Calculate price range from actual flight data
  const prices = flights.length > 0 
    ? flights.map(f => f.Fare.PublishedFare)
    : [0, 20000]; // Default price range if no flights
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Get unique airlines from actual flight data
  const airlines = Array.from(new Set(
    flights.length > 0
      ? flights.map(f => f.Segments[0][0].Airline.AirlineName)
      : []
  )).sort();

  // Calculate min price for each stop type
  const getMinPriceByStops = (stopCount: number) => {
    if (flights.length === 0) return 0;
    const relevantFlights = flights.filter(f => f.Segments[0].length - 1 === stopCount);
    if (relevantFlights.length === 0) return null;
    return Math.min(...relevantFlights.map(f => f.Fare.PublishedFare));
  };

  // Calculate min price for each airline
  const getMinPriceByAirline = (airlineName: string) => {
    if (flights.length === 0) return 0;
    const relevantFlights = flights.filter(
      f => f.Segments[0][0].Airline.AirlineName === airlineName
    );
    if (relevantFlights.length === 0) return null;
    return Math.min(...relevantFlights.map(f => f.Fare.PublishedFare));
  };

  // Function to get flight count by departure time
  const getFlightCountByTime = (startHour: number, endHour: number) => {
    if (flights.length === 0) return 0;
    return flights.filter(f => {
      const hour = new Date(f.Segments[0][0].Origin.DepTime).getHours();
      return hour >= startHour && hour < endHour;
    }).length;
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      stops: [],
      airlines: [],
      departureTime: [],
      arrivalTime: [],
      sortBy: "cheapest"
    });
  };
// console.log(filters,"=========+> filters")
  return (
    <Card className="w-full md:w-80 flex-shrink-0 p-6">
      <div className="space-y-4 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-md md:text-lg font-bold">Filters</h2>
          <Button 
            variant="link" 
            className="text-red-600 p-0 h-auto text-xs md:text-sm"
            onClick={handleClearAll}
          >
            CLEAR ALL
          </Button>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="font-bold mb-2 md:mb-4 block">Price Range</Label>
          <Slider
            value={filters.priceRange}
            min={minPrice}
            max={maxPrice}
            step={100}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
            className="my-4"
          />
          <div className="flex justify-between text-xs md:text-sm">
            <span>₹ {filters.priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹ {filters.priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stops Filter */}
        <div>
          <Label className="font-bold mb-2 md:mb-4 block">Stops</Label>
          {[
            { value: "non-stop", label: "Non Stop", count: 0 },
            { value: "one-stop", label: "1 Stop", count: 1 }
          ].map((stop) => (
            <div key={stop.value} className="flex items-center justify-between mb-3">
              <Label className="flex items-center">
                <Checkbox
                  checked={filters.stops.includes(stop.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({ ...prev, stops: [...prev.stops, stop.value] }))
                    } else {
                      setFilters((prev) => ({ ...prev, stops: prev.stops.filter((s) => s !== stop.value) }))
                    }
                  }}
                  className="mr-2"
                />
                <span className="flex items-center gap-2">
                  {stop.label}
                  {flights.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({flights.filter(f => f.Segments[0].length - 1 === stop.count).length})
                    </span>
                  )}
                </span>
              </Label>
              {flights.length > 0 && (
                <span className="text-xs md:text-sm text-gray-600">
                  from ₹ {(getMinPriceByStops(stop.count) || 0).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Departure Time Filter */}
        <div>
          <Label className="font-bold mb-3 md:mb-4 block">Departure Time</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🌅", label: "Before 6 AM", start: 0, end: 6 },
              { icon: "☀️", label: "6 AM - 12 PM", start: 6, end: 12 },
              { icon: "🌤️", label: "12 PM - 6 PM", start: 12, end: 18 },
              { icon: "🌙", label: "After 6 PM", start: 18, end: 24 },
            ].map((time) => (
              <Button
                key={time.label}
                variant="outline"
                className={cn(
                  "flex flex-col items-center justify-center p-2 h-16",
                  filters.departureTime.includes(time.label) && "border-red-600 bg-red-50",
                )}
                onClick={() => {
                  if (filters.departureTime.includes(time.label)) {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: prev.departureTime.filter((t) => t !== time.label),
                    }))
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: [...prev.departureTime, time.label],
                    }))
                  }
                }}
              >
                <span className="text-lg md:text-xl mb-1">{time.icon}</span>
                <span className="text-[10px] text-center">{time.label}</span>
                {flights.length > 0 && (
                  <span className="text-[10px] text-gray-500">
                    ({getFlightCountByTime(time.start, time.end)})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Airlines Filter */}
        {airlines.length > 0 && (
          <div>
            <Label className="font-bold mb-2 md:mb-4 block">Airlines</Label>
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center justify-between mb-3">
                <Label className="flex items-center">
                  <Checkbox
                    checked={filters.airlines.includes(airline)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({ ...prev, airlines: [...prev.airlines, airline] }))
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          airlines: prev.airlines.filter((a) => a !== airline),
                        }))
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="flex items-center gap-2">
                    {airline}
                    <span className="text-xs text-gray-500">
                      ({flights.filter(f => f.Segments[0][0].Airline.AirlineName === airline).length})
                    </span>
                  </span>
                </Label>
                <span className="text-xs md:text-sm text-gray-600">
                  from ₹ {(getMinPriceByAirline(airline) || 0).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}