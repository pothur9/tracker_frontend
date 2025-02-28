"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const initialFlights = [
  {
    id: 1,
    flightNumber: "FL001",
    from: "New York",
    to: "London",
    departure: "2024-04-10 10:00",
    arrival: "2024-04-10 22:00",
    price: "$500",
    status: "On Time",
  },
  {
    id: 2,
    flightNumber: "FL002",
    from: "Paris",
    to: "Tokyo",
    departure: "2024-04-11 14:00",
    arrival: "2024-04-12 08:00",
    price: "$800",
    status: "Delayed",
  },
];

export default function FlightsPage() {
  const [flights, setFlights] = useState(initialFlights);
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    price: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFlight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const flightData = {
      id: flights.length + 1,
      ...newFlight,
      status: "On Time",
    };
    setFlights((prev) => [...prev, flightData]);
    setNewFlight({
      flightNumber: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
      price: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flights Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Flight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Flight</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input
                  id="flightNumber"
                  name="flightNumber"
                  value={newFlight.flightNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  name="from"
                  value={newFlight.from}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  value={newFlight.to}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure">Departure Time</Label>
                <Input
                  id="departure"
                  name="departure"
                  type="datetime-local"
                  value={newFlight.departure}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival">Arrival Time</Label>
                <Input
                  id="arrival"
                  name="arrival"
                  type="datetime-local"
                  value={newFlight.arrival}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  value={newFlight.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Add Flight
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight Number</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                  <TableCell>{flight.from}</TableCell>
                  <TableCell>{flight.to}</TableCell>
                  <TableCell>{flight.departure}</TableCell>
                  <TableCell>{flight.arrival}</TableCell>
                  <TableCell>{flight.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      flight.status === "On Time" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {flight.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Edit
                    </Button>
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