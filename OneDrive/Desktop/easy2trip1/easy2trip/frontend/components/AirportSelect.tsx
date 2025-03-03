import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { flightService } from "@/services/flightService";

interface Airport {
  _id: string;
  AIRPORTCODE: string;
  CITYNAME: string;
  AIRPORTNAME: string;
  COUNTRYNAME: string;
}

interface AirportSelectProps {
  label: string;
  value: string;
  isOrigin: boolean;
  onSelect: (airportCode: string) => void;
}

const AirportSelect: React.FC<AirportSelectProps> = ({
  label,
  value,
  isOrigin,
  onSelect,
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchAirports(value);
    }, 300),
    []
  );

  const searchAirports = async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      loadAllAirports();
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await flightService.searchAirports(keyword);
      setAirports(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search airports");
    } finally {
      setIsSearching(false);
    }
  };

  const loadAllAirports = async () => {
    try {
      const results = await flightService.getAllAirports();
      setAirports(results);
    } catch (error) {
      console.error("Error loading airports:", error);
      setSearchError("Failed to load airports");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
          <Label className="text-xs text-gray-500">{label}</Label>
          <div className="text-lg font-bold">
            {airports.find((a) => a.AIRPORTCODE === value)?.CITYNAME || value}
          </div>
          <div className="text-xs text-gray-500">
            {airports.find((a) => a.AIRPORTCODE === value)?.AIRPORTNAME}
            {airports.find((a) => a.AIRPORTCODE === value) && ` (${value})`}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search for cities or airports"
            className="w-full p-2 border rounded"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          {isSearching ? (
            <div className="text-center">Searching...</div>
          ) : searchError ? (
            <div className="text-red-500">{searchError}</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {airports.map((airport) => (
                <div
                  key={airport._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelect(airport.AIRPORTCODE);
                    const popoverTrigger = document.querySelector(
                      '[data-state="open"]'
                    ) as HTMLElement;
                    if (popoverTrigger) {
                      popoverTrigger.click();
                    }
                  }}
                >
                  <div className="font-medium">{airport.CITYNAME}</div>
                  <div className="text-sm text-gray-500">
                    {airport.AIRPORTNAME} ({airport.AIRPORTCODE})
                  </div>
                  <div className="text-xs text-gray-400">
                    {airport.COUNTRYNAME}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AirportSelect;
