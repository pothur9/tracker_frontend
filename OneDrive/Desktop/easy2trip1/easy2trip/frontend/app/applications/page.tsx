'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { NavigationMenu } from "../components/navigation-menu";

interface Application {
  id: string;
  country: string;
  status: string;
  applicantName: string;
  submissionDate: string;
  formData: any;
}

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleViewApplication = (application: Application) => {
    setSelectedApp(application);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      send: 'bg-green-100 text-green-800',
      waiting: 'bg-yellow-100 text-yellow-800',
      cancel: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${colors[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Example applications data
  const applications = [
    {
      id: 'VISA-001',
      country: 'United States',
      status: 'send',
      applicantName: 'John Doe',
      submissionDate: '2024-02-06',
      formData: {/*...*/}
    },
    // Add more examples as needed
  ];

  return (
    <div className="max-w-7xl mx-auto py-0 px-4">
        <Header />
        <div className="sticky top-0 z-50 bg-white shadow-md">
      </div>
      <div className='m-8'>

      <NavigationMenu />
      </div>
      <Card className="p-6 mb-10">
        <h1 className="text-2xl font-bold mb-6">Visa Applications</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Application ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Country</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Applicant Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Submission Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{app.id}</td>
                  <td className="px-4 py-4 text-sm">{app.country}</td>
                  <td className="px-4 py-4 text-sm">{app.applicantName}</td>
                  <td className="px-4 py-4 text-sm">{app.submissionDate}</td>
                  <td className="px-4 py-4 text-sm">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button
                      onClick={() => handleViewApplication(app)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Application Details - {selectedApp.id}</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Application details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Basic Information</h3>
                    <p>Country: {selectedApp.country}</p>
                    <p>Status: <StatusBadge status={selectedApp.status} /></p>
                    <p>Submission Date: {selectedApp.submissionDate}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Applicant Details</h3>
                    <p>Name: {selectedApp.applicantName}</p>
                    {/* Add more details as needed */}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}