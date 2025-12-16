"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Phone, MapPin, Clock } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

interface Student {
  id: string
  name: string
  class: string
  section: string
  phone: string
  fatherName: string
  isTracking: boolean
  lastSeen?: Date
}

export default function DriverStudentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      class: "10",
      section: "A",
      phone: "+1234567890",
      fatherName: "Robert Doe",
      isTracking: true,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: "2",
      name: "Jane Smith",
      class: "9",
      section: "B",
      phone: "+1234567891",
      fatherName: "Michael Smith",
      isTracking: true,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: "3",
      name: "Alice Johnson",
      class: "11",
      section: "A",
      phone: "+1234567892",
      fatherName: "David Johnson",
      isTracking: false,
    },
    {
      id: "4",
      name: "Bob Wilson",
      class: "10",
      section: "C",
      phone: "+1234567893",
      fatherName: "James Wilson",
      isTracking: true,
      lastSeen: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    },
  ])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/driver/login")
      return
    }
    if (user.type !== "driver") {
      router.push("/")
      return
    }
  }, [user, router])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.includes(searchQuery) ||
      student.section.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeStudents = students.filter((s) => s.isTracking).length
  const totalStudents = students.length

  const formatLastSeen = (date?: Date) => {
    if (!date) return "Never"

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex flex-col">
      {/* Navbar */}
      <Navbar showBackButton backUrl="/dashboard/driver" />

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{activeStudents}</p>
              <p className="text-xs text-muted-foreground">Tracking</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold">{totalStudents - activeStudents}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{student.name}</h3>
                        <Badge variant={student.isTracking ? "default" : "secondary"} className="text-xs">
                          {student.isTracking ? "Active" : "Offline"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Class {student.class}-{student.section} • {student.fatherName}
                      </p>
                      {student.isTracking && (
                        <p className="text-xs text-muted-foreground">Last seen: {formatLastSeen(student.lastSeen)}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Students Found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" userType="driver" />
    </div>
  )
}
