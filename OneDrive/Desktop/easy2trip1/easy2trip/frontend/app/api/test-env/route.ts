// app/api/test-env/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    // Don't log actual values in production
    emailUser: process.env.NODE_ENV === 'development' ? process.env.EMAIL_USER : undefined
  });
}