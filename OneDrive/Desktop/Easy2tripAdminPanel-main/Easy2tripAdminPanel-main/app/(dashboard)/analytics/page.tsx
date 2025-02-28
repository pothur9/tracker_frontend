"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsPage = () => {
  // Updated to 25 dummy data for analytics
  const visitorTrafficData = Array.from({ length: 25 }, (_, i) => ({
    date: `Day ${i + 1}`,
    visitors: Math.floor(Math.random() * 1000) + 100,
    searches: Math.floor(Math.random() * 500) + 50,
  }));

  const conversionRateData = Array.from({ length: 25 }, (_, i) => ({
    step: `Step ${i + 1}`,
    visitors: Math.floor(Math.random() * 1000) + 200,
    conversions: Math.floor(Math.random() * 500),
  }));

  const abandonedCartData = Array.from({ length: 25 }, (_, i) => ({
    date: `Day ${i + 1}`,
    abandoned: Math.floor(Math.random() * 200) + 50,
  }));

  const bookingTrendsData = Array.from({ length: 25 }, (_, i) => ({
    month: `Month ${i + 1}`,
    flights: Math.floor(Math.random() * 300) + 50,
    hotels: Math.floor(Math.random() * 300) + 50,
  }));

  const revenueData = Array.from({ length: 25 }, (_, i) => ({
    date: `Day ${i + 1}`,
    revenue: Math.floor(Math.random() * 10000) + 500,
  }));

  const bookingSourceData = [
    { name: "Organic", value: 40 },
    { name: "Paid Ads", value: 30 },
    { name: "Referrals", value: 20 },
    { name: "Direct", value: 10 },
  ];

  const demographicsData = [
    { ageGroup: "18-25", percentage: 35 },
    { ageGroup: "26-35", percentage: 45 },
    { ageGroup: "36-45", percentage: 15 },
    { ageGroup: "46+", percentage: 5 },
  ];

  const topDestinationsData = Array.from({ length: 25 }, (_, i) => ({
    destination: `Destination ${i + 1}`,
    popularity: Math.floor(Math.random() * 100) + 1,
  }));

  const pricingTrendsData = Array.from({ length: 25 }, (_, i) => ({
    date: `Day ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 50,
  }));

  const supportTicketData = Array.from({ length: 25 }, (_, i) => ({
    issue: `Issue ${i + 1}`,
    volume: Math.floor(Math.random() * 100) + 10,
  }));

  const loyaltyData = Array.from({ length: 25 }, (_, i) => ({
    member: `Member ${i + 1}`,
    redemptions: Math.floor(Math.random() * 10),
  }));

  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-red-600">Analytics Overview</h1>

      {/* Visitor Traffic and User Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Traffic and User Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorTrafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#ef4444"
                name="Visitors"
              />
              <Line
                type="monotone"
                dataKey="searches"
                stroke="#3b82f6"
                name="Searches"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Rate Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#ef4444" name="Visitors" />
              <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Abandoned Cart Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Cart Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={abandonedCartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="abandoned"
                stroke="#f59e0b"
                name="Abandoned Carts"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="flights" fill="#ef4444" name="Flights" />
              <Bar dataKey="hotels" fill="#3b82f6" name="Hotels" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Source Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Source Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={bookingSourceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {bookingSourceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographicsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDestinationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="destination" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="popularity" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pricing Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pricingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="price" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Support Ticket Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Support Ticket Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supportTicketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="issue" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Loyalty Program Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loyaltyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="member" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="redemptions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
