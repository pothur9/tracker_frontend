import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function FlightFilters({ filters, setFilters, flights }) {
  // Ensure flights is an array before filtering
  const airlines = Array.isArray(flights)
    ? Array.from(new Set(flights.map((f) => f.airline)))
    : [];

  return (
    <Card className="w-80 flex-shrink-0 p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <Button variant="link" className="text-red-600 p-0 h-auto text-sm">
            CLEAR ALL
          </Button>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="font-bold mb-4 block">Price Range</Label>
          <Slider
            value={filters.priceRange}
            min={0}
            max={20000}
            step={100}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
            className="my-4"
          />
          <div className="flex justify-between text-sm">
            <span>₹ {filters.priceRange[0]}</span>
            <span>₹ {filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Stops Filter */}
        <div>
          <Label className="font-bold mb-4 block">Stops</Label>
          {["non-stop", "1-stop"].map((stop) => (
            <div key={stop} className="flex items-center justify-between mb-3">
              <Label className="flex items-center">
                <Checkbox
                  checked={filters.stops.includes(stop)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        stops: [...prev.stops, stop],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        stops: prev.stops.filter((s) => s !== stop),
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {stop === "non-stop" ? "Non Stop" : "1 Stop"}
              </Label>
              <span className="text-sm text-gray-600">
                from ₹{" "}
                {Array.isArray(flights)
                  ? Math.min(
                      ...flights
                        .filter((f) => f.type.toLowerCase() === stop)
                        .map((f) => f.price)
                    )
                  : 0}
              </span>
            </div>
          ))}
        </div>

        {/* Departure Time Filter */}
        <div>
          <Label className="font-bold mb-4 block">Departure Time</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🌅", label: "Before 6 AM" },
              { icon: "☀️", label: "6 AM - 12 PM" },
              { icon: "🌤️", label: "12 PM - 6 PM" },
              { icon: "🌙", label: "After 6 PM" },
            ].map((time) => (
              <Button
                key={time.label}
                variant="outline"
                className={cn(
                  "flex flex-col items-center justify-center p-2 h-16",
                  filters.departureTime.includes(time.label) &&
                    "border-red-600 bg-red-50"
                )}
                onClick={() => {
                  if (filters.departureTime.includes(time.label)) {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: prev.departureTime.filter(
                        (t) => t !== time.label
                      ),
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: [...prev.departureTime, time.label],
                    }));
                  }
                }}
              >
                <span className="text-xl mb-1">{time.icon}</span>
                <span className="text-[10px] text-center">{time.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Airlines Filter */}
        <div>
          <Label className="font-bold mb-4 block">Airlines</Label>
          {[
            "IndiGo",
            "Air India",
            "SpiceJet",
            "Vistara",
            "GoAir",
            "AirAsia India",
          ].map((airline) => (
            <div
              key={airline}
              className="flex items-center justify-between mb-3"
            >
              <Label className="flex items-center">
                <Checkbox
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        airlines: [...prev.airlines, airline],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        airlines: prev.airlines.filter((a) => a !== airline),
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {airline}
              </Label>
              <span className="text-sm text-gray-600">
                from ₹ {Math.floor(Math.random() * 3000 + 3000)}{" "}
                {/* Dummy price for demonstration */}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function FlightFilters({ filters, setFilters, flights }) {
  // Ensure flights is an array before filtering
  const airlines = Array.isArray(flights)
    ? Array.from(new Set(flights.map((f) => f.airline)))
    : [];

  return (
    <Card className="w-80 flex-shrink-0 p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <Button variant="link" className="text-red-600 p-0 h-auto text-sm">
            CLEAR ALL
          </Button>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="font-bold mb-4 block">Price Range</Label>
          <Slider
            value={filters.priceRange}
            min={0}
            max={20000}
            step={100}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
            className="my-4"
          />
          <div className="flex justify-between text-sm">
            <span>₹ {filters.priceRange[0]}</span>
            <span>₹ {filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Stops Filter */}
        <div>
          <Label className="font-bold mb-4 block">Stops</Label>
          {["non-stop", "1-stop"].map((stop) => (
            <div key={stop} className="flex items-center justify-between mb-3">
              <Label className="flex items-center">
                <Checkbox
                  checked={filters.stops.includes(stop)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        stops: [...prev.stops, stop],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        stops: prev.stops.filter((s) => s !== stop),
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {stop === "non-stop" ? "Non Stop" : "1 Stop"}
              </Label>
              <span className="text-sm text-gray-600">
                from ₹{" "}
                {Array.isArray(flights)
                  ? Math.min(
                      ...flights
                        .filter((f) => f.type.toLowerCase() === stop)
                        .map((f) => f.price)
                    )
                  : 0}
              </span>
            </div>
          ))}
        </div>

        {/* Departure Time Filter */}
        <div>
          <Label className="font-bold mb-4 block">Departure Time</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🌅", label: "Before 6 AM" },
              { icon: "☀️", label: "6 AM - 12 PM" },
              { icon: "🌤️", label: "12 PM - 6 PM" },
              { icon: "🌙", label: "After 6 PM" },
            ].map((time) => (
              <Button
                key={time.label}
                variant="outline"
                className={cn(
                  "flex flex-col items-center justify-center p-2 h-16",
                  filters.departureTime.includes(time.label) &&
                    "border-red-600 bg-red-50"
                )}
                onClick={() => {
                  if (filters.departureTime.includes(time.label)) {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: prev.departureTime.filter(
                        (t) => t !== time.label
                      ),
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      departureTime: [...prev.departureTime, time.label],
                    }));
                  }
                }}
              >
                <span className="text-xl mb-1">{time.icon}</span>
                <span className="text-[10px] text-center">{time.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Airlines Filter */}
        <div>
          <Label className="font-bold mb-4 block">Airlines</Label>
          {[
            "IndiGo",
            "Air India",
            "SpiceJet",
            "Vistara",
            "GoAir",
            "AirAsia India",
          ].map((airline) => (
            <div
              key={airline}
              className="flex items-center justify-between mb-3"
            >
              <Label className="flex items-center">
                <Checkbox
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        airlines: [...prev.airlines, airline],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        airlines: prev.airlines.filter((a) => a !== airline),
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {airline}
              </Label>
              <span className="text-sm text-gray-600">
                from ₹ {Math.floor(Math.random() * 3000 + 3000)}{" "}
                {/* Dummy price for demonstration */}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
