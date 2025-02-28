"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FlightSummary } from "./components/FlightSummary";
import { SeatSelection } from "./components/SeatSelection";
import { MealSelection } from "./components/MealSelection";
import { PassengerDetails } from "./components/PassengerDetails";
import { AddOnServices } from "./components/AddOnServices";
import { FareSummary } from "./components/FareSummary";
import { flightService } from "@/services/flightService"; // Import your flight service

const FlightBookingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [activeTab, setActiveTab] = useState("seats");
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [fareRules, setFareRules] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [passengerData, setPassengerData] = useState<any>(null);
  const [isOrgRegistered, setIsOrgRegistered] = useState<boolean>(false); // New state for API response
  const travelClass = searchParams.get("class") || "Economy";

  const [formData, setFormData] = useState({
    adults: [
      {
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+91",
        mobile: "",
      },
    ],
    infants: [],
    children: [],
    state: "delhi",
    saveTraveller: false,
    gstNumber: "",
    city: "",
  });

  const [seatsData, setSeatsData] = useState({
    outbound: null,
    return: null,
  });

// Calculate seat price
const calculateSeatPrice = () => {
  const price = localStorage.getItem("seatPricesaaa");
  if (!price) return 0; // Handle case where localStorage is empty

  try {
    let seatPrices = JSON.parse(price); // Convert string to array

    // If `seatPrices` is not an array but a comma-separated string, split it manually
    if (!Array.isArray(seatPrices)) {
      seatPrices = price.split(",").map(Number);
    }

    return seatPrices.reduce((sum, seat) => sum + seat, 0); // Sum all seat prices
  } catch (error) {
    console.error("Error parsing seat prices:", error);
    return 0;
  }
};

// Calculate total amount with safety checks
const calculateTotalAmount = () => {
  if (!flightDetails?.Fare?.PublishedFare) return 0;

  const baseFare = flightDetails.Fare.PublishedFare;
  const seatTotal = calculateSeatPrice(); // Get total seat price correctly
  const addOnTotal = addOns.reduce(
    (sum, addOn) => (addOn === "fast-forward" ? sum + 500 : sum),
    0
  );

  return baseFare + seatTotal + addOnTotal;
};

// Debugging: Check what is stored in localStorage
console.log("Stored seatprice:", localStorage.getItem("seatprice"));
console.log("Calculated Seat Price:", calculateSeatPrice());
console.log("Total Amount:", calculateTotalAmount());



  // API call to preFareQuote
  const preFareQuote = async (flightDetails: any) => {
    console.log("Pre-fare quote for flight details:", flightDetails);
    try {
      const selectedFlight = localStorage.getItem("selectedFlight");
      let traceId = ""; // Declare traceId here
      
      if (selectedFlight) {
        const flightSearchResults = localStorage.getItem("flightSearchResults");
        traceId = flightSearchResults ? JSON.parse(flightSearchResults)?.Response?.TraceId
        ?? "" : "";
        console.log(traceId)
        const selectedFlightData = JSON.parse(selectedFlight);
        const outboundResultIndex = selectedFlightData.outboundFlight.ResultIndex;

        // Check if return flight exists before accessing its ResultIndex
        const returnResultIndex = selectedFlightData.returnFlight ? selectedFlightData.returnFlight.ResultIndex : null;

        console.log("traceId", traceId);
        console.log("outboundResultIndex", outboundResultIndex);
        console.log("returnResultIndex", returnResultIndex);

        // Make the API calls for round trip
        if (flightDetails.isRoundTrip && returnResultIndex) {
          await flightService.getFareRules(traceId, outboundResultIndex);
          await flightService.getFareQuote(traceId, outboundResultIndex);
          await flightService.getFareRules(traceId, returnResultIndex);
          await flightService.getFareQuote(traceId, returnResultIndex);
        } else {
          await flightService.getFareRules(traceId, outboundResultIndex);
          await flightService.getFareQuote(traceId, outboundResultIndex);
        }
      } else {
        const flightSearchResults = localStorage.getItem("flightSearchResults");
        traceId = flightSearchResults ? JSON.parse(flightSearchResults)?.Response?.TraceId
        ?? "" : "";
        const resultIndex = flightDetails?.outboundFlight?.ResultIndex ?? 0;

        console.log("traceId", traceId);
        console.log("resultIndex", resultIndex);
      }
    } catch (err) {
      console.error("Error in preFareQuote:", err);
      setError("Failed to verify organization registration");
      return false;
    }
  };

  // Fetch seat data function
  const fetchSeatData = async (traceId: string, resultIndex: number) => {
    try {
      const response = await flightService.getSSR(traceId, resultIndex.toString());
      if (response.ResponseStatus === 1) {
        return response.Response.SeatDynamic; // Return the seat data
      } else {
        console.error("Error fetching seat data:", response.Error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching seat data:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeBooking = async () => {
      try {
        console.log("Initializing booking... ", flightDetails);

        setLoading(true);
        const selectedFlightStr = localStorage?.getItem("selectedFlight");
        const flightSearchResults = localStorage?.getItem("flightSearchResults");
        const bookingDetails = localStorage?.getItem("bookingDetails");

        if (!selectedFlightStr || !flightSearchResults) {
          throw new Error("No flight selected");
        }

        const searchResultsData = JSON.parse(flightSearchResults);
        const selectedFlightData = JSON.parse(selectedFlightStr);

        const isRoundTrip =
          selectedFlightData.outboundFlight && selectedFlightData.returnFlight;

        if (isRoundTrip) {
          const outboundFare = selectedFlightData.outboundFlight.Fare;
          const returnFare = selectedFlightData.returnFlight.Fare;

          setFlightDetails({
            outboundFlight: {
              ...selectedFlightData.outboundFlight,
              traceId: searchResultsData.Response.TraceId,
            },
            returnFlight: {
              ...selectedFlightData.returnFlight,
              traceId: searchResultsData.Response.TraceId,
            },
            Fare: {
              BaseFare: outboundFare.BaseFare + returnFare.BaseFare,
              Tax: outboundFare.Tax + returnFare.Tax,
              PublishedFare:
                outboundFare.PublishedFare + returnFare.PublishedFare,
              YQ: (outboundFare.YQ || 0) + (returnFare.YQ || 0),
            },
            isRoundTrip: true,
            bookingContext: selectedFlightData.bookingContext,
          });
        } else {
          const flightInfo = selectedFlightData.flight || selectedFlightData;
          console.log("Flight Info:", flightInfo);

          setFlightDetails({
            ...flightInfo,
            traceId: searchResultsData.Response.TraceId,
            Fare: flightInfo.Fare || {
              BaseFare: 0,
              Tax: 0,
              PublishedFare: 0,
              YQ: 0,
            },
            isRoundTrip: false,
            bookingContext: selectedFlightData.bookingContext,
          });
        }

        if (bookingDetails) {
          const parsed = JSON.parse(bookingDetails);
          setPassengerData({
            passengers: parsed.passengers || {
              adults: 1,
              children: 0,
              infants: 0,
            },
          });
        } else {
          const searchContext = selectedFlightData.bookingContext;
          if (searchContext?.passengers) {
            setPassengerData({
              passengers: searchContext.passengers,
            });
          }
        }

        const passengerCount =
          selectedFlightData.bookingContext?.passengers?.adults || 1;
        setFormData((prev) => ({
          ...prev,
          adults: Array(passengerCount).fill({
            title: "Mr",
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "+91",
            mobile: "",
          }),
        }));

        const outboundResultIndex = selectedFlightData.outboundFlight?.ResultIndex;
        const returnResultIndex = selectedFlightData.returnFlight?.ResultIndex;
        const traceId = searchResultsData.Response.TraceId;

        console.log("Trace ID:", traceId);
        console.log("Outbound Result Index:", outboundResultIndex);
        console.log("Return Result Index:", returnResultIndex);

        let seatData = {};

        if (outboundResultIndex) {
          // Fetch outbound seat data
          const outboundSeats = await fetchSeatData(traceId, outboundResultIndex);
          seatData.outbound = outboundSeats;
        }

        if (returnResultIndex) {
          // Fetch return seat data if it exists
          const returnSeats = await fetchSeatData(traceId, returnResultIndex);
          seatData.return = returnSeats;
        }

        if (seatData) {
          setSeatsData(seatData);
        }
      } catch (err) {
        console.error("Error initializing booking:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load booking details"
        );
      } finally {
        setLoading(false);
      }
    };

    const logStorageData = () => {
      console.log("Selected Flight:", localStorage.getItem("selectedFlight"));
      console.log("Flight Search Results:", localStorage.getItem("flightSearchResults"));
      console.log("Booking Details:", localStorage.getItem("bookingDetails"));
    };

    logStorageData();
    initializeBooking();
  }, []);

  // Trigger preHandlePayment API when flightDetails is set
  useEffect(() => {
    if (flightDetails) {
      preFareQuote(flightDetails);
    }
  }, [flightDetails]);

  // Debug log for flight details
  useEffect(() => {
    console.log("Current flight details:", flightDetails);
  }, [flightDetails]);

  const handleSeatSelect = (seatNumber: string) => {
    const maxSeats = passengerData?.passengers?.adults || 1;
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length < maxSeats) {
        return [...prev, seatNumber];
      }
      return [...prev.slice(1), seatNumber];
    });
  };

  const handleAddOnToggle = (service: string) => {
    setAddOns((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      }
      return [...prev, service];
    });
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const isValid = formData.adults.every((passenger) => {
      if (!passenger.firstName || !passenger.lastName) {
        toast({
          title: "Error",
          description: "Please enter passenger name for all passengers",
          variant: "destructive",
        });
        return false;
      }
      if (!passenger.mobile || !passenger.email) {
        toast({
          title: "Error",
          description: "Please enter contact details for all passengers",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    return isValid;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error || !flightDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Failed to load flight details. Please try again."}
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => router.push("/flight-search")}
            className="mt-4"
          >
            Back to Search
          </Button>
        </Alert>
      </div>
    );
  }

  const fareSummaryData = {
    Fare: flightDetails.outboundFlight.totalFare ||
      flightDetails.outboundFlight.Fare || {
        BaseFare: 0,
        Tax: 0,
        PublishedFare: 0,
        YQ: 0,
      },
  };

  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight") || "{}");
  const isonestop = selectedFlight?.outboundFlight?.FareRules || [];
  
  const hasMultipleFareRules = isonestop.length > 1;
  const isonestop1 = selectedFlight?.returnFlight
  ?.FareRules || [];
  
  const hasMultipleFareRules1 = isonestop.length > 1;
  console.log("a000000000000000000000000", hasMultipleFareRules);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FlightSummary
          flight={
            flightDetails.outboundFlight
              ? {
                  outboundFlight: flightDetails.outboundFlight,
                  returnFlight: flightDetails.returnFlight,
                }
              : flightDetails
          }
        />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <PassengerDetails
                maxPassengers={passengerData?.passengers?.adults || 1}
                maxChildren={passengerData?.passengers?.children || 0}
                maxInfants={passengerData?.passengers?.infants || 0}
                formData={formData}
                onFormChange={handleFormChange}
                pessangerData={passengerData?.passengers}
              />
            </Suspense>

            <Suspense fallback={<div>Loading add-ons...</div>}>
              <AddOnServices onAddService={handleAddOnToggle} />
            </Suspense>

            <Tabs defaultValue="seats" onValueChange={setActiveTab}>
              <TabsList className="w-full border-b">
                <TabsTrigger value="seats" className="flex gap-2">
                  <span className="w-5 h-5">🪑</span>
                  Seats
                </TabsTrigger>
                <TabsTrigger value="meals" className="flex gap-2">
                  <span className="w-5 h-5">🍱</span>
                  Meals
                </TabsTrigger>
              </TabsList>
              <Suspense fallback={<div>Loading add-ons...</div>}>
                <TabsContent value="seats">
                  <div>
                    {/* Render outbound seats */}
                    <h2>Outbound Flight Seats</h2>
                    <SeatSelection
                      maxSeats={passengerData?.passengers?.adults || 1}
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelect}
                      calculateSeatPrice={calculateSeatPrice}
                      traceId={flightDetails.outboundFlight.traceId}
                      resultIndex={flightDetails.outboundFlight.ResultIndex}
                      seatsData={seatsData.outbound}            
                      isonestop ={isonestop}
                    />

                    {/* Render return seats only if it's a round trips */}
                    {flightDetails?.isRoundTrip && (
                      <>
                        <h2>Return Flight Seats</h2>
                        <SeatSelection
                          maxSeats={passengerData?.passengers?.adults || 1}
                          selectedSeats={selectedSeats}
                          onSeatSelect={handleSeatSelect}
                          calculateSeatPrice={calculateSeatPrice}
                          traceId={flightDetails.returnFlight.traceId}
                          resultIndex={flightDetails.returnFlight.ResultIndex}
                          seatsData={seatsData.return}
                          isonestop ={isonestop1}
                        />
                      </>
                    )}
                  </div>
                </TabsContent>
              </Suspense>

              <TabsContent value="meals">
                <MealSelection />
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-1">
            <Suspense fallback={<div>Loading summary...</div>}>
              <FareSummary
                flightDetails={flightDetails}
                flight={fareSummaryData}
                selectedSeats={selectedSeats}
                addOns={addOns}
                calculateSeatPrice={calculateSeatPrice}
                // onBook={handleBooking}
                loading={loading}
                formData={formData}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default function FlightBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightBookingContent />
    </Suspense>
  );
}
