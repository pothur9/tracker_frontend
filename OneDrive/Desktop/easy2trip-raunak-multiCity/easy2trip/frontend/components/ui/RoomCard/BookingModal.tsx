import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Room } from "@/types";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CreditCard, User2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  email?: string;
  phone?: string;
}

export function BookingModal({ isOpen, onClose, room }: BookingModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [guestDetails, setGuestDetails] = useState<GuestDetails[]>([
    {
      title: "",
      firstName: "",
      lastName: "",
      age: "",
      email: "",
      phone: "",
    },
    {
      title: "",
      firstName: "",
      lastName: "",
      age: "",
    },
  ]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newGuestDetails = [...guestDetails];
    newGuestDetails[index] = {
      ...newGuestDetails[index],
      [field]: value,
    };
    setGuestDetails(newGuestDetails);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hotelPassenger = guestDetails.map((guest, index) => ({
        Title: guest.title,
        FirstName: guest.firstName,
        MiddleName: "",
        LastName: guest.lastName,
        Email: index === 0 ? guest.email : null,
        PaxType: index === 0 ? 1 : 2,
        LeadPassenger: index === 0,
        Age: parseInt(guest.age),
        PassportNo: null,
        PassportIssueDate: null,
        PassportExpDate: null,
        Phoneno: index === 0 ? guest.phone : null,
        PaxId: 0,
        GSTCompanyAddress: null,
        GSTCompanyContactNumber: null,
        GSTCompanyName: null,
        GSTNumber: null,
        GSTCompanyEmail: null,
        PAN: null,
      }));

      const bookingDetails = {
        bookingCode: room.BookingCode,
        netAmount: Math.floor(room.TotalFare * 0.8),
        guestNationality: "IN",
        hotelPassenger,
      };

      const bookResponse = await fetch(
        "https://easy2trip.com/easy2trip/api/hotels/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingDetails),
        }
      );

      if (!bookResponse.ok) {
        throw new Error("Booking failed");
      }

      const bookingData = await bookResponse.json();

      // Send confirmation emails
      await fetch("/api/hotel-booking-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDetails,
          guestDetails,
          room,
        }),
      });

      router.push("/hotels/confirmation");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during booking"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return (
        guestDetails[0].title &&
        guestDetails[0].firstName &&
        guestDetails[0].lastName &&
        guestDetails[0].age &&
        guestDetails[0].email &&
        guestDetails[0].phone
      );
    }
    return (
      guestDetails[1].title &&
      guestDetails[1].firstName &&
      guestDetails[1].lastName &&
      guestDetails[1].age
    );
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Progress Bar */}
        <div className="bg-blue-600 h-1">
          <div
            className="h-full bg-blue-400 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-col">
                <span className="text-2xl">Complete Your Booking</span>
                <span className="text-sm font-normal text-gray-500 mt-1">
                  Fill in the details to secure your reservation
                </span>
              </div>
              <div className="px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                Step {currentStep} of {totalSteps}
              </div>
            </DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="py-6">
            {/* Booking Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Room Type</div>
                  <div className="font-medium">{room.Name[0]}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Amount</div>
                  <div className="font-medium text-green-600">
                    ₹{Math.floor(room.TotalFare * 0.8).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Check-in</div>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Today
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Duration</div>
                  <div className="font-medium">1 Night</div>
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <User2 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-lg">Lead Guest Details</h2>
                </div>

                <div className="bg-white rounded-xl p-6 space-y-6 border">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Title</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange(0, "title", value)
                        }
                        value={guestDetails[0].title}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">First Name</Label>
                      <Input
                        value={guestDetails[0].firstName}
                        onChange={(e) =>
                          handleInputChange(0, "firstName", e.target.value)
                        }
                        placeholder="First name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-600">Last Name</Label>
                      <Input
                        value={guestDetails[0].lastName}
                        onChange={(e) =>
                          handleInputChange(0, "lastName", e.target.value)
                        }
                        placeholder="Last name"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Email</Label>
                      <Input
                        type="email"
                        value={guestDetails[0].email}
                        onChange={(e) =>
                          handleInputChange(0, "email", e.target.value)
                        }
                        placeholder="Email address"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-600">Phone</Label>
                      <Input
                        type="tel"
                        value={guestDetails[0].phone}
                        onChange={(e) =>
                          handleInputChange(0, "phone", e.target.value)
                        }
                        placeholder="Phone number"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Age</Label>
                      <Input
                        type="number"
                        value={guestDetails[0].age}
                        onChange={(e) =>
                          handleInputChange(0, "age", e.target.value)
                        }
                        placeholder="Age"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <User2 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-lg">Guest 2 Details</h2>
                </div>

                <div className="bg-white rounded-xl p-6 space-y-6 border">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Title</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange(1, "title", value)
                        }
                        value={guestDetails[1].title}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">First Name</Label>
                      <Input
                        value={guestDetails[1].firstName}
                        onChange={(e) =>
                          handleInputChange(1, "firstName", e.target.value)
                        }
                        placeholder="First name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-600">Last Name</Label>
                      <Input
                        value={guestDetails[1].lastName}
                        onChange={(e) =>
                          handleInputChange(1, "lastName", e.target.value)
                        }
                        placeholder="Last name"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-600">Age</Label>
                      <Input
                        type="number"
                        value={guestDetails[1].age}
                        onChange={(e) =>
                          handleInputChange(1, "age", e.target.value)
                        }
                        placeholder="Age"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50">
          <div className="flex w-full justify-between items-center">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="px-6"
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep) || isLoading}
                className="px-8"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || isLoading}
                className="px-8"
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
