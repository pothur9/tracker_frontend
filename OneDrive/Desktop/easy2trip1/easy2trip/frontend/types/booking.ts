// types/booking.ts

export interface Traveller {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
  }
  
  export interface ContactDetails {
    countryCode: string;
    mobileNumber: string;
    email: string;
  }
  
  export interface GSTDetails {
    gstNumber: string;
    companyName: string;
    companyAddress: string;
    state: string;
  }
  
  export interface Seat {
    number: string;
    price: number | null;
    status: "available" | "occupied" | "selected" | "free";
    type?: "exit" | "xl" | "non-reclining";
  }
  
  export interface FastForwardService {
    isSelected: boolean;
    price: number;
    promoCode?: string;
    promoDiscount?: number;
  }
  
  export interface SpecialFareCategory {
    type: "armed-forces" | "senior-citizen" | "student";
    discount: string;
    isSelected: boolean;
  }
  
  export interface BookingState {
    travellers: Traveller[];
    contactDetails: ContactDetails;
    gstDetails?: GSTDetails;
    selectedSeats: string[];
    fastForwardService: FastForwardService;
    specialFare?: SpecialFareCategory;
  }
  
  export interface FlightSegment {
    Origin: {
      Airport: {
        CityName: string;
        Terminal: string;
      };
      DepTime: string;
    };
    Destination: {
      Airport: {
        CityName: string;
        Terminal: string;
      };
      ArrTime: string;
    };
    Airline: {
      AirlineCode: string;
      AirlineName: string;
      FlightNumber: string;
    };
    Duration: number;
    CabinBaggage: string;
    Baggage: string;
  }
  
  export interface Flight {
    ResultIndex: string;
    Segments: FlightSegment[][];
    Fare: {
      PublishedFare: number;
    };
    IsRefundable: boolean;
    AirlineRemark?: string;
  }