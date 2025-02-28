"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface CheckoutProps {
  isOpen: boolean
  onClose: () => void
  carDetails: any
  customerDetails: {
    name: string
    email: string
    phone: string
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function Checkout({ isOpen, onClose, carDetails, customerDetails }: CheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    setIsLoading(true)
    const options = {
      key: "rzp_test_H6ucy17am6kIdB", // Replace with your actual Razorpay test key
      amount: carDetails.price * 100, // Amount in paise
      currency: "INR",
      name: "Car Rental",
      description: `Booking for ${carDetails.name}`,
      image: "/logo.png", // Replace with your company logo
      handler: (response: any) => {
        alert("Payment successful. Payment ID: " + response.razorpay_payment_id)
        onClose()
      },
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      theme: {
        color: "#3B82F6",
      },
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your booking for {carDetails?.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            <strong>Car:</strong> {carDetails?.name}
          </p>
          <p className="mb-2">
            <strong>Price:</strong> ${carDetails?.price} per day
          </p>
          <p className="mb-2">
            <strong>Name:</strong> {customerDetails.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {customerDetails.email}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {customerDetails.phone}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

