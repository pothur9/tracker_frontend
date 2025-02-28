"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const bookingHistory = [
  {
    id: 1,
    type: "Hotel",
    name: "Grand Hotel",
    customer: "John Doe",
    date: "2024-04-10",
    amount: "$200",
    status: "Completed",
  },
  {
    id: 2,
    type: "Flight",
    name: "FL002 - Paris to Tokyo",
    customer: "Jane Smith",
    date: "2024-04-11",
    amount: "$800",
    status: "Pending",
  },
  {
    id: 3,
    type: "Hotel",
    name: "Seaside Resort",
    customer: "Mike Johnson",
    date: "2024-04-12",
    amount: "$350",
    status: "Cancelled",
  },
];

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Booking History</h1>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingHistory.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Badge variant={booking.type === "Hotel" ? "default" : "secondary"}>
                      {booking.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === "Completed" 
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}