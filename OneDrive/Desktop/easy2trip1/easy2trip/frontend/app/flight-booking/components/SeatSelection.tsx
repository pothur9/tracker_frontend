"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import flightService from "../../../services/flightService"; // Adjust the import path as necessary

interface Seat {
  AirlineCode: string;
  FlightNumber: string;
  CraftType: string;
  Origin: string;
  Destination: string;
  AvailablityType: number; // 0: No Seat, 1: Available, 2: Blocked, 3: Selected
  Code: string; // Seat ID (e.g., "1A")
  RowNo: string; // Row number
  SeatNo: string | null; // Seat number (e.g., "A")
  SeatType: number; // Type of seat
  Currency: string;
  Price: number;
}

interface RowSeat {
  Seats: Seat[]; // Assuming Seats is an array of Seat
  // Add other properties if needed
}

interface Segment {
  SegmentSeat: RowSeat[]; // Assuming SegmentSeat is an array of RowSeat
}

interface SeatSelectionProps {
  maxSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seat: string) => void;
  calculateSeatPrice: (seat: string) => number;
  traceId: string;
  resultIndex: number;
}

export function SeatSelection({
  maxSeats,
  selectedSeats,
  onSeatSelect,
  calculateSeatPrice,
  resultIndex = 0, // Default value if undefined
  isonestop,
}: SeatSelectionProps) {
  const [firstFlightSeats, setFirstFlightSeats] = useState<Seat[]>([]);
  const [secondFlightSeats, setSecondFlightSeats] = useState<Seat[]>([]);
  const [isOneStop, setIsOneStop] = useState(false);
  let traceId = "";

  const handleSeatClick = (
    seatId: string,
    isAvailable: boolean,
    isBlocked: boolean
  ) => {
    if (!isAvailable || isBlocked) return; // Prevent selection if not available or blocked

    // Pass the seat ID to parent for handling
    onSeatSelect(seatId);

    // Update selected seats in local storage
    const updatedSelectedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((seat) => seat !== seatId) // Deselect if already selected
      : [...selectedSeats, seatId]; // Select if not already selected

    // Store the updated selected seats in local storage
    localStorage.setItem("selectedSeats", JSON.stringify(updatedSelectedSeats));

    // Store the prices of selected seats in local storage
    const selectedSeatPrices = updatedSelectedSeats.map((seatId) => {
      const seatData =
        firstFlightSeats.find((seat) => seat.Code === seatId) ||
        secondFlightSeats.find((seat) => seat.Code === seatId);
      return seatData ? seatData.Price : 0; // Default to 0 if seat data not found
    });
    console.log(selectedSeatPrices);
    localStorage.setItem("seatPricesaaa", JSON.stringify(selectedSeatPrices));
  };

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const flightSearchResults = JSON.parse(
          localStorage.getItem("flightSearchResults") || "{}"
        );
        traceId = flightSearchResults?.Response?.TraceId;
        console.log("Result Index:", resultIndex);

        if (resultIndex === undefined) {
          throw new Error("resultIndex is undefined");
        }
        console.log("Fetching seat data with:", {
          traceId,
          resultIndex: resultIndex.toString(),
        });
        const response = await flightService.getSSR(
          traceId,
          resultIndex.toString()
        );

        // Log the raw response data
        console.log("Raw seat data response:", response);

        // Access SeatDynamic correctly
        if (!response || !response.Response || !response.Response.SeatDynamic) {
          throw new Error("Invalid data format received from API");
        }

        // Extract seat data from the response
        const seatData = response.Response.SeatDynamic.flatMap(
          (segment: Segment) =>
            segment.SegmentSeat.flatMap((row: { RowSeats: RowSeat[] }) =>
              row.RowSeats.flatMap((rowSeat: RowSeat) => rowSeat.Seats)
            )
        );

        console.log("Fetched seat data:", seatData);

        const selectedFlight = JSON.parse(
          localStorage.getItem("selectedFlight") || "{}"
        );
        const isOneStopFlight =
          selectedFlight?.outboundFlight?.FareRules?.length > 1;
        setIsOneStop(isonestop);

        if (isOneStopFlight) {
          const groupedFlights = seatData.reduce(
            (acc, seat) => {
              if (
                !acc.firstFlight.length ||
                acc.firstFlight[0].FlightNumber === seat.FlightNumber
              ) {
                acc.firstFlight.push(seat);
              } else {
                acc.secondFlight.push(seat);
              }
              return acc;
            },
            { firstFlight: [] as Seat[], secondFlight: [] as Seat[] }
          );

          setFirstFlightSeats(groupedFlights.firstFlight);
          setSecondFlightSeats(groupedFlights.secondFlight);
        } else {
          setFirstFlightSeats(seatData);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error.message);
      }
    };

    fetchSeatData(); // Call the function to fetch seat data
  }, [traceId, resultIndex]); // Run when traceId or resultIndex changes

  const renderSeatGrid = (seats: Seat[], flightLabel: string) => {
    const rows = 30; // Assuming 30 rows
    const seatsPerRow = 6; // Assuming 6 seats per row
    const grid = [];

    const basePrice = 1000; // Define your base price here

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatLetter = String.fromCharCode(65 + col); // A, B, C, D, E, F
        const seatId = `${row}${seatLetter}`;

        // Find the seat data for this seatId
        const seatData = seats.find((seat) => seat.Code === seatId);
        const isBlocked = seatData ? seatData.AvailablityType === 0 : false; // No Seat
        const isAvailable = seatData ? seatData.AvailablityType === 1 : false; // Available
        const isSelected = selectedSeats.includes(seatId);

        // Determine the seat color based on price
        let seatColorClass = "";
        if (seatData) {
          if (seatData.Price === 0) {
            seatColorClass = "bg-green-200"; // Light green for free seats
          } else if (seatData.Price > basePrice * 2) {
            seatColorClass = "bg-purple-200"; // Light purple for seats priced at double the base price
          } else {
            seatColorClass = "bg-blue-100"; // Default color for normal priced seats
          }
        } // Check if there are multiple fare rules

        const hasMultipleFareRules = isonestop.length > 1;

        console.log("a000000000000000000000000", hasMultipleFareRules);

        rowSeats.push(
          <button
            key={seatId}
            className={cn(
              "w-6 h-6 text-[10px] font-medium rounded transition-colors relative",
              isBlocked ? "invisible" : "visible",
              seatColorClass, // Apply the determined color class
              isAvailable
                ? isSelected
                  ? "bg-blue-500 text-white ring-2 ring-blue-600"
                  : ""
                : "bg-gray-300 cursor-not-allowed"
            )}
            onClick={() => handleSeatClick(seatId, isAvailable, isBlocked)}
            disabled={!isAvailable || isBlocked} // Disable if blocked
          >
            {isSelected ? "✓" : seatLetter}
            {isAvailable && seatData && (
              <span
                className={cn(
                  "absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px]",
                  isSelected && "font-medium text-blue-600"
                )}
              >
                ₹{seatData.Price} {/* Display the price from the seat data */}
              </span>
            )}
          </button>
        );

        // Add aisle gap after seats C and D
        if (col === 2)
          rowSeats.push(<div key={`aisle1-${row}`} className="w-3" />);
        if (col === 3)
          rowSeats.push(<div key={`aisle2-${row}`} className="w-3" />);
      }

      grid.push(
        <div key={row} className="flex items-center gap-1 mb-6">
          <span className="w-4 text-right text-[10px] font-medium">{row}</span>
          <div className="flex gap-1">{rowSeats}</div>
          <span className="w-4 text-left text-[10px] font-medium">{row}</span>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-lg font-bold mt-4 ">{flightLabel}</h2>
        <div className="grid grid-cols-1 gap-2">{grid}</div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-medium">
            {selectedSeats.length} of {maxSeats} Seat(s) Selected
          </h3>
          <p
            className={cn(
              "text-xs",
              selectedSeats.length === maxSeats
                ? "text-green-600"
                : "text-orange-500"
            )}
          >
            {selectedSeats.length === maxSeats
              ? "✓ Selection complete"
              : "Selection pending"}
          </p>
        </div>
        <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
          Use code HSBCFREESEAT
        </div>
      </div>

      {/* Plane Shape */}
      <div className="relative mx-auto w-[500px] ">
        {/* Nose */}
        <div className="h-8 bg-gradient-to-b from-gray-100 rounded-t-full mb-4 " />

        {/* Seat Map */}
        <div className="relative px-8">
          {isOneStop ? (
            <>
              <div
                className="relative  flex items-center justify-center p-6 "
                style={{ width: "450px" }}
              >
                {/* Left Arrow */}
                <button
                  className="absolute left-4 z-10 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition"
                  onClick={() => {
                    const container = document.getElementById("seatContainer");
                    if (container) {
                      container.scrollBy({
                        left: -container.clientWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  ◀
                </button>

                {/* Scrollable Seat Grid Container */}
                <div
                  id="seatContainer"
                  className="flex gap-4 overflow-x-auto scroll-smooth p-4 scrollbar-hide w-[40vw] mx-auto"
                >
                  <div className="min-w-[15vw] bg-gray-100 shadow-md p-6 rounded-lg">
                    {renderSeatGrid(firstFlightSeats, "Flight 1 Seats")}
                  </div>
                  <div className="min-w-[15vw] bg-gray-100 shadow-md p-6 rounded-lg">
                    {renderSeatGrid(secondFlightSeats, "Flight 2 Seats")}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  className="absolute right-4 z-10 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition"
                  onClick={() => {
                    const container = document.getElementById("seatContainer");
                    if (container) {
                      container.scrollBy({
                        left: container.clientWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  ▶
                </button>
              </div>
            </>
          ) : (
            renderSeatGrid(firstFlightSeats, "Seats")
          )}
        </div>

        {/* Tail */}
        <div className="h-8 bg-gradient-to-t from-gray-100 rounded-b-full mt-4" />
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-[10px]">
        <div>
          <div className="font-medium mb-1">Seat Type</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-200" /> Free
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100" /> Regular
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-violet-200" /> Premium
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Features</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-r-2 border-red-500" /> Exit Row
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-b border-black" /> Non-Reclining
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Status</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500" /> Selected
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300" /> Unavailable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
