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

// Define the interface for hotel type
interface Hotel {
  id: number;
  name: string;
  location: string;
  rooms: number;
  rating: number;
  price: string;
  status: string;
}

// Define interface for the form state
interface HotelFormData {
  name: string;
  location: string;
  rooms: string;  // Keep as string for form input
  rating: string; // Keep as string for form input
  price: string;
}

const initialHotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Hotel",
    location: "New York",
    rooms: 120,
    rating: 4.5,
    price: "$200",
    status: "Available",
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Miami",
    rooms: 85,
    rating: 4.8,
    price: "$350",
    status: "Limited",
  },
];

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [newHotel, setNewHotel] = useState<HotelFormData>({
    name: "",
    location: "",
    rooms: "",
    rating: "",
    price: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hotelData: Hotel = {
      id: hotels.length + 1,
      name: newHotel.name,
      location: newHotel.location,
      rooms: parseInt(newHotel.rooms, 10),    // Convert string to number
      rating: parseFloat(newHotel.rating),     // Convert string to number
      price: newHotel.price,
      status: "Available",
    };
    setHotels((prev) => [...prev, hotelData]);
    setNewHotel({
      name: "",
      location: "",
      rooms: "",
      rating: "",
      price: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hotels Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Hotel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newHotel.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={newHotel.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rooms">Number of Rooms</Label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  value={newHotel.rooms}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newHotel.rating}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Night</Label>
                <Input
                  id="price"
                  name="price"
                  value={newHotel.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Add Hotel
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
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell>{hotel.location}</TableCell>
                  <TableCell>{hotel.rooms}</TableCell>
                  <TableCell>{hotel.rating}</TableCell>
                  <TableCell>{hotel.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      hotel.status === "Available" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {hotel.status}
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