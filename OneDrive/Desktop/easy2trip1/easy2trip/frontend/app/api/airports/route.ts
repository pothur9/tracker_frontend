import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://easy2trip.com/easy2trip/api/airports/`,
      {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch airports. Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching all airports:", error);
    return NextResponse.json(
      { error: "Failed to fetch all airports" },
      { status: 500 }
    );
  }
}
