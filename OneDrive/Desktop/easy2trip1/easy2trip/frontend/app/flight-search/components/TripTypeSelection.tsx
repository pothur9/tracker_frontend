import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function TripTypeSelection({
  selectedTripType,
  setSelectedTripType,
}) {
  return (
    <>
      {/* Trip Type Selection */}

      <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-2">
        <RadioGroup
          value={selectedTripType}
          onValueChange={setSelectedTripType}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-1 md:gap-2">
            <RadioGroupItem
              value="one-way"
              id="one-way"
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
            />
            <Label htmlFor="one-way" className="text-sm md:text-sm font-medium">
              One Way
            </Label>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <RadioGroupItem
              value="round-trip"
              id="round-trip"
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
            />
            <Label
              htmlFor="round-trip"
              className="text-sm md:text-sm font-medium"
            >
              Round Trip
            </Label>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <RadioGroupItem
              value="multi-city"
              id="multi-city"
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
            />
            <Label
              htmlFor="multi-city"
              className="text-sm md:text-sm font-medium"
            >
              Multi City
            </Label>
          </div>
        </RadioGroup>
        <span className="text-xs md:text-sm text-gray-500 self-end">
          Book International and Domestic Flights
        </span>
      </div>
    </>
  );
}
