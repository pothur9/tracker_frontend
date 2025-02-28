import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Booking from "@/models/booking.model";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate bookings by month
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalBookings: { $sum: 1 } // Count total bookings
        }
      },
      {
        $sort: { _id: 1 } // Sort by month
      }
    ]);

    // Format the response
    const monthlyBookings = Array(12).fill(0); // Initialize an array for 12 months
    bookings.forEach((booking) => {
      monthlyBookings[booking._id - 1] = booking.totalBookings; // Fill in the counts
    });

    return NextResponse.json({ monthlyBookings }, { status: 200 });
    
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch monthly bookings",
        details: err.message
      },
      { status: 500 }
    );
  }
}