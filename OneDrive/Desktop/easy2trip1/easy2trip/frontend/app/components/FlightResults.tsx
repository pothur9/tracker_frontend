"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock } from "lucide-react";
import type { Flight, FlightFilters } from "@/types/flight";
import { format } from "date-fns";

interface FlightResultsProps {
  selectedFrom: string;
  selectedTo: string;
  dates: Array<{ date: string; price: string; active: boolean }>;
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
}

export default function FlightResults({
  selectedFrom,
  selectedTo,
  dates,
  filters,
  setFilters,
}: FlightResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get flights from localStorage
    const results = localStorage.getItem("flightSearchResults");
    if (results) {
      const parsedResults = JSON.parse(results);
      if (parsedResults?.Response?.Results?.[0]) {
        setFlights(parsedResults.Response.Results[0]);
      }
    }
    setLoading(false);
  }, []);

  // Apply filters to flights
  const filteredFlights = flights.filter((flight) => {
    // Price filter
    const price = flight.Fare.PublishedFare;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Stops filter
    const stops = flight.Segments[0].length - 1;
    const stopFilter = filters.stops.length === 0 ? true :
      filters.stops.includes(stops === 0 ? "non-stop" : "one-stop");
    if (!stopFilter) return false;

    // Airline filter
    if (filters.airlines.length > 0) {
      const airline = flight.Segments[0][0].Airline.AirlineName;
      if (!filters.airlines.includes(airline)) return false;
    }

    // Departure time filter
    if (filters.departureTime.length > 0) {
      const departureHour = new Date(flight.Segments[0][0].DepartureTime).getHours();
      const timeOfDay =
        departureHour >= 6 && departureHour < 12 ? "morning" :
        departureHour >= 12 && departureHour < 18 ? "afternoon" :
        departureHour >= 18 && departureHour < 24 ? "evening" : "night";
      if (!filters.departureTime.includes(timeOfDay)) return false;
    }

    return true;
  });

  // Sort flights based on selected sorting option
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (filters.sortBy) {
      case "cheapest":
        return a.Fare.PublishedFare - b.Fare.PublishedFare;
      case "duration":
        const getDuration = (segments: any[]) => {
          const totalMinutes = segments.reduce((acc, segment) => {
            const duration = segment.Duration.split(":");
            return acc + parseInt(duration[0]) * 60 + parseInt(duration[1]);
          }, 0);
          return totalMinutes;
        };
        return getDuration(a.Segments[0]) - getDuration(b.Segments[0]);
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

  return (
    <div className="flex-1">
      {/* Date Navigation */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 cursor-pointer rounded ${
                date.active
                  ? "bg-red-50 border border-red-500 text-red-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="text-sm font-medium">{date.date}</div>
              <div className="text-xs text-gray-500">{date.price}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sort Options */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          {[
            { label: "Cheapest", value: "cheapest" },
            { label: "Shortest", value: "duration" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={filters.sortBy === option.value ? "default" : "outline"}
              onClick={() => setFilters({ ...filters, sortBy: option.value })}
              className={filters.sortBy === option.value ? "bg-red-500" : ""}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Flight Results */}
      <div className="space-y-4">
        {sortedFlights.length > 0 ? (
          sortedFlights.map((flight) => (
            <Card key={flight.ResultIndex} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16">
                    <img
                      src={`/airlines/${flight.Segments[0][0].Airline.AirlineCode.toLowerCase()}.png`}
                      alt={flight.Segments[0][0].Airline.AirlineName}
                      className="w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/airlines/default.png";
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {flight.Segments[0][0].Airline.AirlineName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight.Segments[0][0].Airline.AirlineCode}{" "}
                      {flight.Segments[0][0].Airline.FlightNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-16">
                  <div className="text-center">
                    <div className="font-semibold">
                      {format(new Date(flight.Segments[0][0].DepartureTime), "HH:mm")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight.Segments[0][0].Origin.Airport.CityName}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500">
                      {flight.Segments[0][0].Duration}
                    </div>
                    <div className="relative w-32 h-px bg-gray-300 my-2">
                      <div className="absolute -top-2 left-0 right-0 flex justify-center">
                        <Plane className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.Segments[0].length - 1 === 0
                        ? "Non stop"
                        : `${flight.Segments[0].length - 1} stop`}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-semibold">
                      {format(
                        new Date(flight.Segments[0][flight.Segments[0].length - 1].ArrivalTime),
                        "HH:mm"
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight.Segments[0][flight.Segments[0].length - 1].Destination.Airport.CityName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-xl">
                    ₹{flight.Fare.PublishedFare.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    per traveller
                  </div>
                  {/* <Button className="mt-2 bg-red-500 hover:bg-red-600">
                    Book Now
                  </Button> */}
                </div>
              </div>

              {/* Flight Details */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Duration: {flight.Segments[0][0].Duration}
                  </div>
                  <div>
                    Cabin Bag: {flight.Segments[0][0].CabinBaggage}
                  </div>
                  <div>
                    Check-in: {flight.Segments[0][0].Baggage}
                  </div>
                  <div className={flight.IsRefundable ? "text-green-600" : "text-red-600"}>
                    {flight.IsRefundable ? "Refundable" : "Non-Refundable"}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
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