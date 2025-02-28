// File: app/hotels/confirmation/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmation() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Booking Confirmed! 🎉</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your booking. We've sent the confirmation details to your email.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/hotels')}
              variant="outline"
              className="w-full"
            >
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}