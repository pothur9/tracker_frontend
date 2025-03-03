import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PreviewField = ({ label, value }) => (
  <div className="mb-4">
    <span className="font-medium text-gray-700">{label}: </span>
    <span className="text-gray-600">{value || 'N/A'}</span>
  </div>
);

const PreviewSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">{title}</h3>
    <div className="pl-4">{children}</div>
  </div>
);

export const VisaPreview = ({ 
  isOpen, 
  onClose, 
  formData, 
  status,
  onSubmit 
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      // Send email notification
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          formData: formData
        }),
      });

      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Visa Application Preview
            <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
              status === 'send' ? 'bg-green-100 text-green-800' :
              status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PreviewSection title="Personal Information">
            <PreviewField label="Full Name" value={`${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`} />
            <PreviewField label="Passport Number" value={formData.passportNo} />
            <PreviewField label="Nationality" value={formData.presentNationality} />
            <PreviewField label="Date of Birth" value={formData.birthDate} />
            <PreviewField label="Gender" value={formData.gender} />
          </PreviewSection>

          <PreviewSection title="Contact Details">
            <PreviewField label="Mobile" value={formData.mobile} />
            <PreviewField label="Address" value={formData.address} />
            <PreviewField label="City" value={formData.city} />
            <PreviewField label="Country" value={formData.residingCountry} />
          </PreviewSection>

          <PreviewSection title="Visa Details">
            <PreviewField label="Visa Type" value={formData.visaType} />
            <PreviewField label="Purpose of Visit" value={formData.visitReason} />
            <PreviewField label="Arrival Date" value={formData.arrivalDate} />
          </PreviewSection>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={setAcceptedTerms}
              />
              <Label htmlFor="terms" className="text-sm">
                I confirm that all the information provided is accurate and I agree to the terms and conditions
              </Label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!acceptedTerms}
                className={`px-4 py-2 rounded-lg text-white ${
                  acceptedTerms ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                }`}
              >
                {status === 'send' ? 'Submit Application' : 
                 status === 'waiting' ? 'Save as Draft' : 'Cancel Application'}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisaPreview;