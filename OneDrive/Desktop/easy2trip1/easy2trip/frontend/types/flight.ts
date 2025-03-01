
export interface AirportInfo {
  AirportCode: string;
  AirportName: string;
  Terminal: string;
  CityCode: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
}

export interface FlightSegment {
  Baggage: string;
  CabinBaggage: string;
  CabinClass: number;
  Duration: number;
  AccumulatedDuration?: number;
  GroundTime: number;
  Airline: {
    AirlineCode: string;
    AirlineName: string;
    FlightNumber: string;
    FareClass: string;
    OperatingCarrier: string;
  };
  Origin: {
    Airport: AirportInfo;
    DepTime: string;
  };
  Destination: {
    Airport: AirportInfo;
    ArrTime: string;
  };
  FlightStatus: string;
}

export interface FareRule {
  JourneyPoints: string;
  Type: string;
  From: string;
  To: string;
  Unit: string;
  Details: string;
}

export interface Flight {
  ResultIndex: string;
  Source: number;
  IsLCC: boolean;
  IsRefundable: boolean;
  AirlineRemark: string;
  Segments: FlightSegment[][];
  Fare: {
    Currency: string;
    BaseFare: number;
    Tax: number;
    PublishedFare: number;
    OfferedFare: number;
    TotalBaggageCharges: number;
    TotalMealCharges: number;
    TotalSeatCharges: number;
    TotalSpecialServiceCharges: number;
  };
  MiniFareRules: FareRule[][];
  FareClassification: {
    Color: string;
    Type: string;
  };
}

export interface FlightFilters {
  priceRange: [number, number];
  stops: string[];
  airlines: string[];
  departureTime: string[];
  arrivalTime: string[];
  sortBy: string;
}

export interface FlightSearchResponse {
  Response: {
    ResponseStatus: number;
    Error: {
      ErrorCode: number;
      ErrorMessage: string;
    };
    TraceId: string;
    Origin: string;
    Destination: string;
    Results: Flight[][];
  };
}