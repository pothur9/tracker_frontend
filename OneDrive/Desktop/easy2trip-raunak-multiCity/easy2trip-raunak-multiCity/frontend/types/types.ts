export interface HotelPassenger {
    Title: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string | null;
    PaxType: number; // 1 for adult, 2 for child
    LeadPassenger: boolean;
    Age: number;
    PassportNo: string | null;
    PassportIssueDate: string | null;
    PassportExpDate: string | null;
    Phoneno?: string | null;
    PaxId?: number;
    GSTCompanyAddress?: string | null;
    GSTCompanyContactNumber?: string | null;
    GSTCompanyName?: string | null;
    GSTNumber?: string | null;
    GSTCompanyEmail?: string | null;
    PAN?: string | null;
  }
  
  export interface BookingRequest {
    bookingCode: string;
    netAmount: number;
    guestNationality: string;
    hotelPassenger: HotelPassenger[];
  }