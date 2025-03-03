export interface CancelPolicy {
    FromDate: string;
    ChargeType: string;
    CancellationCharge: number;
  }
  
  export interface Room {
    Name: string[];
    BookingCode: string;
    Inclusion: string;
    DayRates: Array<Array<{ BasePrice: number }>>;
    TotalFare: number;
    TotalTax: number;
    RoomPromotion?: string[];
    CancelPolicies: CancelPolicy[];
    MealType: string;
    IsRefundable: boolean;
  }
  
  export interface PhotoGalleryProps {
    images: string[];
    onClose: () => void;
    startIndex?: number;
  }
  
  export interface NearbyPlace {
    name: string;
    distance: string;
    type: string;
  }