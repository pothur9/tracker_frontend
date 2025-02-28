"use client";
import flightService from "@/services/flightService";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Loader from "@/components/loader";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Card, CardContent } from "@/components/ui/card";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaUser,
  FaClock,
  FaMoneyBillWave,
  FaDownload,
  FaEnvelope,
} from "react-icons/fa";
// Adjust the path as necessary

const FlightDetailsContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ticketResponse, setTicketResponse] = useState<any>(null);
  const [returnTicketResponse, setReturnTicketResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const hasExecuted = useRef(false); // Ref to track if the API has been called
  const [isOrgRegistered, setIsOrgRegistered] = useState(false);

  // Helper function to handle flight booking and ticket retrieval
  const handleFlightBooking = async (
    flightDetails: any,
    isOutbound: boolean
  ) => {
    console.log("Flight Details:", flightDetails);
    const passData = localStorage.getItem("passDetail") || "null";
    console.log("passData:", passData);
    const data = JSON.parse(passData);

    const bookingPayload = {
      paymentDetails: {
        amount: 1999,
        paymentStatus: "paid",
        paymentMethod: "UPI",
        transactionId: "8dfdsfjfkflflkjkdff",
      },
      passengers: data?.passengers,
      traceId: data?.traceId,
      resultIndex: isOutbound
        ? flightDetails.outboundFlight.ResultIndex
        : flightDetails.returnFlight.ResultIndex,
    };

    if (flightDetails?.outboundFlight && !flightDetails?.outboundFlight.IsLCC) {
      // Book the flight first
      const bookingResponse = await flightService.bookFlight(bookingPayload);
      console.log("Booking response:", bookingResponse);
    }
    if (flightDetails?.returnFlight && !flightDetails?.returnFlight.IsLCC) {
      // Book the flight first
      const bookingResponse = await flightService.bookFlight(bookingPayload);
      console.log("Booking response:", bookingResponse);
    }

    // Get the flight ticket
    const ticketRes = await flightService.getFlightTicket(bookingPayload);
    console.log("Ticket response:", ticketRes);

    if (isOutbound) {
      setTicketResponse(ticketRes.Response);
    } else {
      setReturnTicketResponse(ticketRes.Response);
    }
    setIsLoading(false);
  };

  // Helper function to handle post-checkout
  const postCheckout = async (ticket: any) => {
    console.log("Ticket:", ticket);
    const response = await flightService.postHandleCheckout(ticket, email);
    if (response.isOrgRegistered) {
      // alert("Booking Successful");
      setBookingSuccess(true);
    } else {
      alert("Booking Failed");
      setBookingSuccess(false);
    }
    setIsLoading(false); // Set loading to false once the checkout process is completed
  };

  useEffect(() => {
    if (hasExecuted.current) return; // Prevent double execution
    hasExecuted.current = true; // Mark as executed

    const passData = localStorage.getItem("passDetail") || "null";
    const data = JSON.parse(passData);
    console.log("Ticket Booking Data:", data);

    const flightData = localStorage.getItem("selectedFlight") || "null";
    const flightDetails = JSON.parse(flightData);
    console.log("Flight Details:", flightDetails);

    const apiCall = async () => {
      try {
        // Check if the organization is registered
        const response = await flightService.preHandleCheckout(email!);
        console.log("API Response:", response);

        if (!response.isOrgRegistered) {
          console.log("Organization is not registered. Setting state...");
          setIsOrgRegistered(false);

          if (flightDetails?.outboundFlight) {
            await handleFlightBooking(flightDetails, true); // Handle outbound flight
          }
          if (flightDetails?.returnFlight) {
            await handleFlightBooking(flightDetails, false); // Handle return flight
          }
          // else{
          //   await handleFlightBooking(flightDetails, true); // Handle outbound flight
          // }
        } else {
          console.log("Organization is registered. Setting state...");
          setIsOrgRegistered(true);

          const checkoutPayload = {
            amount: 1999,
            paymentStatus: "paid",
            paymentMethod: "UPI",
            transactionId: "8dfdsfjfkflflkjkdff",
            passengers: data?.passengers,
            traceId: data?.traceId,
            resultIndex: flightDetails?.outboundFlight
              ? flightDetails.outboundFlight.ResultIndex
              : data?.resultIndex,
            isLcc: flightDetails?.outboundFlight
              ? flightDetails.outboundFlight.IsLCC
              : flightDetails?.IsLCC,
          };

          await postCheckout(checkoutPayload);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error during flight booking or ticket retrieval:", err);
        setIsLoading(false); // In case of error, stop loading
      }
    };

    // Run the API call when the component mounts
    apiCall();
  }, [email]);

  console.log(isOrgRegistered, "isOrgRegistered");
  console.log(ticketResponse, "ticketResponse");

  const checkTicket = async (traceId: string) => {
    if (!traceId || traceId === "N/A") {
      alert("Invalid Trace ID. Please try again later.");
      return;
    }
    // Replace with your actual logic (e.g., API call or redirect)
    console.log("Checking ticket for Trace ID:", { traceId: traceId });
    const getFlightBookingDetailsRes =
      await flightService.getFlightBookingDetails(traceId);
    console.log(
      "getFlightBookingDetails response:",
      getFlightBookingDetailsRes
    );

    // if (isOutbound) {
    //   setTicketResponse(ticketRes.Response);
    // } else {
    //   setReturnTicketResponse(ticketRes.Response);
    // }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isOrgRegistered) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header at the top */}
        <div className="sticky top-0 z-50 bg-white shadow-md mb-6">
          <Header />
        </div>

        {/* Main content area with more padding and spacing */}
        <div className="flex-grow flex items-center justify-center px-6 py-12 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mb-6">
          <div className="text-center">
            <h1 className="text-gray-600 font-semibold text-xl mb-6">
              Your ticket has been sent for review and approval to your manager.
            </h1>
            <p className="text-gray-500">
              You will receive your ticket as soon as the approval is done.
            </p>
          </div>
        </div>

        {/* Footer at the bottom */}
        <div className="bg-white shadow-md mt-6">
          <Footer />
        </div>
      </div>
    );
  }
  if (ticketResponse && ticketResponse.Response == null) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header at the top */}
        <div className="sticky top-0 z-50 bg-white shadow-md mb-6">
          <Header />
        </div>

        {/* Main content area with more padding and spacing */}
        <div className="flex-grow flex items-center justify-center px-6 py-12 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mb-6">
          <div className="text-center">
            <h1 className="text-gray-600 font-semibold text-xl mb-6">
              Oops! Something Went Wrong.
            </h1>
            <p className="text-gray-500">We are booking your ticket...</p>
            <p className="text-gray-500">
              You will receive your ticket as soon as the approval is done.
            </p>
            <p className="text-gray-500">
              Please note the Trace ID for further reference.
            </p>
            <p className="text-gray-500">
              <strong>TraceId:</strong> {ticketResponse?.TraceId || "N/A"}
            </p>

            {/* Check Ticket Button */}
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              onClick={() => checkTicket(ticketResponse?.TraceId)}
            >
              Check Ticket
            </button>
          </div>
        </div>

        {/* Footer at the bottom */}
        <div className="bg-white shadow-md mt-6">
          <Footer />
        </div>
      </div>
    );
  }
  const { FlightItinerary } = ticketResponse.Response;
  const { Airline, Origin, Destination, Duration } =
    FlightItinerary.Segments[0];
  const { Passenger, Fare, PNR, BookingId } = FlightItinerary;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Flight Ticket", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [
        [
          "PNR",
          "Booking ID",
          "Flight",
          "Origin",
          "Destination",
          "Duration",
          "Total Fare",
        ],
      ],
      body: [
        [
          PNR,
          BookingId,
          `${Airline.AirlineName} - ${Airline.FlightNumber}`,
          Origin.Airport.CityName,
          Destination.Airport.CityName,
          `${Duration} min`,
          `₹${Fare.PublishedFare}`,
        ],
      ],
    });
    Passenger.forEach((pax, index) => {
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [["Passenger", "DOB", "Contact", "Email"]],
        body: [
          [
            `${pax.Title} ${pax.FirstName} ${pax.LastName}`,
            new Date(pax.DateOfBirth).toLocaleDateString(),
            pax.ContactNo,
            pax.Email,
          ],
        ],
      });
    });
    doc.save("flight_ticket.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header at the top */}
      <div className="sticky top-0 z-50 bg-white shadow-md mb-6">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <Card className="shadow-lg rounded-2xl border border-gray-200 p-6 bg-white">
          <CardContent>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {Airline.AirlineName} - {Airline.FlightNumber}
                </h2>
                <p className="text-gray-500 font-medium">PNR: {PNR}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking ID: {BookingId}</p>
                <p className="text-sm text-gray-500">Status: Confirmed</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-center">
              <div className="flex-1">
                <FaPlaneDeparture className="text-2xl text-blue-500 mx-auto" />
                <h3 className="font-medium text-lg">
                  {Origin.Airport.CityName}
                </h3>
                <p className="text-gray-600">
                  {new Date(Origin.DepTime).toLocaleString()}
                </p>
              </div>
              <div className="flex-1">
                <FaClock className="text-xl text-gray-600 mx-auto" />
                <p className="text-gray-700">{Duration} min</p>
              </div>
              <div className="flex-1">
                <FaPlaneArrival className="text-2xl text-red-500 mx-auto" />
                <h3 className="font-medium text-lg">
                  {Destination.Airport.CityName}
                </h3>
                <p className="text-gray-600">
                  {new Date(Destination.ArrTime).toLocaleString()}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Passenger Details</h3>
            <div className="space-y-4">
              {Passenger.map((pax, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-xl text-gray-700" />
                      <p className="text-gray-700 font-medium">
                        {pax.Title} {pax.FirstName} {pax.LastName}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      DOB: {new Date(pax.DateOfBirth).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Contact: {pax.ContactNo}
                    </p>
                    <p className="text-gray-500 text-sm">Email: {pax.Email}</p>
                  </div>
                  <div>
                    <Barcode
                      value={pax.FirstName + pax.LastName + PNR}
                      format="CODE128"
                      height={50}
                      width={1.5}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="my-4 border-b pb-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Fare Type</th>
                    <th className="border p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Base Fare</td>
                    <td className="border p-2 text-right">{Fare.BaseFare}</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Tax</td>
                    <td className="border p-2 text-right">{Fare.Tax}</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border p-2">Total Fare</td>
                    <td className="border p-2 text-right">
                      {Fare.PublishedFare}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={generatePDF}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
              >
                <FaDownload /> <span>Download PDF</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
                <FaEnvelope /> <span>Email Ticket</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md mt-6">
        <Footer />
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col min-h-screen bg-gray-100">
  //     {/* Header at the top */}
  //     <div className="sticky top-0 z-50 bg-white shadow-md mb-6">
  //       <Header />
  //     </div>
  //     <div className="bg-white rounded-lg shadow-lg flex flex-col items-center max-w-4xl w-full">
  //       {bookingSuccess && (
  //         <div className="w-full mb-4 p-4 bg-green-100 text-green-800 rounded">
  //           Booking Successful! You will receive a confirmation on your email{" "}
  //           <span
  //             onClick={() => window.open(`mailto:${email}`)}
  //             className="text-blue-500 cursor-pointer"
  //           >
  //             {email}
  //           </span>
  //         </div>
  //       )}
  //       <div className="bg-white rounded-lg shadow-lg flex overflow-hidden w-full ">
  //         <div className="p-6 flex-1">
  //           <div className="flex justify-between items-center mb-4">
  //             <h1 className="text-gray-600 font-semibold">
  //               Online Flight Booking
  //             </h1>
  //             <h2 className="text-xl font-bold">ECONOMY CLASS</h2>
  //           </div>
  //           <div className="grid grid-cols-2 gap-4 mb-4">
  //             <div>
  //               <p className="text-gray-500 text-sm">AIRLINE</p>
  //               <p className="font-bold">
  //                 {ticketResponse.Response.FlightItinerary.AirlineCode}
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">FROM</p>
  //               <p className="font-bold">
  //                 {
  //                   ticketResponse.Response.FlightItinerary.Segments[0].Origin
  //                     .Airport.CityName
  //                 }
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">TO</p>
  //               <p className="font-bold">
  //                 {
  //                   ticketResponse.Response.FlightItinerary.Segments[0]
  //                     .Destination.Airport.CityName
  //                 }
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">Departure TIME</p>
  //               <p className="font-bold">
  //                 {
  //                   ticketResponse.Response.FlightItinerary.Segments[0]
  //                     .Destination.Airport.CityName
  //                 }
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">PASSENGER</p>
  //               <p className="font-bold">MARK D COOPER</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">SEAT</p>
  //               <p className="font-bold">22A</p>
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-3 gap-4">
  //             <div>
  //               <p className="text-gray-500 text-sm">DEPARTURE</p>
  //               <p className="font-bold">2022-11-21</p>
  //               <p className="text-2xl font-bold">16:00</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">ARRIVAL</p>
  //               <p className="font-bold">2022-11-21</p>
  //               <p className="text-2xl font-bold">17:00</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500 text-sm">GATE</p>
  //               <p className="font-bold">A22</p>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="bg-blue-800 text-white p-6 flex flex-col items-center justify-center">
  //           <h2 className="text-lg font-bold mb-4">OFBMS</h2>
  //           <img
  //             src="https://placehold.co/100x100"
  //             alt="Airplane icon"
  //             className="w-16 h-16"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div className="bg-white shadow-md mt-6">
  //       <Footer />
  //     </div>
  //   </div>
  // );
};

export default function FlightBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightDetailsContent />
    </Suspense>
  );
}
