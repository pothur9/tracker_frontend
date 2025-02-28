import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required for searching airports" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://easy2trip.com/easy2trip/api/airports/search?keyword=${encodeURIComponent(
        keyword
      )}`,
      {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search airports. Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Airport search error:", error);
    return NextResponse.json(
      { error: "Failed to search airports" },
      { status: 500 }
    );
  }
}
