"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hotel, 
  Plane, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import { useRouter } from "next/navigation";

// Move static data to separate constants file or keep them organized at the top
const CHART_DATA = {
  revenue: [
    { name: "Jan", bookings: 400, revenue: 2400 },
    { name: "Feb", bookings: 300, revenue: 1398 },
    { name: "Mar", bookings: 520, revenue: 3908 },
    { name: "Apr", bookings: 270, revenue: 4800 },
    { name: "May", bookings: 600, revenue: 3800 },
    { name: "Jun", bookings: 700, revenue: 4300 },
  ],
  bookingTypes: [
    { name: "Hotels", value: 55 },
    { name: "Flights", value: 45 },
  ],
  monthlyBookings: [
    { month: "Jan", hotels: 240, flights: 160 },
    { month: "Feb", hotels: 180, flights: 120 },
    { month: "Mar", hotels: 320, flights: 200 },
    { month: "Apr", hotels: 150, flights: 120 },
    { month: "May", hotels: 350, flights: 250 },
    { month: "Jun", hotels: 400, flights: 300 },
    { month: "Jan", hotels: 240, flights: 160 },
    { month: "Aug", hotels: 180, flights: 120 },
    { month: "Sep", hotels: 320, flights: 200 },
    { month: "Oct", hotels: 150, flights: 120 },
    { month: "Nov", hotels: 350, flights: 250 },
    { month: "Dec", hotels: 400, flights: 300 },
  ]
};

const COLORS = ["#ef4444", "#64748b"]; 

interface FlightBooking {
  _id: string;
  type: string;
  status: string;
  flightDetails: any;
  createdAt: string;
}

interface DashboardData {
  totalBookings: number;
  flightBookings: number;
  totalUsers: number;
  totalRevenue: number;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

async function getFlightBookings() {
  const response = await fetch('/api/flightBooking');
  if (!response.ok) throw new Error('Failed to fetch flight bookings');
  return response.json();
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBookings: 0,
    flightBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  
  const currentMonth = new Date().getMonth() + 1; // Get current month (0-11) and add 1
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString().padStart(2, '0')); // Format to "MM"

  const fetchDashboardData = useCallback(async () => {
    try {
      const [bookingsRes, flightRes, usersRes, revenueRes] = await Promise.all([
        axios.get(`/api/totalBookings?month=${selectedMonth}`),
        axios.get(`/api/flight?month=${selectedMonth}`),
        axios.get(`/api/totalUsers?month=${selectedMonth}`),
        axios.get(`/api/totalRevenue?month=${selectedMonth}`)
        
      ]);

      setDashboardData({
        totalBookings: bookingsRes.data.totalBookings,
        flightBookings: flightRes.data.totalFlightBookings,
        totalUsers: usersRes.data.totalUsers,
        totalRevenue: revenueRes.data.totalRevenue
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Modify DashboardCard to handle click events
  const DashboardCard = ({ title, value, icon: Icon, trend, onClick }: any) => (
    <Card 
      className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {title === "Revenue" ? `₹${value.toLocaleString()}` : value}
        </div>
        <p className={`text-xs ${trend.color} flex items-center`}>
          {trend.icon}
          {trend.text}
        </p>
      </CardContent>
    </Card>
  );

  const cards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: Hotel,
      trend: {
        icon: <TrendingUp className="h-4 w-4 mr-1" />,
        text: "+20.1% from last month",
        color: "text-green-500"
      },
      onClick: () => router.push('/totalBookings')
    },
    {
      title: "Flight Bookings",
      value: dashboardData.flightBookings,
      icon: Plane,
      trend: {
        icon: <TrendingDown className="h-4 w-4 mr-1" />,
        text: "-4.5% from last month",
        color: "text-red-500"
      },
      onClick: () => router.push('/flightBooking')
    },
    {
      title: "Total Customers",
      value: dashboardData.totalUsers,
      icon: Users,
      trend: {
        icon: <TrendingUp className="h-4 w-4 mr-1" />,
        text: "+10.3% from last month",
        color: "text-green-500"
      }
    },
    {
      title: "Revenue",
      value: dashboardData.totalRevenue,
      icon: DollarSign,
      trend: {
        icon: <TrendingUp className="h-4 w-4 mr-1" />,
        text: "+15.2% from last month",
        color: "text-green-500"
      }
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="month" className="mr-2">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-1"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Bookings Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hotels" fill="#ef4444" name="Hotels" />
                  <Bar dataKey="flights" fill="#64748b" name="Flights" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Booking Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={CHART_DATA.bookingTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {CHART_DATA.bookingTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue & Bookings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  name="Bookings"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#64748b" 
                  strokeWidth={2} 
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}