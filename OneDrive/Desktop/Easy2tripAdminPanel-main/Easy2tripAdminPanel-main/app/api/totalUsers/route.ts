import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/user.model";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    await dbConnect();
    
    // Get total users created in the selected month
    const startDate = new Date(`2025-${month}-01`); // Adjust year as needed
    const endDate = new Date(`2025-${parseInt(month) + 1}-01`); // Next month

    const totalUsers = await User.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      }
    });

    const verifiedUsers = await User.countDocuments({
      isVerified: true,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      }
    });
    
    return NextResponse.json({ 
      totalUsers,
      verifiedUsers
    }, { status: 200 });
    
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { 
        error: "Failed to fetch total users",
        details: err.message
      },
      { status: 500 }
    );
  }
}
