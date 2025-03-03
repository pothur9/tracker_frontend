"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plane, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Flight, FlightFilters } from "@/types/flight";
import { Button } from "@/components/ui/button";

interface FlightResultsProps {
  selectedFrom: string;
  selectedTo: string;
  dates: Array<{ date: string; price: string; active: boolean }>;
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  searchLoading: boolean;
  setOnceTime: (value: boolean) => void;
  passengers: any;
  onSelectFlight?: (flight: Flight) => void;
  selectedFlight?: Flight | null;
  onBookFlight?: (flight: Flight) => void;
  selectedTripType: string;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getTimeOfDay = (dateString: string): string => {
  const hour = new Date(dateString).getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
};

export default function FlightResults({
  selectedFrom,
  selectedTo,
  dates,
  filters,
  setFilters,
  flights,
  setFlights,
  searchLoading,
  setOnceTime,
  passengers,
  onSelectFlight,
  selectedFlight,
  onBookFlight,
  selectedTripType,
}: FlightResultsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFlightAction = (flight: Flight) => {
    // console.log(onSelectFlight, onBookFlight);
    if (onSelectFlight) {
      onSelectFlight(flight);
    } else if (onBookFlight) {
      // Create a clean flight object with only necessary data
      const cleanFlight = {
        ResultIndex: flight.ResultIndex,
        Segments: flight.Segments,
        Fare: flight.Fare,
        IsRefundable: flight.IsRefundable,
      };
      onBookFlight(cleanFlight);
    }
  };

  useEffect(() => {
    try {
      if (flights.length > 0) {
        setOnceTime(true);
      }
    } catch (err) {
      setOnceTime(true);
      setError("Failed to load flight results");
      console.error(err);
    } finally {
      setOnceTime(true);
      setLoading(false);
    }
  }, [flights, setOnceTime]);

  const filteredFlights = flights.filter((flight) => {
    const price = flight.Fare.PublishedFare;
    if (price < filters.priceRange[0] || price > filters.priceRange[1])
      return false;

    if (filters.stops.length > 0) {
      const stopCount = flight.Segments[0].length - 1;
      const stopType = stopCount === 0 ? "non-stop" : "one-stop";
      if (!filters.stops.includes(stopType)) return false;
    }

    if (filters.airlines.length > 0) {
      const airline = flight.Segments[0][0].Airline.AirlineName;
      if (!filters.airlines.includes(airline)) return false;
    }

    if (filters.departureTime.length > 0) {
      const timeOfDay = getTimeOfDay(flight.Segments[0][0].Origin.DepTime);
      if (!filters.departureTime.includes(timeOfDay)) return false;
    }

    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (filters.sortBy) {
      case "cheapest":
        return a.Fare.PublishedFare - b.Fare.PublishedFare;
      case "duration":
        const aDuration = a.Segments[0].reduce(
          (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
          0
        );
        const bDuration = b.Segments[0].reduce(
          (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
          0
        );
        return aDuration - bDuration;
      default:
        return 0;
    }
  });

  if (loading || searchLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const renderFlightCard = (flight: Flight) => {
    const isSelected = selectedFlight?.ResultIndex === flight.ResultIndex;
    const firstSegment = flight.Segments[0][0];
    const lastSegment = flight.Segments[0][flight.Segments[0].length - 1];
    const totalDuration = flight.Segments[0].reduce(
      (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
      0
    );

    return (
      <Card
        key={flight.ResultIndex}
        className={`mb-4 hover:shadow-md transition-shadow ${
          isSelected ? "ring-2 ring-red-500 bg-red-50" : ""
        }`}
      >
        <div className="p-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2 flex items-start space-x-2">
              <div className="w-10 h-10 flex-shrink-0">
                {firstSegment.Airline.AirlineCode ? (
                  <img
                    src={`/airlines/${firstSegment.Airline.AirlineCode.toLowerCase()}.png`}
                    alt={firstSegment.Airline.AirlineName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/airlines/6e.png";
                      //need to change in future
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                    <Plane className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mt-1">
                <div className="text-xs font-semibold">
                  {firstSegment.Airline.AirlineCode}
                </div>
                <div className="text-xs text-gray-500">
                  {firstSegment.Airline.FlightNumber}
                </div>
              </div>
            </div>

            <div className="ml-2 flex">
              <div className="flex">
                <div className="col-span-2 ml-4 mt-4">
                  <div className="text-sm font-semibold">
                    {format(new Date(firstSegment.Origin.DepTime), "HH:mm")}
                  </div>
                  <div className="text-xs text-gray-600">
                    {firstSegment.Origin.Airport.CityName}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Terminal {firstSegment.Origin.Airport.Terminal || "-"}
                  </div>
                </div>

                <div className="col-span-2 text-center mt-4">
                  <div className="text-xs text-gray-600">
                    {formatDuration(totalDuration)}
                  </div>
                  <div className="relative w-20 h-px bg-gray-300 mx-auto my-1">
                    <Plane className="w-2.5 h-2.5 text-gray-400 absolute -top-1 right-0 transform rotate-90" />
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {flight.Segments[0].length === 1
                      ? "Non stop"
                      : `${flight.Segments[0].length - 1} ${
                          flight.Segments[0].length - 1 === 1 ? "stop" : "stops"
                        }`}
                  </div>
                </div>

                <div className="col-span-2 ml-4 mt-4">
                  <div className="text-sm font-semibold">
                    {format(new Date(lastSegment.Destination.ArrTime), "HH:mm")}
                  </div>
                  <div className="text-xs text-gray-600">
                    {lastSegment.Destination.Airport.CityName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Terminal {lastSegment.Destination.Airport.Terminal || "-"}
                  </div>
                </div>
              </div>
              <div className="ml-14 mt-4 text-right">
                <div className="text-base font-bold">
                  ₹{flight.Fare.PublishedFare.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-gray-500 mb-1">per traveller</div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="selectedFlight"
                    value={flight.ResultIndex}
                    checked={isSelected}
                    onChange={() => handleFlightAction(flight)}
                    className="hidden"
                  />
                  {selectedTripType == "one-way" && (
                    <Button
                      className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        console.log("Book Now clicked for flight:", flight);
                        handleFlightAction(flight);
                      }}
                    >
                      Book Now
                    </Button>
                  )}
                  {selectedTripType == "round-trip" && (
                    <>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="mt-0 pt-3 border-t flex">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-gray-600">
                  Total Duration: {formatDuration(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-gray-600">
                  Cabin Bag: {firstSegment.CabinBaggage || "7 KG"}
                </div>
                <div className="text-gray-600">
                  Check-in: {firstSegment.Baggage || "15 Kilograms"}
                </div>
              </div>

              <div className="text-green-600 -mt-4">
                {flight.IsRefundable ? "Refundable" : "Non-Refundable"}
              </div>

              {flight.Segments[0].length > 1 && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Layovers:</span>
                  {flight.Segments[0].slice(0, -1).map((segment, index) => (
                    <span key={index} className="text-[11px] text-gray-500">
                      {segment.Destination.Airport.CityName} -{" "}
                      {formatDuration(flight.Segments[0][index + 1].GroundTime)}{" "}
                      layover
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex-1">
      <Card className="mb-4 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-xs md:text-sm text-gray-600">
            {sortedFlights.length} flights found
          </div>
          <div className="flex gap-2 md:gap-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="sortBy"
                value="cheapest"
                checked={filters.sortBy === "cheapest"}
                onChange={() => setFilters({ ...filters, sortBy: "cheapest" })}
                className="hidden"
              />
              <div
                className={`px-4 py-1.5 rounded-md transition-all ${
                  filters.sortBy === "cheapest"
                    ? "bg-red-500 text-white"
                    : "bg-transparent text-gray-600 border border-gray-300 group-hover:bg-gray-50"
                }`}
              >
                Cheapest
              </div>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="sortBy"
                value="duration"
                checked={filters.sortBy === "duration"}
                onChange={() => setFilters({ ...filters, sortBy: "duration" })}
                className="hidden"
              />
              <div
                className={`px-4 py-1.5 rounded-md transition-all ${
                  filters.sortBy === "duration"
                    ? "bg-red-500 text-white"
                    : "bg-transparent text-gray-600 border border-gray-300 group-hover:bg-gray-50"
                }`}
              >
                Shortest
              </div>
            </label>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {sortedFlights.map(renderFlightCard)}

        {sortedFlights.length === 0 && (
          <Card className="p-6 text-center">
            <div className="text-xl font-semibold text-gray-600 mb-2">
              No flights found
            </div>
            <div className="text-gray-500">
              Try adjusting your filters or search for different dates
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
