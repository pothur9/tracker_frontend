// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { status, formData, documents } = await request.json();
    console.log("asdasdadsas");

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

    // Create detailed HTML content
    const emailContent = `
      <h2>New Visa Application - ${status.toUpperCase()}</h2>
      
      <h3>Basic Information</h3>
      <p>Full Name: ${formData.firstName} ${formData.middleName || ""} ${
      formData.lastName
    }</p>
      <p>Passport Number: ${formData.passportNo}</p>
      <p>Nationality: ${formData.presentNationality}</p>
      <p>Gender: ${formData.gender}</p>
      <p>Date of Birth: ${formData.birthDate}</p>
      
      <h3>Contact Details</h3>
      <p>Mobile: ${formData.mobile}</p>
      <p>Address: ${formData.address}</p>
      <p>City: ${formData.city}</p>
      <p>Country: ${formData.residingCountry}</p>
      
      <h3>Visa Details</h3>
      <p>Visa Type: ${formData.visaType}</p>
      <p>Visit Purpose: ${formData.visitReason}</p>
      <p>Arrival Date: ${formData.arrivalDate}</p>
      
      <h3>Professional Details</h3>
      <p>Profession: ${formData.profession}</p>
      <p>Education: ${formData.education}</p>
      
      <h3>Additional Information</h3>
      <p>Language: ${formData.language}</p>
      <p>Religion: ${formData.religion}</p>
      <p>Marital Status: ${formData.maritalStatus}</p>
      <p>Father's Name: ${formData.fatherName}</p>
      <p>Mother's Name: ${formData.motherName}</p>
      
      <h3>Travel History</h3>
      <p>Previously Visited: ${formData.visitedBefore ? "Yes" : "No"}</p>
      <p>Been Resident: ${formData.beenResident ? "Yes" : "No"}</p>
      
      <p style="margin-top: 20px;">Application Status: ${status}</p>
      <p>Submission Time: ${new Date().toLocaleString()}</p>
    `;

    const info = await transporter.sendMail({
      from: "dessaimakrand@gmail.com",
      to: "dessaimakrand@gmail.com",
      subject: `Visa Application - ${status.toUpperCase()} - ${
        formData.firstName
      } ${formData.lastName}`,
      html: emailContent,
      attachments: documents
        ? Object.entries(documents).map(([key, file]) => ({
            filename: file.name,
            content: file,
            contentType: file.type,
          }))
        : [],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
