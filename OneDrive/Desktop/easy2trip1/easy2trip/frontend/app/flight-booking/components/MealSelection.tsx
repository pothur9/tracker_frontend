// app/flight-booking/components/MealSelection.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function MealSelection() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700">
          Pre-book your meals now to make your journey more enjoyable
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            name: "Vegetarian Meal",
            description: "Fresh vegetarian meal with salad",
            price: 350,
            image: "/meals/veg.jpg"
          },
          {
            name: "Non-Vegetarian Meal",
            description: "Chicken/Fish with sides",
            price: 400,
            image: "/meals/non-veg.jpg"
          },
          {
            name: "Special Diet Meal",
            description: "Low-calorie/diabetic friendly",
            price: 450,
            image: "/meals/special.jpg"
          }
        ].map((meal) => (
          <Card key={meal.name} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/meals/default-meal.jpg"
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{meal.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-medium">₹{meal.price}</span>
                <Button variant="outline" size="sm">Add</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        * Meals must be pre-booked at least 24 hours before departure
      </div>
    </div>
  );
}