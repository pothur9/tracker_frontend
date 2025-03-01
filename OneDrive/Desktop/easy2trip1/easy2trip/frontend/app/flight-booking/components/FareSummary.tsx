"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Flight } from "@/types/flight";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import flightService from "@/services/flightService";

interface FareSummaryProps {
  flightDetails: any;
  flight: any;
  selectedSeats: string[];
  addOns: string[];
  calculateSeatPrice: (seat: string) => number;
  loading?: boolean;
  //onBook:any;
  // handleBooking: () => void;
  formData: any;
}

export function FareSummary({
  flightDetails,
  flight,
  selectedSeats,
  addOns,
  calculateSeatPrice,
  loading = false,
  // onBook,
  formData,
}: FareSummaryProps) {
  console.log(flight, "============+>flight");
  const router = useRouter();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const seatTotal = selectedSeats.reduce(
    (sum, seat) => sum + calculateSeatPrice(seat),
    0
  );
  const addOnTotal = addOns.reduce(
    (sum, addOn) => (addOn === "fast-forward" ? sum + 500 : sum),
    0
  );
  const totalAmount =
    flight.Fare.BaseFare + flight.Fare.Tax + seatTotal + addOnTotal;
  const traceId = JSON.parse(localStorage.getItem("flightSearchResults"))
    .Response.TraceId;

  const preHandlePayment = async (email: string) => {
    const response = await flightService.preHandleCheckout(email);
    return response.isOrgRegistered;
  };

  const handlePayment = async () => {
    console.log(flight, "============+>flight");
    if (formData.adults.length === 0 || formData.adults[0].email === "") {
      alert("Please add atleast one passenger with email");
      return;
    }
    const isRegistered = await preHandlePayment(formData?.adults[0].email);
    console.log("FormData", formData);

    // if(!isRegistered){
    //   alert("Please register your organization first")
    //   return;
    // }

    const bookingDetails = {
      traceId: traceId,
      resultIndex: flightDetails.ResultIndex,
      passengers: formData?.adults.map((passenger: any, index: any) => ({
        Title: passenger.title,
        FirstName: passenger.firstName,
        LastName: passenger.lastName,
        PaxType: 1,
        DateOfBirth: "1990-01-01T00:00:00",
        Gender: passenger.title === "Mr" ? 1 : 2,
        PassportNo: "",
        PassportExpiry: "",
        AddressLine1: "kdksdld",
        AddressLine2: "",
        Fare: flight.Fare,
        City: formData.city,
        CountryCode: "IN",
        CellCountryCode: passenger?.countryCode,
        ContactNo: passenger.mobile,
        Nationality: "IN",
        Email: passenger.email,
        IsLeadPax: index === 0,
        FFAirlineCode: null,
        FFNumber: "",
        GSTCompanyAddress: "",
        GSTCompanyContactNumber: "",
        GSTCompanyName: "",
        GSTNumber: index === 0 ? formData.gstNumber : "",
        GSTCompanyEmail: "",
      })),
    };

    localStorage.setItem("passDetail", JSON.stringify(bookingDetails));
    if (isRegistered) {
      const email = formData.adults[0].email;
      router.push(`/flight-details?email=${encodeURIComponent(email)}`);
    } else {
      const email = formData.adults[0].email;
      const options = {
        key: "rzp_test_H6ucy17am6kIdB", // Replace with your Razorpay key
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "Flight Booking",
        description: "Payment for flight booking",
        image: "https://yourwebsite.com/logo.png",
        handler: function (response: any) {
          // alert("Payment successful " + response.razorpay_payment_id);
          // onBook()
          router.push(`/flight-details?email=${encodeURIComponent(email)}`);
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#f44336",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    }
  };

  return (
    <Card className="sticky top-4">
      <div className="p-6">
        <h3 className="font-semibold mb-4">Fare Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">Base Fare</div>
              <div className="text-sm text-gray-500">Adult (1)</div>
            </div>
            <div>₹ {flight.Fare.BaseFare.toLocaleString("en-IN")}</div>
          </div>

          <div className="flex justify-between">
            <div>
              <div className="font-medium">Taxes & Surcharges</div>
              <div className="text-sm text-gray-500">Including GST</div>
            </div>
            <div>₹ {flight.Fare.Tax.toLocaleString("en-IN")}</div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Seat Charges</div>
                <div className="text-sm text-gray-500">
                  {selectedSeats
                    .map((seat) => `${seat} (₹${calculateSeatPrice(seat)})`)
                    .join(", ")}
                </div>
              </div>
              <div>₹ {seatTotal.toLocaleString("en-IN")}</div>
            </div>
          )}

          {addOns.length > 0 &&
            addOns.map((addOn) => (
              <div key={addOn} className="flex justify-between">
                <div>
                  <div className="font-medium">
                    {addOn === "fast-forward" ? "Fast Forward" : addOn}
                  </div>
                  <div className="text-sm text-gray-500">
                    {addOn === "fast-forward"
                      ? "Priority Check-in + Boarding"
                      : ""}
                  </div>
                </div>
                <div>₹ {addOn === "fast-forward" ? "500" : "0"}</div>
              </div>
            ))}

          <Separator className="my-4" />

          <div className="flex justify-between items-center font-bold">
            <span>Total Amount</span>
            <span className="text-xl">
              ₹ {totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            className="w-full bg-red-600 text-white"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
