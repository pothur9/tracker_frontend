"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"; // Assuming you have these components already set up

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PassengerDetail {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
}

interface ChildDetail {
  firstName: string;
  lastName: string;
  sex: string;
}

interface InfantDetail {
  firstName: string;
  lastName: string;
  sex: string;
  dob: { day: string; month: string; year: string };
}

interface PassengerDetailsProps {
  maxPassengers: number;
  formData: {
    children: ChildDetail[];
    adults: PassengerDetail[];
    infants: InfantDetail[];
    state: string;
    saveTraveller: boolean;
    gstNumber: string;
  };
  onFormChange: (field: string, value: any) => void;
  pessangerData: {
    adults: number;
    children: number;
    infants: number;
  };
  maxChildren: number;
  maxInfants:number;
}

export function PassengerDetails({
  maxPassengers,
  formData,
  onFormChange,
  pessangerData,
  maxChildren,
  maxInfants
}: PassengerDetailsProps) {
  const handlePassengerChange = (
    index: number,
    field: keyof PassengerDetail,
    value: string
  ) => {
    const updatedPassengers = [...formData.adults];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    onFormChange("adults", updatedPassengers);
  };

  const handleChildChange = (
    index: number,
    field: keyof ChildDetail,
    value: string
  ) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    onFormChange("children", updatedChildren);
  };

  const handleInfantChange = (
    index: number,
    field: keyof InfantDetail,
    value: string
  ) => {
    const updatedInfants = [...formData.infants];
    updatedInfants[index] = {
      ...updatedInfants[index],
      [field]: value,
    };
    onFormChange("infants", updatedInfants);
  };

  const addPassenger = () => {
    if (formData.adults.length >= maxPassengers) return;

    const newPassenger: PassengerDetail = {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      mobile: "",
    };

    onFormChange("adults", [...formData.adults, newPassenger]);
  };

  const removePassenger = (index: number) => {
    const updatedPassengers = formData.adults.filter((_, i) => i !== index);
    onFormChange("adults", updatedPassengers);
  };

  const addChild = () => {
    if (formData.children.length >= maxChildren) return;

    const newChild: ChildDetail = {
      firstName: "",
      lastName: "",
      sex: "", // Default value for sex (can be "Male" or "Female")
    };

    onFormChange("children", [...formData.children, newChild]);
  };

  const removeChild = (index: number) => {
    const updatedChildren = formData.children.filter((_, i) => i !== index);
    onFormChange("children", updatedChildren);
  };

  const addInfant = () => {
    if (formData.infants.length >= maxInfants) return;

    const newInfant: InfantDetail = {
      firstName: "",
      lastName: "",
      sex: "",
      dob: { day: "1", month: "Jan", year: "2025" }, // Default values
    };

    onFormChange("infants", [...formData.infants, newInfant]);
  };

  const removeInfant = (index: number) => {
    const updatedInfants = formData.infants.filter((_, i) => i !== index);
    onFormChange("infants", updatedInfants);
  };

  // Generate year options for the dropdown (current year to two previous years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Generate month options (Jan, Feb, Mar, etc.)
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Generate day options (1 to 31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-6">
      {/* Adults Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">ADULT (12 yrs+)</h3>
            <p className="text-sm text-gray-500">
              {formData.adults.length}/{pessangerData.adults} added
            </p>
          </div>
          {formData.adults.length < pessangerData.adults && (
            <Button
              variant="ghost"
              className="text-blue-600"
              onClick={addPassenger}
            >
              + ADD NEW ADULT
            </Button>
          )}
        </div>

        {/* Accordion for Adult Passengers */}
        <Accordion type="multiple">
          {formData.adults.map((passenger, index) => (
            <AccordionItem key={index} value={`passenger-${index}`}>
              <AccordionTrigger className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Adult {index + 1}</h4>
                {index > 0 && (
                  <Button
                    variant="ghost"
                    className="text-red-600 text-sm"
                    onClick={() => removePassenger(index)}
                  >
                    Remove
                  </Button>
                )}
              </AccordionTrigger>
              <AccordionContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <Select
                      value={passenger.title}
                      onValueChange={(value) =>
                        handlePassengerChange(index, "title", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="First Name"
                      value={passenger.firstName}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "firstName",
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />

                    <Input
                      placeholder="Last Name"
                      value={passenger.lastName}
                      onChange={(e) =>
                        handlePassengerChange(index, "lastName", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Select
                      value={passenger.countryCode}
                      onValueChange={(value) =>
                        handlePassengerChange(index, "countryCode", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Mobile Number"
                      value={passenger.mobile}
                      onChange={(e) =>
                        handlePassengerChange(index, "mobile", e.target.value)
                      }
                      className="flex-1"
                      type="tel"
                    />

                    <Input
                      placeholder="Email"
                      value={passenger.email}
                      onChange={(e) =>
                        handlePassengerChange(index, "email", e.target.value)
                      }
                      className="flex-1"
                      type="email"
                    />
                  </div>
                </div>
              </AccordionContent>
              
            </AccordionItem>
          ))}
            <div className="flex items-center gap-2">
          <Checkbox
            id="saveTraveller"
            checked={formData.saveTraveller}
            onCheckedChange={(checked) => 
              onFormChange("saveTraveller", checked === true)
            }
          />
          <Label htmlFor="saveTraveller" className="text-sm text-gray-600">
            Add these travellers to My Traveller List. You won't have to fill traveller info on your next visit.
          </Label>
        </div>
        </Accordion>
      </Card>

      {/* Children Section */}
      {pessangerData.children !== 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">CHILD (2-12 Yrs)</h3>
              <p className="text-sm text-gray-500">
                {formData.children.length}/{pessangerData.children} added
              </p>
            </div>
            {formData.children.length < pessangerData.children && (
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={addChild}
              >
                + ADD NEW CHILD
              </Button>
            )}
          </div>

          {/* Accordion for Children Passengers */}
          <Accordion type="multiple">
            {formData.children.map((child, index) => (
              <AccordionItem key={index} value={`child-${index}`}>
                <AccordionTrigger className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Child {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      className="text-red-600 text-sm"
                      onClick={() => removeChild(index)}
                    >
                      Remove
                    </Button>
                  )}
                </AccordionTrigger>
                <AccordionContent className="p-6">
                  <div className="grid gap-6">
                    <div className="flex gap-4">
                      <Input
                        placeholder="First Name"
                        value={child.firstName}
                        onChange={(e) =>
                          handleChildChange(index, "firstName", e.target.value)
                        }
                        className="flex-1"
                      />

                      <Input
                        placeholder="Last Name"
                        value={child.lastName}
                        onChange={(e) =>
                          handleChildChange(index, "lastName", e.target.value)
                        }
                        className="flex-1"
                      />

                      <Select
                        value={child.sex}
                        onValueChange={(value) =>
                          handleChildChange(index, "sex", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}

      {/* Infants Section */}
      {pessangerData.infants !== 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">INFANT (Below 2 Yrs)</h3>
              <p className="text-sm text-gray-500">
                {formData.infants.length}/{pessangerData.infants} added
              </p>
            </div>
            {formData.infants.length < pessangerData.infants && (
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={addInfant}
              >
                + ADD NEW INFANT
              </Button>
            )}
          </div>

          {/* Accordion for Infant Passengers */}
          <Accordion type="multiple">
            {formData.infants.map((infant, index) => (
              <AccordionItem key={index} value={`infant-${index}`}>
                <AccordionTrigger className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Infant {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      className="text-red-600 text-sm"
                      onClick={() => removeInfant(index)}
                    >
                      Remove
                    </Button>
                  )}
                </AccordionTrigger>
                <AccordionContent className="p-6">
                  <div className="grid gap-6">
                    <div className="flex gap-4">
                      <Input
                        placeholder="First Name"
                        value={infant.firstName}
                        onChange={(e) =>
                          handleInfantChange(index, "firstName", e.target.value)
                        }
                        className="flex-1"
                      />

                      <Input
                        placeholder="Last Name"
                        value={infant.lastName}
                        onChange={(e) =>
                          handleInfantChange(index, "lastName", e.target.value)
                        }
                        className="flex-1"
                      />

                      <Select
                        value={infant.sex}
                        onValueChange={(value) =>
                          handleInfantChange(index, "sex", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date of Birth for Infant */}
                    <div className="grid grid-cols-3 gap-4">
                      <Select
                        value={infant.dob.day}
                        onValueChange={(value) =>
                          handleInfantChange(index, "dob.day", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={infant.dob.month}
                        onValueChange={(value) =>
                          handleInfantChange(index, "dob.month", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={infant.dob.year}
                        onValueChange={(value) =>
                          handleInfantChange(index, "dob.year", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}
      {/* State Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your State</h3>
        <p className="text-sm text-gray-500 mb-4">
          Required for GST purpose on your tax invoice. You can edit this
          anytime later in your profile section.
        </p>
        <Select
          value={formData.state}
          onValueChange={(value) => onFormChange("state", value)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="maharashtra">Maharashtra</SelectItem>
            <SelectItem value="karnataka">Karnataka</SelectItem>
            {/* Add more states as needed */}
          </SelectContent>
        </Select>
      </Card>

      {/* GST Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="hasGST"
            checked={!!formData.gstNumber}
            onCheckedChange={(checked) =>
              onFormChange("gstNumber", checked ? "" : "")
            }
          />
          <Label htmlFor="hasGST">I have a GST number (Optional)</Label>
        </div>
        {formData.gstNumber !== "" && (
          <Input
            placeholder="Enter GST Number"
            value={formData.gstNumber}
            onChange={(e) => onFormChange("gstNumber", e.target.value)}
            className="max-w-md"
          />
        )}
      </Card>
    </div>
  );
}
