"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserX, Mail, BadgeCheck, Clock } from "lucide-react"

export default function DeleteDriverAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <UserX className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Delete Driver Account</h1>
          <p className="text-muted-foreground">Ambari — account deletion request instructions</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Driver deletion requests
              </CardTitle>
              <CardDescription>We verify requests to prevent unauthorized deletion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                If you are a driver and want to delete your Ambari account and associated personal data, submit a
                deletion request using the steps below.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                How to request deletion
              </CardTitle>
              <CardDescription>Send an email with the details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-muted-foreground leading-relaxed">
                <p>
                  Email us at{" "}
                  <a href="mailto:support@ambari.in" className="text-primary hover:underline font-medium">
                    support@ambari.in
                  </a>{" "}
                  with the subject <strong>"Delete Driver Account"</strong>.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Registered phone number</strong> (used to login)
                  </li>
                  <li>
                    <strong>Driver name</strong> and <strong>school/district</strong> (if applicable)
                  </li>
                  <li>
                    <strong>License number</strong> (if registered in the app)
                  </li>
                </ul>
              </div>

              <div>
                <a href="mailto:support@ambari.in?subject=Delete%20Driver%20Account">
                  <Button className="w-full sm:w-auto">Email support@ambari.in</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Processing & retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>We may request additional verification before processing.</li>
                <li>Once approved, account access will be removed and deletion will be scheduled.</li>
                <li>Some records may be retained if required by law or for legitimate business purposes.</li>
              </ul>
              <p className="text-sm">
                For more details, see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

