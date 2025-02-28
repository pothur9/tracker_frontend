import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const bookings = await Booking.find({
      'paymentDetails.paymentStatus': 'paid'
    }).select('paymentDetails.amount');
    
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.paymentDetails?.amount || 0);
    }, 0);
    
    return NextResponse.json({ 
      totalRevenue,
      paidBookings: bookings.length
    }, { status: 200 });
    
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch revenue data",
        details: err.message
      },
      { status: 500 }
    );
  }
}