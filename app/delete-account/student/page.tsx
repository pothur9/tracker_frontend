"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserX, Mail, ShieldCheck, Clock } from "lucide-react"

export default function DeleteStudentAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar showBackButton backUrl="/" />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <UserX className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Delete Student Account</h1>
          <p className="text-muted-foreground">Ambari — account deletion request instructions</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Who can request deletion?
              </CardTitle>
              <CardDescription>Student accounts should be managed by a parent/guardian.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                To protect student safety and prevent unauthorized removal of accounts, we only process deletion
                requests that are sent by the parent/guardian (or an authorized school administrator).
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
                  with the subject <strong>"Delete Student Account"</strong>.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Registered phone number</strong> (used to login)
                  </li>
                  <li>
                    <strong>Student name</strong> and <strong>school name</strong>
                  </li>
                  <li>
                    <strong>Relationship</strong> (parent/guardian) and a short confirmation that you authorize deletion
                  </li>
                </ul>
              </div>

              <div>
                <a href="mailto:support@ambari.in?subject=Delete%20Student%20Account">
                  <Button className="w-full sm:w-auto">Email support@ambari.in</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                What happens after you request deletion?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  We verify the request and may ask for additional confirmation to prevent unauthorized deletion.
                </li>
                <li>
                  Once approved, the account is scheduled for deletion and access will be removed.
                </li>
                <li>
                  Some records may be retained if required for legal or legitimate business purposes.
                </li>
              </ul>
              <p className="text-sm">
                For more details on retention, see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

