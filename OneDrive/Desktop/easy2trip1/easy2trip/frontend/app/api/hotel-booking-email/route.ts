// app/api/hotel-booking-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { bookingDetails, guestDetails, room } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dessaimakrand@gmail.com",
        pass: "ypro lhsg reeo vjbl",
      },
    });

    // Create HTML content for booking confirmation
    const emailContent = `
      <h2>Hotel Booking Confirmation</h2>
      
      <h3>Booking Details</h3>
      <p>Room Type: ${room.Name[0]}</p>
      <p>Booking Code: ${bookingDetails.bookingCode}</p>
      <p>Amount: ₹${bookingDetails.netAmount.toLocaleString()}</p>
      <p>Booking Date: ${new Date().toLocaleDateString()}</p>
      
      <h3>Guest Details</h3>
      <h4>Lead Guest</h4>
      <p>Name: ${guestDetails[0].title} ${guestDetails[0].firstName} ${
      guestDetails[0].lastName
    }</p>
      <p>Email: ${guestDetails[0].email}</p>
      <p>Phone: ${guestDetails[0].phone}</p>
      <p>Age: ${guestDetails[0].age}</p>
      
      <h4>Guest 2</h4>
      <p>Name: ${guestDetails[1].title} ${guestDetails[1].firstName} ${
      guestDetails[1].lastName
    }</p>
      <p>Age: ${guestDetails[1].age}</p>
      
      <h3>Room Information</h3>
      <p>Meal Plan: ${room.MealType || "Not included"}</p>
      <p>Cancellation: ${
        room.IsRefundable ? "Free cancellation available" : "Non-refundable"
      }</p>
      ${room.Inclusion ? `<p>Inclusions: ${room.Inclusion}</p>` : ""}
      
      <h3>Cancellation Policy</h3>
      ${
        room.CancelPolicies
          ? room.CancelPolicies.map(
              (policy) => `
        <p>• ${
          policy.ChargeType === "Percentage"
            ? `${policy.CancellationCharge}% charge`
            : `₹${policy.CancellationCharge} charge`
        } 
          if cancelled after ${new Date(
            policy.FromDate
          ).toLocaleDateString()}</p>
      `
            ).join("")
          : "No cancellation policy available"
      }
      
      <p style="margin-top: 20px;">Thank you for choosing our service!</p>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: "dessaimakrand@gmail.com",
      to: "dessaimakrand@gmail.com",
      subject: `New Hotel Booking - ${guestDetails[0].firstName} ${guestDetails[0].lastName}`,
      html: emailContent,
    });

    // Send email to guest
    if (guestDetails[0].email) {
      await transporter.sendMail({
        from: "dessaimakrand@gmail.com",
        to: guestDetails[0].email,
        subject: "Your Hotel Booking Confirmation",
        html: emailContent,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
