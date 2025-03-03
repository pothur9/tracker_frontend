'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HotelBookingService } from '@/services/hotelBooking'
import { Button } from "@/components/ui/button"
import { Loader2, Check, Download, Share2 } from 'lucide-react'

interface BookingConfirmationProps {
  bookingId: number;
}

export default function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const details = await HotelBookingService.getBookingDetails(bookingId)
        setBookingDetails(details)
      } catch (error) {
        setError('Failed to fetch booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Fetching your booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Oops! Something went wrong</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
              <p className="text-gray-600">Your booking has been successfully confirmed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Booking ID</div>
              <div className="font-medium">{bookingId}</div>
            </div>
            <div>
              <div className="text-gray-500">Booking Date</div>
              <div className="font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Hotel Details</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <img 
                src={bookingDetails?.hotelImage || '/placeholder.jpg'} 
                alt={bookingDetails?.hotelName}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium">{bookingDetails?.hotelName}</h3>
                <p className="text-sm text-gray-600">{bookingDetails?.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Check-in</div>
                <div className="font-medium">{bookingDetails?.checkInDate}</div>
                <div className="text-gray-600">From {bookingDetails?.checkInTime}</div>
              </div>
              <div>
                <div className="text-gray-500">Check-out</div>
                <div className="font-medium">{bookingDetails?.checkOutDate}</div>
                <div className="text-gray-600">Before {bookingDetails?.checkOutTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Guest Details</h2>
          <div className="divide-y">
            {bookingDetails?.guests?.map((guest: any, index: number) => (
              <div key={index} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {guest.Title} {guest.FirstName} {guest.LastName}
                    </div>
                    {index === 0 && (
                      <div className="text-sm text-gray-600">
                        {guest.Email}<br />
                        {guest.Phoneno}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">
                    {guest.PaxType === 1 ? 'Adult' : 'Child'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Room Charges</span>
              <span>₹{bookingDetails?.roomCharges?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes & Fees</span>
              <span>₹{bookingDetails?.taxes?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-3 border-t">
              <span>Total Amount</span>
              <span>₹{bookingDetails?.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {/* Download functionality */}}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {/* Share functionality */}}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Booking
          </Button>
        </div>

        {/* Important Information */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Important Information</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
              <span>Please present a valid government ID at check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
              <span>Check-in time starts from {bookingDetails?.checkInTime}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
              <span>Check-out time is before {bookingDetails?.checkOutTime}</span>
            </li>
          </ul>
        </div>

        {/* Need Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your booking?</p>
          <Button variant="link" onClick={() => router.push('/support')}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}