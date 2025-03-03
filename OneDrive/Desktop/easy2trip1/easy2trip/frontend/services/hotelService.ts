// app/services/hotelService.ts

interface PaxRoom {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
}

interface SearchFilters {
  Refundable: boolean;
  NoOfRooms: number;
  MealType: number;
  OrderBy: number;
  StarRating: number;
  HotelName: string | null;
}

interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guestNationality: string;
  paxRooms: PaxRoom[];
  ResponseTime: number;
  IsDetailedResponse: boolean;
  Filters: SearchFilters;
}

export interface HotelDetailsInterface {
  HotelCode: string;
  HotelName: string;
  StarRating: number;
  HotelURL: string | null;
  Description: string;
  Attractions: string | null;
  HotelFacilities: string[];
  HotelPolicy: string;
  SpecialInstructions: string | null;
  HotelPicture: string | null;
  Images: string[];
  Address: string;
  CountryName: string;
  PinCode: string;
  HotelContactNo: string | null;
  FaxNumber: string | null;
  Email: string | null;
  Latitude: string;
  Longitude: string;
  RoomData: any | null;
  RoomFacilities: any | null;
  Services: any | null;
}

interface DayRate {
  Amount: number;
  Date: string; // ISO Date String
}

interface GSTDetails {
  CGSTAmount: number;
  CGSTRate: number;
  CessAmount: number;
  CessRate: number;
  IGSTAmount: number;
  IGSTRate: number;
  SGSTAmount: number;
  SGSTRate: number;
  TaxableAmount: number;
}

interface PriceDetails {
  CurrencyCode: string;
  RoomPrice: number;
  Tax: number;
  ExtraGuestCharge: number;
  ChildCharge: number;
  OtherCharges: number;
  Discount: number;
  PublishedPrice: number;
  PublishedPriceRoundedOff: number;
  OfferedPrice: number;
  OfferedPriceRoundedOff: number;
  AgentCommission: number;
  AgentMarkUp: number;
  ServiceTax: number;
  TCS: number;
  TDS: number;
  ServiceCharge: number;
  TotalGSTAmount: number;
  GST: GSTDetails;
}

interface CancellationPolicy {
  Charge: number;
  ChargeType: number;
  Currency: string;
  FromDate: string; // ISO Date String
  ToDate: string; // ISO Date String
}

export interface HotelRoomDetails {
  AvailabilityType: string;
  ChildCount: number;
  RequireAllPaxDetails: boolean;
  RoomId: number;
  RoomStatus: number;
  RoomIndex: number;
  RoomTypeCode: string;
  RoomDescription: string;
  RoomTypeName: string;
  RatePlanCode: string;
  RatePlan: number;
  InfoSource: string;
  SequenceNo: string;
  DayRates: DayRate[];
  IsPerStay: boolean;
  SupplierPrice: number | null;
  Price: PriceDetails;
  RoomPromotion: string;
  Amenities: string[];
  Amenity: string[];
  SmokingPreference: string;
  BedTypes: string[];
  HotelSupplements: string[];
  LastCancellationDate: string; // ISO Date String
  CancellationPolicies: CancellationPolicy[];
  LastVoucherDate: string; // ISO Date String
  CancellationPolicy: string;
  Inclusion: string[];
  IsPassportMandatory: boolean;
  IsPANMandatory: boolean;
  BeddingGroup: string | null;
}

interface RoomCombination {
  RoomIndex: number[];
}

interface RoomCombinations {
  InfoSource: string;
  IsPolicyPerStay: boolean;
  RoomCombination: RoomCombination[];
}

export interface HotelRoomsData {
  HotelRoomsDetails: HotelRoomDetails[];
  RoomCombinations: RoomCombinations;
}

const API_BASE_URL = "https://easy2trip.com/easy2trip/api";

export const hotelService = {
  searchHotels: async (params: SearchParams) => {
    try {
      console.log("Search params:", params); // Debug log

      const response = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      return data;
    } catch (error) {
      console.error("Error in searchHotels:", error);
      throw error;
    }
  },

  preBook: async (bookingCode: string) => {
    try {
      const response = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/preBook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingCode }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("PreBook API Response:", {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      });

      return data;
    } catch (error) {
      console.error("PreBook API Error:", error);
      throw error;
    }
  },
  getHotelDetails: async (bookingCode: string) => {
    try {
      const response = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingCode }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Hotel Details API Response:", {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      });

      return data;
    } catch (error) {
      console.error("Hotel Details API Error:", error);
      throw error;
    }
  },
  getHotelInfo: async (
    resultIndex: number,
    hotelCode: string,
    traceId: string
  ) => {
    try {
      const response = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/getHotelInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resultIndex,
            hotelCode,
            traceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Hotel Details API Response:", {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      });

      return data;
    } catch (error) {
      console.error("Hotel Details API Error:", error);
      throw error;
    }
  },
  getRoomInfo: async (
    resultIndex: number,
    hotelCode: string,
    traceId: string
  ) => {
    try {
      const response = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/getHotelRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resultIndex,
            hotelCode,
            traceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Hotel Details API Response:", {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      });

      return data;
    } catch (error) {
      console.error("Hotel Details API Error:", error);
      throw error;
    }
  },
};
