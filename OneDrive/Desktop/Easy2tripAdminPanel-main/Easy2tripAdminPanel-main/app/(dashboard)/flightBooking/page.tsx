"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FlightBooking {
  _id: string;
  bookingId: string;
  type: string;
  status: string;
  flightDetails: {
    pnr?: string;
    from?: string;
    to?: string;
    departure?: string;
    arrival?: string;
    craft?: string;
    flightStatus?: string;
    isETicketEligible?: boolean;
    flightItinerary: {
      fare: {
        baseFare?: number;
        tax?: number;
        offeredFare?: number;
      };
    };
  };

  paymentDetails: {
    amount: number;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    currency: string;
  };
  createdAt: string;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function FlightsPage() {
  const [bookings, setBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<FlightBooking | null>(
    null
  );
  const currentMonth = new Date().getMonth() + 1; // Get current month (0-11) and add 1
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString().padStart(2, '0')); // Format to "MM"

  useEffect(() => {
    const fetchFlightBookings = async () => {
      try {
        const response = await axios.get("/api/flightBooking");
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching flight bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightBookings();
  }, []);

  if (loading) {
    return <div className="p-6">Loading flight bookings...</div>;
  }

  // Filter bookings based on the selected month
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate.getMonth() + 1 === parseInt(selectedMonth);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flight Bookings</h1>
        <div>
          <label htmlFor="month" className="mr-2">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-1"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>PNR Number</TableHead>
                <TableHead>Base Fare</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total Fare</TableHead>
                <TableHead>Booking Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const offeredFare = booking.flightDetails?.flightItinerary?.fare?.offeredFare;
                if (!offeredFare) return null;

                return (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {booking.flightDetails?.bookingId}
                    </TableCell>
                    <TableCell>{booking.flightDetails?.pnr}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {booking.flightDetails?.flightItinerary?.fare?.baseFare}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {booking.flightDetails?.flightItinerary?.fare?.tax}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {offeredFare}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold">Flight Information</h3>
                              <p>Flight Number: {booking.flightDetails?.flightNumber}</p>
                              <p>Aircraft: {booking.flightDetails?.craft}</p>
                              <p>From: {booking.flightDetails?.from}</p>
                              <p>To: {booking.flightDetails?.to}</p>
                              <p>
                                Departure: {new Date(booking.flightDetails?.departure || "").toLocaleString()}
                              </p>
                              <p>
                                Arrival: {new Date(booking.flightDetails?.arrival || "").toLocaleString()}
                              </p>
                              <p>
                                E-Ticket: {booking.flightDetails?.isETicketEligible ? "Yes" : "No"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold">Payment Details</h3>
                              <p>Amount: ₹{booking.paymentDetails?.amount.toLocaleString()}</p>
                              <p>Method: {booking.paymentDetails?.paymentMethod}</p>
                              <p>Transaction ID: {booking.paymentDetails?.transactionId}</p>
                              <p>Status: {booking.paymentDetails?.paymentStatus}</p>
                              <p>Currency: {booking.paymentDetails?.currency}</p>
                              <p>Booking Date: {new Date(booking.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
