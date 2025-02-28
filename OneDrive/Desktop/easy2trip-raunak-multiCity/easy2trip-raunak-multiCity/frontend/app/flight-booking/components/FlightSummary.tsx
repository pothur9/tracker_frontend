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

const FlightDetails = ({
  flightData,
  index = 0,
}: {
  flightData: Flight | any;
  index?: number;
}) => {
  console.log(
    "  if (!flightData?.outboundFlight.Segments?.[0]?.[0]) ",
    flightData
  );
  if (!flightData.Segments?.[index]?.[0]) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Flight details not available</div>
      </div>
    );
  }

  const segment = flightData.Segments[index][0];
  const lastSegment =
    flightData.Segments[index][flightData.Segments[index].length - 1];

  return (
    <div className="p-6 border-b last:border-b-0">
      <div className="flex justify-between">
        <div>
          <div className="text-xl font-bold">
            {segment.Origin.Airport.CityName} →{" "}
            {lastSegment.Destination.Airport.CityName}
          </div>
          <div className="text-sm text-gray-600">
            <span>
              {format(new Date(segment.Origin.DepTime), "EEEE, MMM d")}
            </span>
            <span className="mx-2">•</span>
            <span>
              {flightData.Segments[index].length === 1
                ? "Non Stop"
                : `${flightData.Segments[index].length - 1} Stop(s)`}{" "}
              •{formatDuration(segment.Duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <img
              src={`/airlines/${segment.Airline.AirlineCode.toLowerCase()}.png`}
              alt={segment.Airline.AirlineName}
              className="w-full"
              onError={(e) => {
                e.currentTarget.src = "/airlines/6e.png";
              }}
            />
          </div>
          <div>
            <div className="font-medium">{segment.Airline.AirlineName}</div>
            <div className="text-sm text-gray-500">
              {segment.Airline.AirlineCode} {segment.Airline.FlightNumber}
              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">
                Airbus A320
              </span>
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
          <div className="text-sm text-gray-500">
            Terminal {segment.Origin.Airport.Terminal || "-"}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">
            {formatDuration(segment.Duration)}
          </div>
          <div className="w-32 h-px bg-gray-300 my-2 relative">
            <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500">
            {flightData.Segments[index].length === 1
              ? "Non Stop"
              : `${flightData.Segments[index].length - 1} Stop(s)`}
          </div>
        </div>

        <div>
          <div className="text-2xl font-semibold">
            {format(new Date(lastSegment.Destination.ArrTime), "HH:mm")}
          </div>
          <div>{lastSegment.Destination.Airport.AirportName}</div>
          <div className="text-sm text-gray-500">
            Terminal {lastSegment.Destination.Airport.Terminal || "-"}
          </div>
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
  // Check if it's a round trip
  const isRoundTrip = flight.outboundFlight && flight.returnFlight;
  const hasDirectSegments =
    flight.outboundFlight?.Segments && flight.outboundFlight.Segments[0];
  console.log("isRoundTrip", isRoundTrip);
  console.log("hasDirectSegments", hasDirectSegments && !isRoundTrip);

  if (hasDirectSegments && !isRoundTrip) {
    console.log("sadasdadaasdasdasdadasdasdadasd");
    return (
      <Card className="mb-6">
        <FlightDetails flightData={flight.outboundFlight} />
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-green-600 font-medium">
            CANCELLATION FEES APPLY
          </div>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View Fare Rules
          </Button>
        </div>
      </Card>
    );
  }

  if (isRoundTrip) {
    return (
      <Card className="mb-6">
        <div className="divide-y">
          <div>
            <div className="px-6 py-3 bg-gray-50 text-lg font-bold">
              Outbound Flight
            </div>
            <FlightDetails flightData={flight.outboundFlight} />
          </div>

          <div>
            <div className="px-6 py-3 bg-gray-50 text-lg font-bold">
              Inbound Flight
            </div>
            <FlightDetails flightData={flight.returnFlight} />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-green-600 font-medium">
            CANCELLATION FEES APPLY
          </div>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View Fare Rules
          </Button>
        </div>
      </Card>
    );
  }

  if (flight.outboundFlight?.Segments.length == 2) {
    return (
      <Card className="mb-6">
        <div className="divide-y">
          <div>
            <div className="px-6 py-3 bg-gray-50 text-sm font-medium">
              <strong>Outbound Flight</strong>
            </div>
            <FlightDetails flightData={flight.outboundFlight} index={0} />
          </div>

          <div>
            <div className="px-6 py-3 bg-gray-50 text-sm font-medium">
              <strong> Return Flight</strong>
            </div>
            <FlightDetails flightData={flight.outboundFlight} index={1} />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-green-600 font-medium">
            CANCELLATION FEES APPLY
          </div>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View Fare Rules
          </Button>
        </div>
      </Card>
    );
  }

  // For one-way flights
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="text-gray-500">Flight details not available1</div>
      </div>
      <div className="px-6 py-4 border-t flex justify-between items-center">
        <div className="text-sm text-green-600 font-medium">
          CANCELLATION FEES APPLY
        </div>
        <Button variant="link" className="text-blue-600 p-0 h-auto">
          View Fare Rules
        </Button>
      </div>
    </Card>
  );
}
