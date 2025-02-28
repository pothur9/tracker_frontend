import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    await dbConnect();
    
    const flightBookings = await Booking.find({
      type: "flight",
      createdAt: {
        $gte: new Date(`2025-${month}-01`), // Adjust year as needed
        $lt: new Date(`2025-${parseInt(month) + 1}-01`), // Next month
      }
    }).lean();
    
    return NextResponse.json({ 
      totalFlightBookings: flightBookings.length,
      bookings: flightBookings
    }, { status: 200 });
    
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch flight bookings",
        details: err.message
      },
      { status: 500 }
    );
  }
}