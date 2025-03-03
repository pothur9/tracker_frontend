// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  // Log environment variables (development only)
  console.log("Environment check:", {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
  });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "dessaimakrand@gmail.com", // hardcode for testing
        pass: "ypro lhsg reeo vjbl", // hardcode for testing
      },
    });

    // Send test email
    const info = await transporter.sendMail({
      from: "dessaimakrand@gmail.com",
      to: "dessaimakrand@gmail.com",
      subject: "Test Email from Next.js App",
      text: "This is a test email from your Next.js application",
      html: "<h1>Test Email</h1><p>This is a test email from your Next.js application</p>",
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("Email error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.response || error.stack,
      },
      { status: 500 }
    );
  }
}
