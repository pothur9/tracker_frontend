import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    await dbConnect();
    
    // Get the start and end dates for the selected month
    const startDate = new Date(`2025-${month}-01`); // Adjust year as needed
    const endDate = new Date(`2025-${parseInt(month) + 1}-01`); // Next month

    const bookings = await Booking.find({
      'paymentDetails.paymentStatus': 'paid',
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      }
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