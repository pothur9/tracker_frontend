import { format } from "date-fns";
import { flightService } from "@/services/flightService";
import { revalidatePath } from "next/cache";

export const handleSearch = async (
  tripType,
  from,
  to,
  departureDate,
  returnDate,
  travelers,
  travelClass,
  multiCitySegments,
  router,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    console.log("Trip Type:", tripType);
    console.log("Return Date:", returnDate);

    // Validate required fields
    if (
      !from ||
      !to ||
      !departureDate ||
      (tripType === "round-trip" && !returnDate)
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare search parameters
    const searchParams = {
      adultCount: travelers.adults,
      childCount: travelers.children,
      infantCount: travelers.infants,
      directFlight: false,
      oneStopFlight: false,
      journeyType:
        tripType === "one-way" ? 1 : tripType === "round-trip" ? 2 : 3,
      preferredAirlines: null,
      segments:
        tripType === "multi-city"
          ? multiCitySegments.map((segment) => ({
              Origin: segment.from,
              Destination: segment.to,
              FlightCabinClass: "1",
              PreferredDepartureTime: `${format(
                segment.date,
                "yyyy-MM-dd"
              )}T00:00:00`,
              PreferredArrivalTime: `${format(
                segment.date,
                "yyyy-MM-dd"
              )}T00:00:00`,
            }))
          : tripType === "round-trip" && returnDate
          ? [
              {
                Origin: from,
                Destination: to,
                FlightCabinClass: "1",
                PreferredDepartureTime: `${format(
                  departureDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
                PreferredArrivalTime: `${format(
                  departureDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
              },
              {
                Origin: to,
                Destination: from,
                FlightCabinClass: "1",
                PreferredDepartureTime: `${format(
                  returnDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
                PreferredArrivalTime: `${format(
                  returnDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
              },
            ]
          : [
              {
                Origin: from,
                Destination: to,
                FlightCabinClass: "1",
                PreferredDepartureTime: `${format(
                  departureDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
                PreferredArrivalTime: `${format(
                  departureDate,
                  "yyyy-MM-dd"
                )}T00:00:00`,
              },
            ],
      sources: null,
    };

    console.log("Search Parameters:", JSON.stringify(searchParams, null, 2));

    const results = await flightService.searchFlights(searchParams);
    console.log("API Response:", results);

    if (results?.Response?.Results) {
      console.log(
        `data stat ${tripType === "round-trip" && !results.Response.Results[0]}`
      );
      // For round-trip, we need both outbound and return flights
      if (tripType === "round-trip" && !results.Response.Results[0]) {
        throw new Error(
          "No flights round trip found for the selected route and dates"
        );
      }
      // For one-way, we just need the outbound flight
      else if (tripType === "one-way" && !results.Response.Results[0]) {
        throw new Error(
          "No flights found oneway trip for the selected route and date"
        );
      }
      // Set the item to null first
      localStorage.removeItem("flightSearchResults");

      // Store results in localStorage
      localStorage.setItem("flightSearchResults", JSON.stringify(results));

      // Navigate to results page with query parameters
      const queryParams = new URLSearchParams({
        from,
        to,
        tripType,
        date: format(departureDate, "yyyy-MM-dd"),
        ...(tripType === "round-trip" &&
          returnDate && {
            returnDate: format(returnDate, "yyyy-MM-dd"),
          }),
        adults: travelers.adults.toString(),
        children: travelers.children.toString(),
        infants: travelers.infants.toString(),
        passengers: String(
          travelers.adults + travelers.children + travelers.infants
        ),
        class: travelClass,
      });

      router.push(`/flight-search?${queryParams.toString()}`);
      //   revalidatePath("/flight-search");
    } else {
      throw new Error(
        "Oops! No flights found for the selected route and dates"
      );
    }
  } catch (error) {
    console.error("Flight search error:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Failed to search flights. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};
