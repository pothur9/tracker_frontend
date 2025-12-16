"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, Clock, CheckCircle } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Service Delivery Information
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 12, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Our Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Ambari is a digital service that provides real-time school bus tracking. As a software 
                service, there are no physical products to ship. This page outlines how our service is 
                delivered to users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Service Activation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Instant Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upon successful registration and subscription, users receive immediate access to the 
                  Ambari tracking service. No waiting period or shipping is required.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Activation Process</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Step 1:</strong> Complete registration with valid phone number</li>
                  <li><strong>Step 2:</strong> Verify your account via OTP</li>
                  <li><strong>Step 3:</strong> Subscribe to a service plan (if applicable)</li>
                  <li><strong>Step 4:</strong> Start using the tracking service immediately</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Geographic Coverage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is currently available in select regions of Karnataka, India. We are 
                  continuously expanding our coverage to serve more schools and communities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Supported Schools</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The service is available for schools that have partnered with Ambari. During registration, 
                  you can select your school from our list of participating institutions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Network Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To use our service, you need:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>A smartphone with GPS capability</li>
                  <li>Active internet connection (mobile data or Wi-Fi)</li>
                  <li>Compatible web browser or mobile app</li>
                  <li>Location services enabled on your device</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Service Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">24/7 Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Ambari platform is accessible 24 hours a day, 7 days a week. However, real-time 
                  tracking is available only when:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>The school bus is in operation</li>
                  <li>The driver has activated location sharing</li>
                  <li>The bus has active GPS and internet connectivity</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Support Hours</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our customer support team is available during regular business hours. For urgent 
                  issues, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                If you experience any issues with service activation or access, our technical support 
                team is ready to assist you. We provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Account setup assistance</li>
                <li>Troubleshooting for connectivity issues</li>
                <li>Guidance on using the tracking features</li>
                <li>Help with subscription and billing questions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates and Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We regularly update our service to improve performance and add new features. Updates 
                are delivered automatically and require no action from users.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Scheduled maintenance may occasionally require brief service interruptions. We will 
                notify users in advance of any planned maintenance that may affect service availability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Need help with service delivery or activation?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Managed by:</strong> Sri Adavi Thatha Seva Trust<br />
                <strong>Support:</strong> Visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page for assistance
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Note:</strong> As a digital service, Ambari does not involve physical shipping. 
              All service features are delivered electronically and are accessible immediately upon 
              successful registration and subscription.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
