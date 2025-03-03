// app/api/flights/search/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received search params:", body);

    // Make sure date format matches exactly with Postman's working format
    body.segments = body.segments.map((segment: any) => ({
      ...segment,
      PreferredDepartureTime: `${segment.PreferredDepartureTime.split("T")[0]
        }T00: 00: 00`,
      PreferredArrivalTime: `${segment.PreferredArrivalTime.split("T")[0]
        }T00: 00: 00`,
    }));

    const requestBody = {
      adultCount: body.adultCount,
      childCount: body.childCount,
      infantCount: body.infantCount,
      directFlight: false,
      oneStopFlight: false,
      journeyType: body.journeyType,
      preferredAirlines: null,
      segments: body.segments,
      sources: null,
    };

    console.log(
      "Making API request with body:",
      JSON.stringify(requestBody, null, 2)
    );

    console.log("request body", requestBody);

    const response = await fetch(
      "https://easy2trip.com/easy2trip/api/flight/search",
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
        body: JSON.stringify(requestBody),
      }
    );

    

    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response:", e);
      return NextResponse.json(
        { error: "Invalid response from flight API" },
        { status: 500 }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      {
        error: "Failed to search flights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
