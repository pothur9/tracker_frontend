"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const initialOffers = [
  {
    id: 1,
    title: "Summer Special",
    code: "SUMMER2024",
    discount: "20%",
    validUntil: "2024-06-30",
    type: "Hotel",
    status: "Active",
  },
  {
    id: 2,
    title: "Early Bird Flight",
    code: "EARLYBIRD",
    discount: "15%",
    validUntil: "2024-05-15",
    type: "Flight",
    status: "Active",
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState(initialOffers);
  const [newOffer, setNewOffer] = useState({
    title: "",
    code: "",
    discount: "",
    validUntil: "",
    type: "Hotel",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offerData = {
      id: offers.length + 1,
      ...newOffer,
      status: "Active",
    };
    setOffers((prev) => [...prev, offerData]);
    setNewOffer({
      title: "",
      code: "",
      discount: "",
      validUntil: "",
      type: "Hotel",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Special Offers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Offer Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newOffer.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Offer Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={newOffer.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  name="discount"
                  value={newOffer.discount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={newOffer.validUntil}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={newOffer.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Add Offer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{offer.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Code: {offer.code}</p>
                </div>
                <Badge variant={offer.type === "Hotel" ? "default" : "secondary"}>
                  {offer.type}
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold text-red-600">{offer.discount} OFF</p>
                <p className="text-sm text-gray-500">Valid until: {offer.validUntil}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-red-600">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}