'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { NavigationMenu } from "../components/navigation-menu";
import VisaFormContainer from './VisaFormContainer';

const countries = [
  { name: "Argentina", code: "AR", flag: "🇦🇷", visa_fees: 0, charges: 0 },
  { name: "Australia", code: "AU", flag: "🇦🇺", visa_fees: 11200, charges: 800 },
  { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", visa_fees: 2346, charges: 200 },
  { name: "Bahrain", code: "BH", flag: "🇧🇭", visa_fees: "6750 - 1 month, 4750 - 14 days, 12400 - 1 year multiple", charges: 200 },
  { name: "Brazil", code: "BR", flag: "🇧🇷", visa_fees: 0, charges: 0 },
  { name: "Cambodia", code: "KH", flag: "🇰🇭", visa_fees: 2710, charges: 140 },
  { name: "Canada", code: "CA", flag: "🇨🇦", visa_fees: 11800, charges: 800 },
  { name: "China", code: "CN", flag: "🇨🇳", visa_fees: 4806, charges: 700 },
  { name: "Dubai (UAE)", code: "AE", flag: "🇦🇪", visa_fees: 6600, charges: 200 },
  { name: "Egypt", code: "EG", flag: "🇪🇬", visa_fees: 2200, charges: 150 },
  { name: "Europe", code: "EU", flag: "🇪🇺", visa_fees: 8225 , charges: 600 },
  { name: "France", code: "FR", flag: "🇫🇷", visa_fees: 0, charges: 0 },
  { name: "Georgia", code: "GE", flag: "🇬🇪", visa_fees: 4200, charges: 200 },
  { name: "Germany", code: "DE", flag: "🇩🇪", visa_fees: 0, charges: 0 },
  { name: "Hong Kong", code: "HK", flag: "🇭🇰", visa_fees: "Nil", charges: 200 },
  { name: "India", code: "IN", flag: "🇮🇳", visa_fees: 0, charges: 0 },
  { name: "Indonesia", code: "ID", flag: "🇮🇩", visa_fees: 2960, charges: 200 },
  { name: "Italy", code: "IT", flag: "🇮🇹", visa_fees: 0, charges: 0 },
  { name: "Japan", code: "JP", flag: "🇯🇵", visa_fees: 1300, charges: 700 },
  { name: "Jordan", code: "JO", flag: "🇯🇴", visa_fees: 0, charges: 0 },
  { name: "Kenya", code: "KE", flag: "🇰🇪", visa_fees: 2700, charges: 250 },
  { name: "Kuwait", code: "KW", flag: "🇰🇼", visa_fees: 0, charges: 0 },
  { name: "Malaysia", code: "MY", flag: "🇲🇾", visa_fees: 0, charges: 0 },
  { name: "Maldives", code: "MV", flag: "🇲🇻", visa_fees: 0, charges: 0 },
  { name: "Mexico", code: "MX", flag: "🇲🇽", visa_fees: 0, charges: 0 },
  { name: "Morocco", code: "MA", flag: "🇲🇦", visa_fees: 0, charges: 0 },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿", visa_fees: 24200, charges: 800 },
  { name: "Oman", code: "OM", flag: "🇴🇲", visa_fees: "2500 - 10 days, 5650 - 30 days", charges: 0 },
  { name: "Philippines", code: "PH", flag: "🇵🇭", visa_fees: 0, charges: 0 },
  { name: "Qatar", code: "QA", flag: "🇶🇦", visa_fees: "1200 - 30 days w/o ins, 2400 - 30 days w/ ins, 2500 - 10 days, 5650 - 30 days", charges: 0 },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", visa_fees: 0, charges: 0 },
  { name: "Singapore", code: "SG", flag: "🇸🇬", visa_fees: 2500, charges: 200 },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", visa_fees: 2040, charges: 700 },
  { name: "South Korea", code: "KR", flag: "🇰🇷", visa_fees: 5130, charges: 700 },
  { name: "Spain", code: "ES", flag: "🇪🇸", visa_fees: 0, charges: 0 },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", visa_fees: "Nil", charges: 200 },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", visa_fees: 0, charges: 0 },
  { name: "Thailand", code: "TH", flag: "🇹🇭", visa_fees: 6350, charges: 200 },
  { name: "Turkey", code: "TR", flag: "🇹🇷", visa_fees: 0, charges: 0 },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", visa_fees: 16085, charges: 700 },
  { name: "United States", code: "US", flag: "🇺🇸", visa_fees: 15540, charges: 800 },
  { name: "Vietnam", code: "VN", flag: "🇻🇳", visa_fees: 238, charges: 200 }
].sort((a, b) => a.name.localeCompare(b.name));

export default function VisaPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center py-10 px-4 bg-white bg-hero justify-center  relative p-4">
        <div className="w-full max-w-6xl space-y-6">
        <NavigationMenu />
          {/* Country Selection */}
          <Card className="p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Select Country for E-Visa</h2>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem 
                    key={country.code} 
                    value={country.code}
                    className="flex items-center gap-2 py-2"
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Visa Form */}
          {selectedCountry ? (
            <Card className="p-6 shadow-lg rounded-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {countries.find(c => c.code === selectedCountry)?.flag}{' '}
                Visa Application for {countries.find(c => c.code === selectedCountry)?.name}
              </h2>
              {(() => {
                const selectedCountryData = countries.find(c => c.code === selectedCountry);
                return (
                  <VisaFormContainer 
                    country={selectedCountryData?.name || ''} 
                    visa_fees={selectedCountryData?.visa_fees || 0} 
                    charges={selectedCountryData?.charges || 0} 
                  />
                );
              })()}
            </Card>
          ) : (
            <Card className="p-8 text-center shadow-lg rounded-lg bg-white">
              <div className="text-5xl mb-4">✈️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to E-Visa Application Portal
              </h2>
              <p className="text-gray-600 text-lg">
                Please select a country to begin your visa application process.
              </p>
            </Card>
          )}

        </div>
      </main>

      
      
      <Footer />
    </div>
  );
}
