import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentUploadSection } from './DocumentUpload';

export const VisaDetailsSection = ({ formData, handleInputChange, handleFileUpload, handleFileRemove, documents }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Form Fields */}
      <div className="col-span-4 space-y-4">
        <div>
          <Label>Visa Type<span className="text-red-500">*</span></Label>
          <Select
            value={formData.visaType}
            onValueChange={(value) => handleInputChange('visaType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visa type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tourist">Tourist</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="work">Work</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Source Type<span className="text-red-500">*</span></Label>
          <Select
            value={formData.sourceType}
            onValueChange={(value) => handleInputChange('sourceType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Process Type</Label>
          <Input value={formData.processType} disabled className="bg-gray-50" />
        </div>

        <div>
          <Label>Present Nationality<span className="text-red-500">*</span></Label>
          <Input
            value={formData.presentNationality}
            onChange={(e) => handleInputChange('presentNationality', e.target.value)}
          />
        </div>

        <div>
          <Label>Passport No<span className="text-red-500">*</span></Label>
          <Input
            value={formData.passportNo}
            onChange={(e) => handleInputChange('passportNo', e.target.value)}
          />
        </div>

        <div>
          <Label>Gender<span className="text-red-500">*</span></Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Birth Date<span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
          />
        </div>

        <div>
          <Label>Birth Country<span className="text-red-500">*</span></Label>
          <Input
            value={formData.birthCountry}
            onChange={(e) => handleInputChange('birthCountry', e.target.value)}
          />
        </div>

        <div>
          <Label>Date of Issue<span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={formData.dateOfIssue}
            onChange={(e) => handleInputChange('dateOfIssue', e.target.value)}
          />
        </div>

        <div>
          <Label>Expiration Date<span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={formData.expirationDate}
            onChange={(e) => handleInputChange('expirationDate', e.target.value)}
          />
        </div>

        <div>
          <Label>Coming From<span className="text-red-500">*</span></Label>
          <Input
            value={formData.comingFrom}
            onChange={(e) => handleInputChange('comingFrom', e.target.value)}
          />
        </div>
      </div>

      {/* Right Column - Document Upload */}
      <div className="col-span-8">
        <DocumentUploadSection 
          hanldeFileUpload={handleFileUpload} 
          documents={documents} 
          handleFileRemove={handleFileRemove}
        />
      </div>
    </div>
  );
};