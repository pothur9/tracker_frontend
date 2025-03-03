import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const LanguageAndReligionSection = ({ formData, handleInputChange }) => {
  const languages = [
    { value: 'english', label: 'English' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'other', label: 'Other' }
  ];

  const religions = [
    { value: 'islam', label: 'Islam' },
    { value: 'christianity', label: 'Christianity' },
    { value: 'hinduism', label: 'Hinduism' },
    { value: 'buddhism', label: 'Buddhism' },
    { value: 'sikhism', label: 'Sikhism' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label>Language<span className="text-red-500">*</span></Label>
        <Select
          value={formData.language}
          onValueChange={(value) => handleInputChange('language', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Religion<span className="text-red-500">*</span></Label>
        <Select
          value={formData.religion}
          onValueChange={(value) => handleInputChange('religion', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select religion" />
          </SelectTrigger>
          <SelectContent>
            {religions.map((religion) => (
              <SelectItem key={religion.value} value={religion.value}>
                {religion.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export const PersonalDetailsSection = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <Label>Marital Status<span className="text-red-500">*</span></Label>
        <Select
          value={formData.maritalStatus}
          onValueChange={(value) => handleInputChange('maritalStatus', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <Label>Birth Place<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.birthPlace}
          onChange={(e) => handleInputChange('birthPlace', e.target.value)}
        />
      </div>
      <div>
        <Label>First Name<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
        />
      </div>
      <div>
        <Label>Middle Name</Label>
        <Input 
          value={formData.middleName}
          onChange={(e) => handleInputChange('middleName', e.target.value)}
        />
      </div>
      <div>
        <Label>Last Name<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <Label>Passport Issue Place<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.passportIssuePlace}
          onChange={(e) => handleInputChange('passportIssuePlace', e.target.value)}
        />
      </div>
      <div>
        <Label>Father Name<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.fatherName}
          onChange={(e) => handleInputChange('fatherName', e.target.value)}
        />
      </div>
      <div>
        <Label>Mother Name<span className="text-red-500">*</span></Label>
        <Input 
          value={formData.motherName}
          onChange={(e) => handleInputChange('motherName', e.target.value)}
        />
      </div>
      <div>
        <Label>Husband Name</Label>
        <Input 
          value={formData.husbandName}
          onChange={(e) => handleInputChange('husbandName', e.target.value)}
        />
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Checkbox
        id="isPassportTravel"
        checked={formData.isPassportTravel}
        onCheckedChange={(checked) => handleInputChange('isPassportTravel', checked)}
      />
      <Label htmlFor="isPassportTravel">Passport is Travel Document</Label>
    </div>
  </div>
);

export const AddressSection = ({ formData, handleInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <Label>Residing Country</Label>
      <Input 
        value={formData.residingCountry}
        onChange={(e) => handleInputChange('residingCountry', e.target.value)}
      />
    </div>
    <div>
      <Label>City</Label>
      <Input 
        value={formData.city}
        onChange={(e) => handleInputChange('city', e.target.value)}
      />
    </div>
    <div>
      <Label>Address</Label>
      <Input 
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

export const ResidencySection = ({ formData, handleInputChange }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Checkbox
        id="beenResident"
        checked={formData.beenResident}
        onCheckedChange={(checked) => handleInputChange('beenResident', checked)}
      />
      <Label htmlFor="beenResident">
        Been Resident GCC/US/UK/CA/Schengen
      </Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox
        id="visitedBefore"
        checked={formData.visitedBefore}
        onCheckedChange={(checked) => handleInputChange('visitedBefore', checked)}
      />
      <Label htmlFor="visitedBefore">
        Visited US/UK/CA/Schengen
      </Label>
    </div>
  </div>
);

export const ProfessionalSection = ({ formData, handleInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <Label>Visit Reason<span className="text-red-500">*</span></Label>
      <Select
        value={formData.visitReason}
        onValueChange={(value) => handleInputChange('visitReason', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select reason" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tourism">Tourism</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="study">Study</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Profession<span className="text-red-500">*</span></Label>
      <Input 
        value={formData.profession}
        onChange={(e) => handleInputChange('profession', e.target.value)}
      />
    </div>
    <div>
      <Label>Education<span className="text-red-500">*</span></Label>
      <Select
        value={formData.education}
        onValueChange={(value) => handleInputChange('education', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select education" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="highschool">High School</SelectItem>
          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
          <SelectItem value="master">Master's Degree</SelectItem>
          <SelectItem value="phd">PhD</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export const ContactSection = ({ formData, handleInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <Label>Applicant Mobile<span className="text-red-500">*</span></Label>
      <Input 
        value={formData.mobile}
        onChange={(e) => handleInputChange('mobile', e.target.value)}
        placeholder="971501234567"
      />
    </div>
    <div>
      <Label>Group Membership<span className="text-red-500">*</span></Label>
      <Select
        value={formData.groupMembership}
        onValueChange={(value) => handleInputChange('groupMembership', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select membership" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="group">Group</SelectItem>
          <SelectItem value="family">Family</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export const AutoGeneratedFields = () => (
  <div className="grid grid-cols-4 gap-4">
    <div>
      <Label>Your Rate</Label>
      <Input value="AUTO" disabled className="bg-gray-50" />
    </div>
    <div>
      <Label>Insurance</Label>
      <Input value="AUTO" disabled className="bg-gray-50" />
    </div>
    <div>
      <Label>Guarantee</Label>
      <Input value="AUTO" disabled className="bg-gray-50" />
    </div>
    <div>
      <Label>Accepted Fine</Label>
      <Input value="AUTO" disabled className="bg-gray-50" />
    </div>
  </div>
);

export const TranslateButton = () => (
  <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors">
    <span>🌐</span>
    <span>TRANSLATE TO ARABIC</span>
  </button>
);

export const ActionButtons = ({ onCheck, onSubmit }) => (
  <div className="flex justify-end gap-4">
    <button
      onClick={onCheck}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <span>✓</span>
      <span>CHECK</span>
    </button>
    <button
      onClick={onSubmit}
      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
    >
      <span>→</span>
      <span>SUBMIT</span>
    </button>
  </div>
);

export const ApplicationStatus = ({ status, onStatusChange }) => {
  const statusOptions = [
    { id: 'cancel', label: 'Cancel', icon: '❌', description: 'The application will be totally inactive and ineffective.' },
    { id: 'waiting', label: 'Waiting', icon: '⏳', description: 'The application will be kept in your waiting list, you may send or cancel it later.' },
    { id: 'send', label: 'Send', icon: '✅', description: 'The application will be sent for posting, you may NOT be able to change it later.' }
  ];

  return (
    <div className="flex justify-between items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
      {statusOptions.map((option) => (
        <div
          key={option.id}
          className={`flex-1 p-4 rounded-lg cursor-pointer transition-colors
            ${status === option.id 
              ? 'bg-blue-50 border-2 border-blue-200' 
              : 'bg-gray-50 hover:bg-gray-100'}`}
          onClick={() => onStatusChange(option.id)}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </div>
          <p className="text-sm text-gray-600">{option.description}</p>
        </div>
      ))}
    </div>
  );
};