// types/flight.ts

export interface FlightSegment {
  Baggage: string;
  CabinBaggage: string;
  CabinClass: number;
  Airline: {
    AirlineCode: string;
    AirlineName: string;
    FlightNumber: string;
    FareClass: string;
    OperatingCarrier: string;
  };
  Origin: {
    Airport: {
      AirportCode: string;
      AirportName: string;
      Terminal: string;
      CityCode: string;
      CityName: string;
      CountryCode: string;
    };
  };
  Destination: {
    Airport: {
      AirportCode: string;
      AirportName: string;
      Terminal: string;
      CityCode: string;
      CityName: string;
      CountryCode: string;
    };
  };
  DepartureTime: string;
  ArrivalTime: string;
  Duration: string;
}

export interface FlightFare {
  Currency: string;
  BaseFare: number;
  Tax: number;
  YQTax: number;
  AdditionalTxnFeeOfrd: number;
  AdditionalTxnFeePub: number;
  PublishedFare: number;
  OfferedFare: number;
}

// types/flight.ts
export interface Flight {
  TakeOff: string;
  Landing: string;
  FromAirport: {
    CityCode: string;
    CityName: string;
    AirportName: string;
  };
  ToAirport: {
    CityCode: string;
    CityName: string;
    AirportName: string;
  };
  FlightNumber: string;
  AirlineName: string;
  Duration: string;
  Fare: {
    BaseFare: number;
    Tax: number;
  };
  MiniFareRules?: {
    Type: string;
    From: string;
    To: string;
    Unit: string;
    Details: string;
  }[][];
  traceId?: string;
  resultIndex?: number;
}

export interface FlightFilters {
  priceRange: [number, number];
  stops: string[];
  airlines: string[];
  departureTime: string[];
  arrivalTime: string[];
  sortBy: string;
}
