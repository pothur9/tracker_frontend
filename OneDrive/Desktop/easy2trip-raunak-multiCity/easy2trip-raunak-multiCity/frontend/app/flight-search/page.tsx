"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightFilters from "./components/FlightFilters";
import FlightResults from "./components/FlightResults";
import FlightResults2 from "./components/FlightResults2";
import { format } from "date-fns";
import type { Flight } from "@/types/flight";
import TripTypeSelection from "./components/TripTypeSelection";
import { handleSearch } from "@/services/flightSearchUtils";

const FlightSearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnType, setReturnType] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] =
    useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] =
    useState<Flight | null>(null);
  const [onceTime, setOnceTime] = useState(false);

  // Search parameters
  const [selectedTripType, setSelectedTripType] = useState(
    searchParams.get("tripType") || "one-way"
  );
  const [selectedFrom, setSelectedFrom] = useState(
    searchParams.get("from") || ""
  );
  const [selectedTo, setSelectedTo] = useState(searchParams.get("to") || "");
  const [departureDate, setDepartureDate] = useState<Date>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : new Date()
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get("returnDate")
      ? new Date(searchParams.get("returnDate")!)
      : undefined
  );
  const [passengers, setPassengers] = useState({
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
    infants: Number(searchParams.get("infants")) || 0,
  });
  const [travelClass, setTravelClass] = useState(
    searchParams.get("class") || "Economy"
  );

  // Filters
  const [filters, setFilters] = useState({
    priceRange: [0, 20000] as [number, number],
    stops: [] as string[],
    airlines: [] as string[],
    departureTime: [] as string[],
    arrivalTime: [] as string[],
    sortBy: "cheapest",
  });

  const [segments, setSegments] = useState<
    { from: string; to: string; date: string; segmentIndex: number }[]
  >([]);
  const [reload, setReload] = useState(false);

  const handleSearchWrapper = async () => {
    await handleSearch(
      selectedTripType,
      selectedFrom,
      selectedTo,
      departureDate,
      returnDate,
      passengers,
      travelClass,
      segments,
      router,
      setLoading
    );
    setReload(!reload);
  };

  useEffect(() => {
    const searchFlights = async () => {
      if (!selectedFrom || !selectedTo || !departureDate) return;

      try {
        setLoading(true);
        setError(null);

        const results = localStorage.getItem("flightSearchResults");

        if (results) {
          const parsedResults = JSON.parse(results);
          setReturnType(parsedResults?.Response?.Results.length.toString());
          if (
            selectedTripType === "round-trip" &&
            parsedResults?.Response?.Results &&
            parsedResults?.Response?.Results.length == 2
          ) {
            const outbound = parsedResults.Response.Results[0] || [];
            const inbound = parsedResults.Response.Results[1] || [];

            setOutboundFlights(outbound);
            setReturnFlights(inbound);

            const allFlights = [...outbound, ...inbound];
            if (allFlights.length > 0) {
              const prices = allFlights.map((f) => f.Fare.PublishedFare);
              setFilters((prev) => ({
                ...prev,
                priceRange: [Math.min(...prices), Math.max(...prices)] as [
                  number,
                  number
                ],
              }));
            }
          } else {
            if (parsedResults?.Response?.Results?.[0]) {
              setFlights(parsedResults.Response.Results[0]);
              const prices = parsedResults.Response.Results[0].map(
                (f: Flight) => f.Fare.PublishedFare
              );
              setFilters((prev) => ({
                ...prev,
                priceRange: [Math.min(...prices), Math.max(...prices)] as [
                  number,
                  number
                ],
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error loading flights:", err);
        setError("Failed to load flight results");
      } finally {
        setLoading(false);
        setOnceTime(true);
      }
    };

    if (onceTime) searchFlights();
  }, [
    selectedFrom,
    selectedTo,
    departureDate,
    returnDate,
    selectedTripType,
    onceTime,
  ]);

  useEffect(() => {
    const segmentsData = flights[0]?.Segments?.map((segment, segmentIndex) => {
      return {
        from: segment[0].Origin.Airport.CityName,
        to: segment[0].Destination.Airport.CityName,
        date: segment[0].Origin.DepTime,
        segmentIndex: segmentIndex,
      };
    });
    console.log("segmetsData :=", segmentsData);
    setSegments(segmentsData || []);
  }, [flights]);

  const handleBookFlight = (flight) => {
    try {
      if (selectedTripType === "round-trip" && returnType == "2") {
        if (!selectedOutboundFlight || !selectedReturnFlight) {
          throw new Error("Please select both flights");
        }

        // Store both flights for round trip
        const bookingData = {
          outboundFlight: selectedOutboundFlight,
          returnFlight: selectedReturnFlight,
          returnType: returnType,
          bookingContext: {
            from: selectedFrom,
            to: selectedTo,
            tripType: selectedTripType,
            departureDate: format(departureDate, "yyyy-MM-dd"),
            returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : null,
            passengers,
            travelClass,
          },
        };

        localStorage.setItem("selectedFlight", JSON.stringify(bookingData));
      } else {
        // Existing one-way logic
        const bookingData = {
          outboundFlight: selectedOutboundFlight,
          returnType: returnType,
          bookingContext: {
            from: selectedFrom,
            to: selectedTo,
            tripType: selectedTripType,
            departureDate: format(departureDate, "yyyy-MM-dd"),
            passengers,
            travelClass,
          },
        };

        localStorage.setItem("selectedFlight", JSON.stringify(bookingData));
      }

      // Navigate to booking page
      const queryParams = new URLSearchParams({
        from: selectedFrom,
        to: selectedTo,
        tripType: selectedTripType,
        date: format(departureDate, "yyyy-MM-dd"),
        ...(selectedTripType === "round-trip" &&
          returnDate && {
            returnDate: format(returnDate, "yyyy-MM-dd"),
          }),
        passengers: JSON.stringify(passengers),
        class: travelClass,
      });

      console.log("queryParams.toString()", queryParams.toString());

      router.push(`/flight-booking?${queryParams.toString()}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to book flights",
        variant: "destructive",
      });
    }
  };

  console.log("Flights -:", flights);

  // useEffect(() => {
  //   alert(selectedTripType);
  // },[selectedTripType])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
          <div className="p-6">
            <TripTypeSelection
              selectedTripType={selectedTripType}
              setSelectedTripType={setSelectedTripType}
            />

            {selectedTripType === "multi-city" ? (
              segments.map((segment, segmentIndex) => {
                return (
                  <FlightSearchForm
                    segmentIndex={segmentIndex}
                    loading={loading}
                    selectedTripType={selectedTripType}
                    setSelectedTripType={setSelectedTripType}
                    selectedFrom={segment.from}
                    setSelectedFrom={setSelectedFrom}
                    selectedTo={segment.to}
                    setSelectedTo={setSelectedTo}
                    departureDate={segment.date}
                    setDepartureDate={setDepartureDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    travelClass={travelClass}
                    setTravelClass={setTravelClass}
                    handleSearch={handleSearchWrapper}
                  />
                );
              })
            ) : (
              <FlightSearchForm
                loading={loading}
                selectedTripType={selectedTripType}
                setSelectedTripType={setSelectedTripType}
                selectedFrom={selectedFrom}
                setSelectedFrom={setSelectedFrom}
                selectedTo={selectedTo}
                setSelectedTo={setSelectedTo}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                passengers={passengers}
                setPassengers={setPassengers}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                handleSearch={handleSearchWrapper}
              />
            )}
          </div>
        </Card>

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <FlightFilters
              filters={filters}
              setFilters={setFilters}
              flights={
                selectedTripType === "round-trip" && returnType == "2"
                  ? [...outboundFlights, ...returnFlights]
                  : flights
              }
              loading={loading}
            />

            {selectedTripType == "round-trip" && returnType == "2" ? (
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">
                        {selectedFrom} → {selectedTo}
                      </h2>
                      <p className="text-gray-600">
                        {format(departureDate, "EEE, d MMM")}
                      </p>
                    </div>
                    <FlightResults
                      selectedFrom={selectedFrom}
                      selectedTo={selectedTo}
                      dates={[]}
                      filters={filters}
                      setFilters={setFilters}
                      flights={outboundFlights}
                      setFlights={setOutboundFlights}
                      searchLoading={loading}
                      setOnceTime={setOnceTime}
                      onSelectFlight={setSelectedOutboundFlight}
                      selectedFlight={selectedOutboundFlight}
                      passengers={passengers}
                      selectedTripType={selectedTripType}
                    />
                  </div>

                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">
                        {selectedTo} → {selectedFrom}
                      </h2>
                      <p className="text-gray-600">
                        {returnDate && format(returnDate, "EEE, d MMM")}
                      </p>
                    </div>
                    <FlightResults
                      selectedFrom={selectedTo}
                      selectedTo={selectedFrom}
                      dates={[]}
                      filters={filters}
                      setFilters={setFilters}
                      flights={returnFlights}
                      setFlights={setReturnFlights}
                      searchLoading={loading}
                      setOnceTime={setOnceTime}
                      onSelectFlight={setSelectedReturnFlight}
                      selectedFlight={selectedReturnFlight}
                      passengers={passengers}
                      selectedTripType={selectedTripType}
                    />
                  </div>
                </div>

                {selectedOutboundFlight && selectedReturnFlight && (
                  <div className="fixed bottom-0 left-0 right-0 bg-[#1a1d24] text-white py-4 z-50">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <img
                              src={`/airlines/${selectedOutboundFlight.Segments[0][0].Airline.AirlineCode.toLowerCase()}.png`}
                              alt={
                                selectedOutboundFlight.Segments[0][0].Airline
                                  .AirlineName
                              }
                              className="w-8 h-8"
                            />
                            <div>
                              <div className="text-sm">
                                {
                                  selectedOutboundFlight.Segments[0][0].Airline
                                    .AirlineCode
                                }{" "}
                                {
                                  selectedOutboundFlight.Segments[0][0].Airline
                                    .FlightNumber
                                }
                              </div>
                              <div className="text-xs text-gray-400">
                                {format(
                                  new Date(
                                    selectedOutboundFlight.Segments[0][0].Origin.DepTime
                                  ),
                                  "HH:mm"
                                )}{" "}
                                →
                                {format(
                                  new Date(
                                    selectedOutboundFlight.Segments[0][0].Destination.ArrTime
                                  ),
                                  "HH:mm"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <img
                              src={`/airlines/${selectedReturnFlight.Segments[0][0].Airline.AirlineCode.toLowerCase()}.png`}
                              alt={
                                selectedReturnFlight.Segments[0][0].Airline
                                  .AirlineName
                              }
                              className="w-8 h-8"
                            />
                            <div>
                              <div className="text-sm">
                                {
                                  selectedReturnFlight.Segments[0][0].Airline
                                    .AirlineCode
                                }{" "}
                                {
                                  selectedReturnFlight.Segments[0][0].Airline
                                    .FlightNumber
                                }
                              </div>
                              <div className="text-xs text-gray-400">
                                {format(
                                  new Date(
                                    selectedReturnFlight.Segments[0][0].Origin.DepTime
                                  ),
                                  "HH:mm"
                                )}{" "}
                                →
                                {format(
                                  new Date(
                                    selectedReturnFlight.Segments[0][0].Destination.ArrTime
                                  ),
                                  "HH:mm"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ₹
                              {(
                                (selectedOutboundFlight.Fare.PublishedFare +
                                  selectedReturnFlight.Fare.PublishedFare) *
                                (passengers.adults +
                                  passengers.children +
                                  passengers.infants)
                              ).toLocaleString("en-IN")}
                            </div>
                            <div className="text-sm text-gray-400">
                              per person
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleBookFlight(selectedOutboundFlight)
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                              BOOK NOW
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1">
                <FlightResults2
                  selectedFrom={selectedFrom}
                  selectedTo={selectedTo}
                  dates={[]}
                  filters={filters}
                  setFilters={setFilters}
                  flights={flights}
                  setFlights={setFlights}
                  searchLoading={loading}
                  setOnceTime={setOnceTime}
                  onBookFlight={handleBookFlight}
                  passengers={passengers}
                  selectedTripType={selectedTripType}
                  returnType={returnType}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default function FlightSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightSearchContent />
    </Suspense>
  );
}
