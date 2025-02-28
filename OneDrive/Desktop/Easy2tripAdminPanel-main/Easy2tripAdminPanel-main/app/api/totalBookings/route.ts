import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    await dbConnect();
    
    const bookings = await Booking.find({
      createdAt: {
        $gte: new Date(`2025-${month}-01`), // Adjust year as needed
        $lt: new Date(`2025-${parseInt(month) + 1}-01`), // Next month
      }
    }).lean();

    return NextResponse.json({ 
      totalBookings: bookings.length,
      bookings: bookings
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error in totalBookings route:", error);
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch total bookings",
        details: err.message,
        stack: err.stack
      },
      { status: 500 }
    );
  }
}