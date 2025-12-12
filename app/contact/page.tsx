"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageSquare, Building2 } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar showBackButton backUrl="/" />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            We're here to help! Reach out to us for any questions or support.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                About Ambari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Ambari is a school bus tracking service managed by the <strong>Sri Adavi Thatha Seva Trust</strong>, 
                dedicated to providing safe and reliable transportation tracking for students and parents.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to ensure peace of mind for parents and enhance the safety of students 
                through real-time bus tracking technology.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  For general inquiries and support:
                </p>
                <a 
                  href="mailto:support@ambari.in" 
                  className="text-primary hover:underline font-medium text-lg"
                >
                  support@ambari.in
                </a>
                <p className="text-sm text-muted-foreground mt-3">
                  We typically respond within 24-48 hours
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Call us for immediate assistance:
                </p>
                <a 
                  href="tel:+919876543210" 
                  className="text-primary hover:underline font-medium text-lg"
                >
                  +91 98765 43210
                </a>
                <p className="text-sm text-muted-foreground mt-3">
                  Available Monday - Saturday
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</li>
                    <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li>
                    <li><strong>Sunday:</strong> Closed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground">
                    24/7 - We'll respond during business hours
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All times are in Indian Standard Time (IST)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Office Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p className="font-semibold text-foreground">Sri Adavi Thatha Seva Trust</p>
                <p>123, MG Road</p>
                <p>Bangalore, Karnataka 560001</p>
                <p>India</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Can We Help You With?</CardTitle>
              <CardDescription>
                Common reasons to contact us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Technical Support</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Login or account issues</li>
                    <li>App not working properly</li>
                    <li>Location tracking problems</li>
                    <li>OTP verification issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account & Billing</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Subscription questions</li>
                    <li>Payment issues</li>
                    <li>Refund requests</li>
                    <li>Account cancellation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Service availability</li>
                    <li>School partnerships</li>
                    <li>Feature requests</li>
                    <li>Privacy concerns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Driver Support</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Driver registration</li>
                    <li>Location sharing setup</li>
                    <li>Route management</li>
                    <li>App training</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Quick Tips for Faster Support</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Include your registered phone number in all communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Provide screenshots if you're experiencing a technical issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Mention your device type and operating system version</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Be specific about when the issue started occurring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback & Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We value your feedback! If you have suggestions for improving our service or ideas 
                for new features, we'd love to hear from you. Your input helps us make Ambari better 
                for everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Send your feedback to: <a href="mailto:feedback@ambari.in" className="text-primary hover:underline">feedback@ambari.in</a>
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 border text-center">
            <p className="text-muted-foreground leading-relaxed">
              <strong>Emergency?</strong> For urgent safety concerns related to bus operations, 
              please contact your school administration directly or call local emergency services.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
