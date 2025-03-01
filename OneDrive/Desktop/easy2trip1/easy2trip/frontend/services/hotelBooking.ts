const API_BASE_URL = 'https://easy2trip.com/easy2trip/api/hotels';

export class HotelBookingService {
  // Pre-book a hotel room
  static async preBook(bookingCode: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/preBook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingCode })
      });

      if (!response.ok) {
        throw new Error('Pre-booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Pre-booking error:', error);
      throw error;
    }
  }

  // Confirm booking with guest details
  static async confirmBooking(bookingData: BookingRequest): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Booking confirmation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking confirmation error:', error);
      throw error;
    }
  }

  // Get booking details
  static async getBookingDetails(bookingId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/getBookingDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  }
}