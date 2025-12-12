"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar showBackButton backUrl="/" />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 12, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Commitment to Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                At Ambari, managed by the Sri Adavi Thatha Seva Trust, we are committed to protecting 
                your privacy and ensuring the security of your personal information. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your data when you use our school 
                bus tracking service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our service, you agree to the collection and use of information in accordance 
                with this policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We collect the following personal information when you register:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Students/Parents:</strong> Name, phone number, school name, grade/class</li>
                  <li><strong>Drivers:</strong> Name, phone number, license number, school affiliation, district</li>
                  <li><strong>Account Information:</strong> Login credentials and OTP verification data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Location Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect real-time GPS location data from drivers when they activate location sharing. 
                  This data is used solely to provide tracking services to students and parents. Location 
                  data is collected only when:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>The driver has enabled location sharing</li>
                  <li>The tracking service is active</li>
                  <li>The user has granted location permissions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Device Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may collect information about your device, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>Device type and model</li>
                  <li>Operating system version</li>
                  <li>Browser type and version</li>
                  <li>IP address and network information</li>
                  <li>Device identifiers (for push notifications)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information about how you interact with our service, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>Login times and frequency</li>
                  <li>Features used and pages viewed</li>
                  <li>Error logs and diagnostic data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Service Delivery</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide real-time bus tracking functionality</li>
                  <li>Authenticate users and maintain account security</li>
                  <li>Match students with their assigned buses and drivers</li>
                  <li>Display route information and estimated arrival times</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Communication</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Send OTP verification codes</li>
                  <li>Provide service notifications and alerts</li>
                  <li>Respond to customer support inquiries</li>
                  <li>Send important service updates and announcements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Improvement</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Analyze usage patterns to improve functionality</li>
                  <li>Troubleshoot technical issues</li>
                  <li>Develop new features and enhancements</li>
                  <li>Ensure service reliability and performance</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Safety and Security</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Prevent fraud and unauthorized access</li>
                  <li>Protect against security threats</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our Terms and Conditions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                3. Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>

              <div>
                <h3 className="font-semibold mb-2">Within the Service</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Driver location is shared with students/parents assigned to that bus</li>
                  <li>School administrators may access aggregated data for their institution</li>
                  <li>Basic contact information may be shared between matched users (driver-student)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may share data with trusted third-party service providers who assist us in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>SMS/OTP delivery services</li>
                  <li>Cloud hosting and data storage</li>
                  <li>Analytics and performance monitoring</li>
                  <li>Payment processing (if applicable)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  These providers are contractually obligated to protect your data and use it only for 
                  the specified purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Legal Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law or in response to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li>Valid legal processes (court orders, subpoenas)</li>
                  <li>Government or regulatory requests</li>
                  <li>Protection of our rights and safety</li>
                  <li>Investigation of fraud or security issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Encrypted data transmission using HTTPS/SSL</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure cloud infrastructure with backup systems</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive 
                to protect your data, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our service 
                and fulfill the purposes outlined in this policy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Location History:</strong> Stored for 30 days for service improvement</li>
                <li><strong>Transaction Records:</strong> Retained for 7 years for legal compliance</li>
                <li><strong>Deleted Accounts:</strong> Data permanently deleted within 90 days</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You have the following rights regarding your personal information:
              </p>

              <div>
                <h3 className="font-semibold mb-2">Access and Correction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can access and update your account information through your dashboard at any time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Deletion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may request deletion of your account and associated data by contacting our 
                  support team. Some information may be retained for legal or legitimate business purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Location Permissions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can control location sharing through your device settings. Disabling location 
                  services will limit tracking functionality.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Communication Preferences</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can opt out of non-essential communications, but some service-related messages 
                  are necessary for account security and functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                7. Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We use Firebase Cloud Messaging to send push notifications. Device tokens are collected 
                for this purpose. You can disable notifications through your device settings at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Our service is designed for use by students and their parents/guardians. We do not 
                knowingly collect personal information from children under 13 without parental consent. 
                Student accounts should be managed by parents or guardians.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Our service may contain links to third-party websites or integrate with third-party 
                services. We are not responsible for the privacy practices of these external services. 
                We encourage you to review their privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant 
                changes via email or through the application. The "Last updated" date at the top of 
                this page indicates when the policy was last revised.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
              <CardDescription>
                Questions or concerns about your privacy?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please 
                contact us:
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                <strong>Managed by:</strong> Sri Adavi Thatha Seva Trust<br />
                <strong>Contact:</strong> Visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Your Privacy Matters:</strong> We are committed to transparency and protecting 
              your personal information. If you have concerns about how your data is handled, please 
              don't hesitate to reach out to us.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
