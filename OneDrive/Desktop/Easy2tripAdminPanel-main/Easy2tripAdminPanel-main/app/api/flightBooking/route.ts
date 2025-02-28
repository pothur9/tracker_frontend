import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const flightBookings = await Booking.find({ type: "flight" }).lean();
    
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