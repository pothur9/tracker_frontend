import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all bookings with required fields
    const bookings = await Booking.find({}, {
      type: 1,
      status: 1,
      createdAt: 1,
      flightDetails: 1 // Include flight details if needed
    }).lean();

    return NextResponse.json({ 
      totalBookings: bookings.length,
      bookings: bookings
    }, { status: 200 });
    
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch total bookings",
        details: err.message
      },
      { status: 500 }
    );
  }
} 