"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bus, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (phone.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate sending reset instructions
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSubmitted(true)
      toast({
        title: "Reset Instructions Sent",
        description: "Check your phone for password reset instructions",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 pt-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bus className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-serif font-bold">TrackBus</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif">Check Your Phone</CardTitle>
              <CardDescription>We've sent password reset instructions to {phone}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Follow the instructions in the message to reset your password.
              </p>

              <div className="space-y-2">
                <Link href="/auth/student/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Student Login
                  </Button>
                </Link>
                <Link href="/auth/driver/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Driver Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-serif font-bold">TrackBus</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
            <CardDescription>Enter your phone number and we'll send you reset instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Instructions...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/student/login" className="text-sm text-primary hover:underline block">
                Back to Student Login
              </Link>
              <Link href="/auth/driver/login" className="text-sm text-primary hover:underline block">
                Back to Driver Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
