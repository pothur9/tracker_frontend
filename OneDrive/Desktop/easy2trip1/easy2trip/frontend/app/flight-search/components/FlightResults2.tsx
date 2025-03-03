"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, AlertCircle } from "lucide-react";
import type {
  Flight,
  FlightFilters,
  FlightSearchResponse,
} from "@/types/flight";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface FlightResultsProps {
  selectedFrom: string;
  selectedTo: string;
  dates: Array<{ date: string; price: string; active: boolean }>;
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
  onErrorChange?: (error: string | null) => void;
  flights: Flight[];
  setFlights: any;
  searchLoading: any;
  setOnceTime: any;
  passengers: any;
  onBookFlight: any;
  returnType: string;
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

export default function FlightResults2({
  selectedFrom,
  selectedTo,
  dates,
  filters,
  setFilters,
  onErrorChange,
  setFlights,
  flights,
  searchLoading,
  setOnceTime,
  passengers,
  onBookFlight,
  returnType,
}: FlightResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleBookNow = (flight: Flight) => {
    try {
      localStorage.setItem(
        "selectedFlight",
        JSON.stringify({ outboundFlight: flight, returnType: returnType })
      );
      localStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          from: selectedFrom,
          to: selectedTo,
          travellerCount: 1,
          class: flight.Segments[0][0].CabinClass,
          passengers: passengers,
        })
      );

      router.push("/flight-booking");
    } catch (error) {
      console.error("Error handling booking:", error);
      if (onErrorChange) {
        onErrorChange("Failed to proceed with booking. Please try again.");
      }
    }
  };

  useEffect(() => {
    try {
      const results = localStorage.getItem("flightSearchResults");
      if (results) {
        setOnceTime(true);
        const parsedResults = JSON.parse(results) as FlightSearchResponse;
        if (parsedResults?.Response?.Results?.[0]) {
          const prices = parsedResults.Response.Results[0].map(
            (f) => f.Fare.PublishedFare
          );
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setFilters({
            ...filters,
            priceRange: [minPrice, maxPrice],
          });

          const sortedFlights = parsedResults.Response.Results[0].sort(
            (a, b) => a.Fare.PublishedFare - b.Fare.PublishedFare
          );
          setFlights(sortedFlights);
        }
      }
    } catch (err) {
      setOnceTime(true);
      setError("Failed to load flight results");
      console.error(err);
    } finally {
      setOnceTime(true);
      setLoading(false);
    }
  }, []);

  const filteredFlights = flights.filter((flight) => {
    const price = flight.Fare.PublishedFare;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    if (filters.stops.length > 0) {
      const stopCount = flight.Segments[0].length - 1;
      const stopType = stopCount === 0 ? "non-stop" : "one-stop";
      if (!filters.stops.includes(stopType)) {
        return false;
      }
    }

    if (filters.airlines.length > 0) {
      const airline = flight.Segments[0][0].Airline.AirlineName;
      if (!filters.airlines.includes(airline)) {
        return false;
      }
    }

    if (filters.departureTime.length > 0) {
      const timeOfDay = getTimeOfDay(flight.Segments[0][0].Origin.DepTime);
      if (!filters.departureTime.includes(timeOfDay)) {
        return false;
      }
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
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

  return (
    <div className="flex-1">
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {sortedFlights.length} flights found
          </div>
          <div className="flex gap-4">
            {[
              { label: "Cheapest", value: "cheapest" },
              { label: "Shortest", value: "duration" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={
                  filters.sortBy === option.value ? "default" : "outline"
                }
                onClick={() => setFilters({ ...filters, sortBy: option.value })}
                className={
                  filters.sortBy === option.value
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <Card key={flight.ResultIndex} className="p-6 flex flex-col gap-4">
            {flight.Segments.map((segment, segmentIndex) => (
              <div key={segmentIndex} className="mb-6">
                {segmentIndex !== 0 ? <hr className="mb-5" /> : ""}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div className="w-3/4 flex items-center justify-between gap-2">
                    <div className="flex flex-col md:flex-row items-start gap-0 md:gap-6">
                      <div className="w-12 md:w-16">
                        {segment[0].Airline.AirlineCode ? (
                          <img
                            src={`/airlines/${segment[0].Airline.AirlineCode.toLowerCase()}.png`}
                            alt={segment[0].Airline.AirlineName}
                            className="w-full"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L2 22'/%3E%3Cpath d='M5.45 5.11L2 22l10-10'/%3E%3Cpath d='M2 2l20 20'/%3E%3Cpath d='M18.55 5.11L22 22l-10-10'/%3E%3C/svg%3E";
                              e.currentTarget.className =
                                "w-full p-2 text-gray-400";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-8 h-8 text-gray-400"
                            >
                              <path d="M22 2L2 22" />
                              <path d="M5.45 5.11L2 22l10-10" />
                              <path d="M2 2l20 20" />
                              <path d="M18.55 5.11L22 22l-10-10" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {segment[0].Airline.AirlineName}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          {segment[0].Airline.AirlineCode}{" "}
                          {segment[0].Airline.FlightNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex self-start md:self-center items-center gap-2 md:gap-16">
                      <div className="text-center">
                        <div className="font-semibold">
                          {format(new Date(segment[0].Origin.DepTime), "HH:mm")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {segment[0].Origin.Airport.CityName}
                          <div className="text-xs">
                            Terminal {segment[0].Origin.Airport.Terminal || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-500">
                          {formatDuration(
                            segment.reduce(
                              (acc, seg) =>
                                acc + seg.Duration + (seg.GroundTime || 0),
                              0
                            )
                          )}
                        </div>
                        <div className="relative w-32 h-px bg-gray-300 my-2">
                          <div className="absolute -top-2 left-0 right-0 flex justify-center">
                            <Plane className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {segment.length === 1
                            ? "Non stop"
                            : `${segment.length - 1} ${
                                segment.length - 1 === 1 ? "stop" : "stops"
                              }`}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold">
                          {format(
                            new Date(
                              segment[segment.length - 1].Destination.ArrTime
                            ),
                            "HH:mm"
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {
                            segment[segment.length - 1].Destination.Airport
                              .CityName
                          }
                          <div className="text-xs">
                            Terminal{" "}
                            {segment[segment.length - 1].Destination.Airport
                              .Terminal || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 ">
                  <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Total Duration:{" "}
                      {formatDuration(
                        segment.reduce(
                          (acc, seg) =>
                            acc + seg.Duration + (seg.GroundTime || 0),
                          0
                        )
                      )}
                    </div>
                    <div>Cabin Bag: {segment[0].CabinBaggage}</div>
                    <div>Check-in: {segment[0].Baggage}</div>
                    <div
                      className={
                        flight.IsRefundable ? "text-green-600" : "text-red-600"
                      }
                    >
                      {flight.IsRefundable ? "Refundable" : "Non-Refundable"}
                    </div>
                    {flight.AirlineRemark && (
                      <div className="text-blue-600">
                        {flight.AirlineRemark}
                      </div>
                    )}
                  </div>

                  {segment.length > 1 && (
                    <div className="mt-2 text-xs md:text-sm text-gray-500">
                      <div className="font-medium mb-1">Layovers:</div>
                      {segment.slice(0, -1).map((seg, index) => (
                        <div key={index} className="ml-4">
                          {seg.Destination.Airport.CityName} -{" "}
                          {formatDuration(segment[index + 1].GroundTime)}{" "}
                          layover
                        </div>
                      ))}
                    </div>
                  )}

                  {flight.MiniFareRules && flight.MiniFareRules[0] && (
                    <div className="mt-2 text-xs md:text-sm">
                      <div className="font-medium mb-1 text-gray-700">
                        Fare Rules:
                      </div>
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        {flight.MiniFareRules[0]
                          .filter(
                            (rule) =>
                              rule.Type === "Cancellation" ||
                              rule.Type === "Reissue"
                          )
                          .map((rule, index) => (
                            <div key={index} className="text-gray-600">
                              <span className="font-medium">{rule.Type}:</span>{" "}
                              {rule.From !== "44" ? (
                                <>
                                  {rule.Details}
                                  {rule.From && rule.To
                                    ? ` (${rule.From}-${
                                        rule.To
                                      } ${rule.Unit.toLowerCase()})`
                                    : ""}
                                </>
                              ) : (
                                "Non-changeable"
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-800 flex flex-col gap-1">
                ₹{flight.Fare.PublishedFare.toLocaleString("en-IN")}
                <span className="text-sm text-slate-500">Per Traveller</span>
              </div>
              <Button
                onClick={() => handleBookNow(flight)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                BOOK NOW
              </Button>
            </div>
          </Card>
        ))}
        

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
