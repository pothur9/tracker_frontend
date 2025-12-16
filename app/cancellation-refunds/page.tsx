"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function CancellationRefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <RefreshCcw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Cancellation & Refunds
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 12, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Cancellation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Users may cancel their subscription to the Ambari bus tracking service at any time. 
                  To cancel, please contact our support team at least 7 days before the next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">How to Cancel</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Contact us through the Contact Us page</li>
                  <li>Email our support team with your account details</li>
                  <li>Call our helpline during business hours</li>
                  <li>Submit a cancellation request through your dashboard</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Cancellation Timeline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cancellation requests must be submitted at least 7 days before the next billing date. 
                  Services will continue until the end of the current billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5 text-primary" />
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Eligible for Refund
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Service not provided as described</li>
                  <li>Technical issues preventing service usage for more than 7 consecutive days</li>
                  <li>Duplicate charges or billing errors</li>
                  <li>Cancellation within 48 hours of initial subscription</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Eligible for Refund
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Cancellation after 48 hours of subscription</li>
                  <li>Partial month refunds (service is billed monthly)</li>
                  <li>Change of mind after service activation</li>
                  <li>User error or misuse of the service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Refund Processing</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Approved refunds will be processed within 7-10 business days. The refund will be 
                  credited to the original payment method used during subscription.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Please allow an additional 5-7 business days for the refund to reflect in your account, 
                  depending on your bank or payment provider.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Requesting a Refund</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To request a refund, please contact our support team with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>Your account details (name and registered phone number)</li>
                  <li>Transaction ID or payment receipt</li>
                  <li>Reason for refund request</li>
                  <li>Any supporting documentation (if applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                For cancellation or refund queries, please reach out to us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Managed by:</strong> Sri Adavi Thatha Seva Trust<br />
                <strong>Support:</strong> Visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page for detailed contact information
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Note:</strong> This cancellation and refund policy is subject to change. 
              We reserve the right to modify these terms at any time. Users will be notified 
              of any significant changes via email or through the application.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
