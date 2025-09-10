"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Navbar } from "./site/navbar";

const fundData = [
  {
    id: 1,
    name: "Alpha Growth PMS",
    manager: "Rajesh Kumar",
    aum: "₹850 Cr",
    category: "Large Cap Growth",
    riskLevel: "Moderate",
    minInvestment: "₹50 Lakh",
    performance: {
      "1Y": 18.5,
      "3Y": 16.2,
      "5Y": 14.8,
    },
    logo: "/jm-financial-logo.jpg",
    badges: ["Featured", "Top Performer"],
    amcName: "JM Financial",
    amcLogo: "/jm-financial-logo.jpg",
  },
  {
    id: 2,
    name: "ValueMax AIF Category II",
    manager: "Priya Sharma",
    aum: "₹420 Cr",
    category: "Value Investing",
    riskLevel: "High",
    minInvestment: "₹1 Cr",
    performance: {
      "1Y": 22.1,
      "3Y": 19.8,
      "5Y": 17.5,
    },
    logo: "/pricebridge-logo.jpg",
    badges: ["High Growth", "Premium"],
    amcName: "PriceBridge",
    amcLogo: "/pricebridge-logo.jpg",
  },
  {
    id: 3,
    name: "TechFocus PMS",
    manager: "Amit Patel",
    aum: "₹680 Cr",
    category: "Technology",
    riskLevel: "High",
    minInvestment: "₹25 Lakh",
    performance: {
      "1Y": 25.3,
      "3Y": 21.7,
      "5Y": 19.2,
    },
    logo: "/incred-asset-management-logo.jpg",
    badges: ["Trending", "Tech Focus"],
    amcName: "InCred Asset Management",
    amcLogo: "/incred-asset-management-logo.jpg",
  },
  {
    id: 4,
    name: "Healthcare Focus AIF",
    manager: "Dr. Meera Singh",
    aum: "₹320 Cr",
    category: "Healthcare",
    riskLevel: "Moderate",
    minInvestment: "₹75 Lakh",
    performance: {
      "1Y": 20.8,
      "3Y": 18.4,
      "5Y": 16.1,
    },
    logo: "/incred-healthcare-logo.jpg",
    badges: ["Healthcare", "Stable Growth"],
    amcName: "InCred Healthcare",
    amcLogo: "/incred-healthcare-logo.jpg",
  },
  {
    id: 5,
    name: "Infrastructure Growth PMS",
    manager: "Vikram Gupta",
    aum: "₹590 Cr",
    category: "Infrastructure",
    riskLevel: "High",
    minInvestment: "₹40 Lakh",
    performance: {
      "1Y": 24.2,
      "3Y": 20.5,
      "5Y": 18.7,
    },
    logo: "/jm-financial-logo.jpg",
    badges: ["Infrastructure", "Growth"],
    amcName: "JM Financial",
    amcLogo: "/jm-financial-logo.jpg",
  },
  {
    id: 6,
    name: "Balanced Advantage Fund",
    manager: "Anita Desai",
    aum: "₹750 Cr",
    category: "Balanced",
    riskLevel: "Low",
    minInvestment: "₹30 Lakh",
    performance: {
      "1Y": 15.6,
      "3Y": 14.2,
      "5Y": 13.8,
    },
    logo: "/pricebridge-logo.jpg",
    badges: ["Balanced", "Conservative"],
    amcName: "PriceBridge",
    amcLogo: "/pricebridge-logo.jpg",
  },
];

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("PMS");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("1-year-return");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStrategy, setSelectedStrategy] = useState("all");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCardExpansion = (fundId: number) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(fundId)) {
      newExpandedCards.delete(fundId);
    } else {
      newExpandedCards.add(fundId);
    }
    setExpandedCards(newExpandedCards);
  };

  return (
    <>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4 px-4 text-balance">
                Featured Investment Strategies
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4 text-pretty">
                Handpicked PMS and AIF strategies from India's top fund
                managers, delivering consistent alpha for our clients.
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                <div className="flex flex-col gap-4">
                  {/* Search Bar */}
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <Input
                      placeholder="Search funds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:flex-1">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-w-0 lg:w-auto">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem
                            value="1-year-return"
                            className="hover:bg-blue-50"
                          >
                            1 Year Return
                          </SelectItem>
                          <SelectItem
                            value="3-year-return"
                            className="hover:bg-blue-50"
                          >
                            3 Year Return
                          </SelectItem>
                          <SelectItem
                            value="5-year-return"
                            className="hover:bg-blue-50"
                          >
                            5 Year Return
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-w-0 lg:w-auto">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="all" className="hover:bg-blue-50">
                            All Categories
                          </SelectItem>
                          <SelectItem
                            value="large-cap"
                            className="hover:bg-blue-50"
                          >
                            Large Cap Growth
                          </SelectItem>
                          <SelectItem
                            value="value"
                            className="hover:bg-blue-50"
                          >
                            Value Investing
                          </SelectItem>
                          <SelectItem
                            value="technology"
                            className="hover:bg-blue-50"
                          >
                            Technology
                          </SelectItem>
                          <SelectItem
                            value="healthcare"
                            className="hover:bg-blue-50"
                          >
                            Healthcare
                          </SelectItem>
                          <SelectItem
                            value="infrastructure"
                            className="hover:bg-blue-50"
                          >
                            Infrastructure
                          </SelectItem>
                          <SelectItem
                            value="balanced"
                            className="hover:bg-blue-50"
                          >
                            Balanced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Strategy Badges */}
                    <div className="flex flex-wrap gap-2 lg:gap-3">
                      <Badge className="cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs px-3 py-1">
                        All
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-gray-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300 text-xs px-3 py-1 bg-white"
                      >
                        Equity
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-gray-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300 text-xs px-3 py-1 bg-white"
                      >
                        Debt
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-gray-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300 text-xs px-3 py-1 bg-white"
                      >
                        Hybrid
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      className="text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50 border border-gray-200 bg-white lg:flex-shrink-0"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {fundData.map((fund) => {
              const isExpanded = expandedCards.has(fund.id);

              return (
                <Card
                  key={fund.id}
                  className="bg-card border border-gray-200 hover:shadow-xl hover:border-blue-300 hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-4 sm:p-6">
                    {/* AMC Header */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 p-2 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={fund.amcLogo || "/placeholder.svg"}
                            alt={fund.amcName}
                            width={28}
                            height={28}
                            className="sm:w-8 sm:h-8 rounded object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            AMC
                          </p>
                          <p className="text-sm font-semibold text-blue-900 truncate">
                            {fund.amcName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          AUM
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {fund.aum}
                        </p>
                      </div>
                    </div>
                    {/* Badges
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                      {fund.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          className={`text-xs font-medium shadow px-2 py-1 ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div> */}
                    {/* Fund Name and Manager */}
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-1 leading-tight break-words">
                        {fund.name}
                      </h3>
                      <p className="text-gray-600 text-sm break-words">
                        by {fund.manager}
                      </p>
                    </div>
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                      {Object.entries(fund.performance).map(
                        ([period, value]) => (
                          <div
                            key={period}
                            className="text-center bg-green-50 rounded-lg p-2 border border-green-100"
                          >
                            <div className="text-lg sm:text-xl font-bold text-green-600 mb-1">
                              {value}%
                            </div>
                            <div className="text-xs text-gray-600 font-medium">
                              {period}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="space-y-3 mb-4 border-t border-gray-200 pt-4 bg-blue-50/30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">
                            Category:
                          </span>
                          <span className="text-sm font-semibold text-blue-900 text-right break-words max-w-[60%]">
                            {fund.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">
                            Risk Level:
                          </span>
                          <span
                            className={`text-sm font-semibold px-2 py-1 rounded-full text-xs ${
                              fund.riskLevel === "High"
                                ? "text-red-700 bg-red-100"
                                : fund.riskLevel === "Moderate"
                                ? "text-yellow-700 bg-yellow-100"
                                : "text-green-700 bg-green-100"
                            }`}
                          >
                            {fund.riskLevel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">
                            Min Investment:
                          </span>
                          <span className="text-sm font-semibold text-blue-900">
                            {fund.minInvestment}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCardExpansion(fund.id)}
                        className="flex items-center gap-1 border-gray-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300 bg-white font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            More
                          </>
                        )}
                      </Button>
                      <Button className="flex-1 bg-blue-900 text-white hover:bg-blue-800 font-semibold text-sm py-2 shadow-sm hover:shadow-md transition-all duration-200">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
