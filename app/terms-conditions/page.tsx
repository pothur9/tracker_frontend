"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Shield, Users, AlertCircle } from "lucide-react"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 12, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Ambari school bus tracking service, you accept and agree to be 
                bound by the terms and provisions of this agreement. If you do not agree to these terms, 
                please do not use our service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This service is managed by the <strong>Sri Adavi Thatha Seva Trust</strong> and is designed 
                to provide real-time bus tracking for students, parents, and drivers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                2. User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Registration</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Users must provide accurate and complete information during registration</li>
                  <li>Students/Parents and Drivers must register with valid phone numbers</li>
                  <li>Each user is responsible for maintaining the confidentiality of their account</li>
                  <li>Users must notify us immediately of any unauthorized use of their account</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">User Conduct</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Users agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>Use the service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to the system</li>
                  <li>Share false or misleading location information</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Impersonate any person or entity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Ambari provides a real-time GPS tracking service for school buses. The service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time location tracking of school buses</li>
                <li>Route information and estimated arrival times</li>
                <li>Notifications and alerts for students and parents</li>
                <li>Driver interface for location sharing</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We strive to provide accurate and reliable service, but we do not guarantee uninterrupted 
                or error-free operation. Service may be affected by factors beyond our control, including 
                network connectivity, GPS signal availability, and device compatibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                4. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We collect and process user data in accordance with our Privacy Policy. By using our service, 
                you consent to the collection and use of information as described in our 
                <a href="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</a>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Location data is collected only when the service is active and is used solely for the 
                purpose of providing bus tracking functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Subscription and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Access to certain features may require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Pay all applicable fees as described at the time of purchase</li>
                <li>Provide accurate billing information</li>
                <li>Authorize automatic renewal unless cancelled</li>
                <li>Review our Cancellation & Refund policy for cancellation terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                6. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                The Ambari service is provided "as is" without warranties of any kind. We shall not be 
                liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of data or service interruptions</li>
                <li>Inaccuracies in location data or estimated arrival times</li>
                <li>Actions taken based on information provided by the service</li>
                <li>Unauthorized access to or alteration of user data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Our total liability shall not exceed the amount paid by you for the service in the 
                past 12 months.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Ambari service, including but not limited 
                to text, graphics, logos, and software, are the property of Sri Adavi Thatha Seva Trust 
                and are protected by copyright and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Users are granted a limited, non-exclusive license to access and use the service for 
                personal, non-commercial purposes only.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your access to the service at any time, 
                without notice, for conduct that we believe:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Violates these Terms and Conditions</li>
                <li>Is harmful to other users or the service</li>
                <li>Exposes us to legal liability</li>
                <li>Is fraudulent or involves illegal activity</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of 
                significant changes via email or through the application. Continued use of the service 
                after changes constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the 
                laws of India. Any disputes arising from these terms shall be subject to the exclusive 
                jurisdiction of the courts in Karnataka, India.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
              <CardDescription>
                Questions about these Terms and Conditions?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Managed by:</strong> Sri Adavi Thatha Seva Trust<br />
                <strong>Contact:</strong> Visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using the Ambari service, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
