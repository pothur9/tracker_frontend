// app/flight-booking/components/FlightSummary.tsx
"use client";

import { format } from "date-fns";
import { Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Segment {
  Origin: {
    Airport: {
      CityName: string;
      AirportName: string;
      Terminal?: string;
    };
    DepTime: string;
  };
  Destination: {
    Airport: {
      CityName: string;
      AirportName: string;
      Terminal?: string;
    };
    ArrTime: string;
  };
  Airline: {
    AirlineCode: string;
    AirlineName: string;
    FlightNumber: string;
  };
  Duration: number;
  CabinBaggage?: string;
  Baggage?: string;
}

interface Flight {
  Segments: Array<Array<Segment>>;
  Fare: {
    BaseFare: number;
    Tax: number;
    PublishedFare: number;
    YQ?: number;
  };
}

interface FlightSummaryProps {
  flight: {
    outboundFlight?: {
      Segments: Array<
        Array<{
          Origin: {
            Airport: {
              CityName: string;
              AirportName: string;
              Terminal?: string;
            };
            DepTime: string;
          };
          Destination: {
            Airport: {
              CityName: string;
              AirportName: string;
              Terminal?: string;
            };
            ArrTime: string;
          };
          Airline: {
            AirlineCode: string;
            AirlineName: string;
            FlightNumber: string;
          };
          Duration: number;
          CabinBaggage?: string;
          Baggage?: string;
        }>
      >;
      Fare: {
        BaseFare: number;
        Tax: number;
        PublishedFare: number;
        YQ?: number;
      };
    };
    returnFlight?: any;
    Segments?: any;
    Fare?: any;
  };
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const FlightDetails = ({ flightData }: { flightData: Flight }) => {
  if (!flightData?.Segments?.length) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Flight details not available</div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b last:border-b-0">
      {flightData.Segments.map((segmentGroup, index) => (
        <div key={index} className="mb-4">
          <div className="text-lg font-bold text-blue-600">
            Segment {index + 1}
          </div>
          {segmentGroup.map((segment, segIndex) => (
            <div key={segIndex} className="mb-4 border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <div className="text-xl font-bold">
                    {segment.Origin.Airport.CityName} →{" "}
                    {segment.Destination.Airport.CityName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(segment.Origin.DepTime), "EEEE, MMM d")}
                    <span className="mx-2">•</span>
                    {segmentGroup.length === 1
                      ? "Non Stop"
                      : `${segmentGroup.length - 1} Stop(s)`}{" "}
                    • {formatDuration(segment.Duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={`/airlines/${segment.Airline.AirlineCode.toLowerCase()}.png`}
                    alt={segment.Airline.AirlineName}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.src = "/airlines/default.png";
                    }}
                  />
                  <div>
                    <div className="font-medium">{segment.Airline.AirlineName}</div>
                    <div className="text-sm text-gray-500">
                      {segment.Airline.AirlineCode} {segment.Airline.FlightNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <div className="text-2xl font-semibold">
                    {format(new Date(segment.Origin.DepTime), "HH:mm")}
                  </div>
                  <div>{segment.Origin.Airport.AirportName}</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-500">
                    {formatDuration(segment.Duration)}
                  </div>
                  <div className="w-32 h-px bg-gray-300 my-2 relative">
                    <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {segmentGroup.length === 1
                      ? "Non Stop"
                      : `${segmentGroup.length - 1} Stop(s)`}
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-semibold">
                    {format(new Date(segment.Destination.ArrTime), "HH:mm")}
                  </div>
                  <div>{segment.Destination.Airport.AirportName}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-8">
                <div>
                  <div className="text-sm text-gray-500">Cabin Baggage</div>
                  <div className="font-medium">{segment.CabinBaggage || "7 KG"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-in Baggage</div>
                  <div className="font-medium">{segment.Baggage || "15 KG"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


export function FlightSummary({ flight }: FlightSummaryProps) {
  if (!flight) {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="text-gray-500">No flight data available</div>
        </div>
      </Card>
    );
  }

  const isRoundTrip = !!flight.outboundFlight && !!flight.returnFlight;
  const hasSegments = flight?.outboundFlight?.Segments?.length > 0;

  if (hasSegments && !isRoundTrip) {
    return (
      <Card className="mb-6">
        <FlightDetails flightData={flight.outboundFlight} />
      </Card>
    );
  }

  if (isRoundTrip) {
    return (
      <Card className="mb-6">
        <div className="divide-y">
          <div>
            <div className="px-6 py-3 bg-gray-50 text-lg font-bold">Outbound Flight</div>
            <FlightDetails flightData={flight.outboundFlight} />
          </div>

          <div>
            <div className="px-6 py-3 bg-gray-50 text-lg font-bold">Inbound Flight</div>
            <FlightDetails flightData={flight.returnFlight} />
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
