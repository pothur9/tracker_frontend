"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Phone,
  TrendingUp,
  Award,
  Target,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Navbar } from "./site/navbar";

const performanceData = [
  { period: "1Y", apex: -4.12, benchmark: 2.08 },
  { period: "2Y", apex: 18.01, benchmark: 16.63 },
  { period: "3Y", apex: 0, benchmark: 0 },
  { period: "5Y", apex: 0, benchmark: 0 },
  { period: "SI", apex: 21.08, benchmark: 19.56 },
];

const monthlyReturns = [
  { month: "Jan", return: 2.5 },
  { month: "Feb", return: -1.2 },
  { month: "Mar", return: 4.8 },
  { month: "Apr", return: 3.2 },
  { month: "May", return: -0.8 },
  { month: "Jun", return: 5.1 },
];

const portfolioAllocation = [
  { name: "Large Cap", value: 45, color: "#1e40af" },
  { name: "Mid Cap", value: 30, color: "#3b82f6" },
  { name: "Small Cap", value: 20, color: "#60a5fa" },
  { name: "Cash", value: 5, color: "#fbbf24" },
];

const keyHighlights = [
  {
    icon: Award,
    title: "Top Performer",
    description: "Ranked #1 in category for 2023",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Advanced downside protection strategies",
  },
  {
    icon: Target,
    title: "Focused Approach",
    description: "Concentrated portfolio of 25-30 stocks",
  },
  {
    icon: TrendingUp,
    title: "Consistent Alpha",
    description: "Outperformed benchmark 80% of the time",
  },
];

export function FundDetailPage() {
  return (
    <>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white">JM</div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white lg:text-4xl">
                      JM Financial Limited
                    </h1>
                    <p className="text-xl text-blue-100">Apex Portfolio</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                    PMS - Multi Cap & Flexi Cap
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Featured Strategy
                  </Badge>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                    <Phone className="mr-2 h-4 w-4" />
                    Schedule a Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      21.08%
                    </div>
                    <div className="text-sm text-blue-100">Since Inception</div>
                    <div className="text-xs text-blue-200 mt-1">
                      vs 19.56% benchmark
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400">
                      ₹50L
                    </div>
                    <div className="text-sm text-blue-100">Min Investment</div>
                    <div className="text-xs text-blue-200 mt-1">
                      Feb 2023 inception
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keyHighlights.map((highlight, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-gray-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
                    <highlight.icon className="h-6 w-6 text-yellow-700" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Performance Analysis - Spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-900">
                      Performance Analysis
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-600"
                    >
                      As of Jul 31, 2025
                    </Badge>
                  </div>

                  <div className="h-80 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="period" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Bar
                          dataKey="apex"
                          fill="#1e40af"
                          name="Apex"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="benchmark"
                          fill="#fbbf24"
                          name="Benchmark"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="h-4 w-4 rounded bg-blue-600"></div>
                      <span className="font-medium text-blue-900">
                        Apex Portfolio
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <div className="h-4 w-4 rounded bg-yellow-500"></div>
                      <span className="font-medium text-blue-900">
                        S&P BSE 500 TRI
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Monthly Returns Trend
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Line
                          type="monotone"
                          dataKey="return"
                          stroke="#1e40af"
                          strokeWidth={3}
                          dot={{ fill: "#1e40af", r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">
                    Fund Manager
                  </h3>
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto h-24 w-24">
                      <img
                        src="/professional-businessman-suit.png"
                        alt="Mr. Ashish Chaturmohta"
                        className="h-full w-full rounded-full object-cover ring-4 ring-yellow-100"
                      />
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-blue-900">
                        Mr. Ashish Chaturmohta
                      </h4>
                      <p className="text-sm text-gray-600">
                        Managing Director - PMS
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span>India's Best Market Analyst 2011</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>15+ Years Experience</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-900 hover:bg-blue-50 bg-transparent"
                    >
                      View Full Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Portfolio Allocation
                  </h3>
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {portfolioAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {portfolioAllocation.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-blue-900">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Sharpe Ratio
                      </span>
                      <span className="font-bold text-blue-900">1.24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Max Drawdown
                      </span>
                      <span className="font-bold text-red-600">-8.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Beta</span>
                      <span className="font-bold text-blue-900">0.89</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Alpha</span>
                      <span className="font-bold text-green-600">2.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
