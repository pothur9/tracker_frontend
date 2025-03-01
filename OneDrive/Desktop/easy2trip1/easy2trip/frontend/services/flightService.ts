// services/flightService.ts
const BASE_URL = "/api";

export interface Airport {
  _id: string;
  CITYNAME: string;
  CITYCODE: string;
  COUNTRYCODE: string;
  COUNTRYNAME: string;
  AIRPORTCODE: string;
  AIRPORTNAME: string;
}

export interface FlightSearchParams {
  adultCount: number;
  childCount: number;
  infantCount: number;
  directFlight: boolean;
  oneStopFlight: boolean;
  flightCabinClass: string;
  journeyType: number;
  preferredAirlines: null | string[];
  segments: {
    Origin: string;
    Destination: string;
    FlightCabinClass: string;
    PreferredDepartureTime: string;
    PreferredArrivalTime: string;
  }[];
  sources: null | string[];
}

export interface FlightRuleParams {
  traceId: string;
  resultIndex: string;
}

interface FlightResultsProps {
  selectedFrom: string;
  selectedTo: string;
  dates: Array<{ date: string; price: string; active: boolean }>;
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
  onErrorChange?: (error: string | null) => void;
}

export interface PassengerFare {
  Currency: string;
  BaseFare: number;
  Tax: number;
  YQTax: number;
  AdditionalTxnFeePub: number;
  AdditionalTxnFeeOfrd: number;
  OtherCharges: number;
  Discount: number;
  PublishedFare: number;
  OfferedFare: number;
  TdsOnCommission: number;
  TdsOnPLB: number;
  TdsOnIncentive: number;
  ServiceFee: number;
}

export interface Passenger {
  Title: string;
  FirstName: string;
  LastName: string;
  PaxType: number;
  DateOfBirth: string;
  Gender: number;
  PassportNo: string;
  PassportExpiry: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  CountryCode: string;
  CellCountryCode: string;
  ContactNo: string;
  Nationality: string;
  Email: string;
  IsLeadPax: boolean;
  FFAirlineCode: string | null;
  FFNumber: string;
  Fare: PassengerFare;
  GSTCompanyAddress: string;
  GSTCompanyContactNumber: string;
  GSTCompanyName: string;
  GSTNumber: string;
  GSTCompanyEmail: string;
}

export interface BookingRequest {
  traceId: string;
  resultIndex: string;
  passengers: Passenger[];
}

export interface BookingPassenger {
  Title: string;
  FirstName: string;
  LastName: string;
  PaxType: number;
  DateOfBirth: string;
  Gender: number;
  PassportNo: string;
  PassportExpiry: string;
  AddressLine1: string;
  AddressLine2: string;
  Fare: {
    Currency: string;
    BaseFare: number;
    Tax: number;
    YQTax: number;
    AdditionalTxnFeePub: number;
    AdditionalTxnFeeOfrd: number;
    OtherCharges: number;
    Discount: number;
    PublishedFare: number;
    OfferedFare: number;
    TdsOnCommission: number;
    TdsOnPLB: number;
    TdsOnIncentive: number;
    ServiceFee: number;
  };
  City: string;
  CountryCode: string;
  CellCountryCode: string;
  ContactNo: string;
  Nationality: string;
  Email: string;
  IsLeadPax: boolean;
  FFAirlineCode: string | null;
  FFNumber: string;
  GSTCompanyAddress: string;
  GSTCompanyContactNumber: string;
  GSTCompanyName: string;
  GSTNumber: string;
  GSTCompanyEmail: string;
}

export interface BookingRequest {
  traceId: string;
  resultIndex: string;
  passengers: BookingPassenger[];
}

export const flightService = {
  // Existing methods remain the same
  getAllAirports: async (): Promise<Airport[]> => {
    try {
      const response = await fetch(`${BASE_URL}/airports/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching all airports:", error);
      throw error;
    }
  },

  searchAirports: async (keyword: string): Promise<Airport[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/airports/search?keyword=${encodeURIComponent(keyword)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Airport search error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in searchAirports:", error);
      throw error;
    }
  },

  searchFlights: async (params: FlightSearchParams) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/search`, {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Flight search error:", errorText);
        throw new Error(`Flight search failed: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  },

  // New methods based on the Postman collection
  getFareRules: async (traceId: string, resultIndex: string) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/fareRule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ traceId, resultIndex }),
      });

      if (!response.ok) {
        throw new Error(`Fare rules fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching fare rules:", error);
      throw error;
    }
  },

  getFareQuote: async (traceId: string, resultIndex: string) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/fareQuote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ traceId, resultIndex }),
      });

      if (!response.ok) {
        throw new Error(`Fare quote fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching fare quote:", error);
      throw error;
    }
  },

  bookFlight: async (bookingRequest: any) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flight booking failed: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error booking flight:", error);
      throw error;
    }
  },

  getSSR: async (traceId: string, resultIndex: string) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/getSSR`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ traceId, resultIndex }),
      });

      if (!response.ok) {
        throw new Error(`SSR fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching SSR:", error);
      throw error;
    }
  },

  getFlightTicket: async (ticketRequest: any) => {
    console.log("ticketRequest", ticketRequest);

    try {
      const response = await fetch(`${BASE_URL}/flight/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flight ticket fetch failed: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching flight ticket:", error);
      throw error;
    }
  },

  getFlightBookingDetails: async (traceId: any) => {
    try {
      const response = await fetch(`${BASE_URL}/flight/getFlightBookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ traceId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flight Booking Detais fetch failed: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching flight Booking Detais :", error);
      throw error;
    }
  },

  preHandleCheckout: async (email: string) => {
    try {
      const response = await fetch(`${BASE_URL}/workspace/checkWorksapce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error pre-handling checkout:", error);
      throw error;
    }
  },

  postHandleCheckout: async (ticket: any | null, email: string | null) => {
    try {
      const response = await fetch(
        `${BASE_URL}/workspace/requestWorkspaceBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: ticket,
            email: email,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error pre-handling checkout:", error);
      throw error;
    }
  },
};

export default flightService;
