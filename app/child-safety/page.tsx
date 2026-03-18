"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Flag, Users, Mail } from "lucide-react"

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Child Safety & Protection Policy</h1>
          <p className="text-muted-foreground">Ambari — standards for protecting minors</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our commitment</CardTitle>
              <CardDescription>Ambari is designed to support student transportation safety.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                We take child safety seriously. We do not allow content or behavior that exploits, endangers, or harms
                children. We work to keep student information protected and to prevent misuse of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Prohibited content & behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>Child sexual abuse material (CSAM) or any sexual content involving minors</li>
                <li>Grooming, predatory behavior, harassment, threats, or exploitation of minors</li>
                <li>Sharing a child’s personal data in ways that could put them at risk</li>
                <li>Any attempt to contact students for non-transport purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Safety controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>Student accounts should be managed by parents/guardians</li>
                <li>Access to location is limited to assigned users (students/parents for their bus)</li>
                <li>We investigate reports of abuse or misuse and can suspend or terminate accounts</li>
              </ul>
              <p className="text-sm">
                For privacy details, see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                Reporting child safety concerns
              </CardTitle>
              <CardDescription>If you suspect abuse, exploitation, or unsafe behavior, report it immediately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Email our safety team at{" "}
                <a href="mailto:support@ambari.in" className="text-primary hover:underline font-medium">
                  support@ambari.in
                </a>{" "}
                with the subject <strong>"Child Safety Report"</strong>. Include as much detail as possible (date/time,
                phone number/account involved, screenshots if available).
              </p>
              <p className="text-sm">
                If a child is in immediate danger, contact local emergency services and/or your school administration
                right away.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                For general support, visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a>{" "}
                page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

