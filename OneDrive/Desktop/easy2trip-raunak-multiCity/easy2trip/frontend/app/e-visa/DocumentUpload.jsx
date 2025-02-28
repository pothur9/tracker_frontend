// components/visa/DocumentUpload.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Camera, X, FileText, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpeg', '.jpg', '.png'],
  'application/pdf': ['.pdf']
};

const DocumentUploadBox = ({ title, description, onFileSelect, preview, error, onRemove }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg transition-all
        ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
        ${error ? 'border-red-400' : ''}
        ${preview ? 'hover:border-blue-400' : 'hover:border-gray-400'}
        cursor-pointer`}
    >
      <input {...getInputProps()} />
      
      <div className="p-4">
        {preview ? (
          <div className="relative">
            {preview.type === 'image' ? (
              <img 
                src={preview.url} 
                alt={title}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                  hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 
              transition-opacity rounded flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click or drag to replace</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <div className="text-sm font-medium text-gray-700">{title}</div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Drag & drop or click to upload<br />
              (JPG, PNG, PDF up to 5MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mt-1 px-4 pb-2">
          {error}
        </div>
      )}
    </div>
  );
};

export const DocumentUploadSection = ({hanldeFileUpload, handleFileRemove, documents}) => {
  // const [documents, setDocuments] = useState({
  //   mainPassport: null,
  //   passportPage2: null,
  //   photo: null,
  //   returnTicket: null,
  //   otherDocs: null
  // });

  const [previews, setPreviews] = useState({
    mainPassport: null,
    passportPage2: null,
    photo: null,
    returnTicket: null,
    otherDocs: null
  });

  const [errors, setErrors] = useState({
    mainPassport: null,
    passportPage2: null,
    photo: null,
    returnTicket: null,
    otherDocs: null
  });

  const handleFileSelect = async (type, file) => {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }));
        return;
      }

      console.log(type, file)
      // Create preview
      const preview = {
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file)
      };

      // Update state
      // setDocuments(prev => ({
      //   ...prev,
      //   [type]: file
      // }));
      hanldeFileUpload(file, type)
      setPreviews(prev => ({
        ...prev,
        [type]: preview
      }));
      setErrors(prev => ({
        ...prev,
        [type]: null
      }));

    } catch (error) {
      console.error('Error handling file:', error);
      setErrors(prev => ({
        ...prev,
        [type]: 'Error processing file'
      }));
    } finally {
      // console.log(documents)
    }
  };

  const handleRemove = (type) => {
    handleFileRemove(type)
    setPreviews(prev => ({
      ...prev,
      [type]: null
    }));
    setErrors(prev => ({
      ...prev,
      [type]: null
    }));
  };

  return (
    <Card className="p-1">
      <div className="space-y-2 ml-4 mt-3 mr-4 mb-2">
        <Label className="text-lg font-semibold">Required Documents</Label>
        
        <div className="grid grid-cols-1 gap-1">
          <DocumentUploadBox
            title="Main Passport Page"
            description="Upload clear scan of passport main page"
            onFileSelect={(file) => handleFileSelect('mainPassport', file)}
            preview={previews.mainPassport}
            error={errors.mainPassport}
            onRemove={() => handleRemove('mainPassport')}
          />
          
          <DocumentUploadBox
            title="Passport Page 2"
            description="Upload clear scan of passport page 2"
            onFileSelect={(file) => handleFileSelect('passportPage2', file)}
            preview={previews.passportPage2}
            error={errors.passportPage2}
            onRemove={() => handleRemove('passportPage2')}
          />
          
          <DocumentUploadBox
            title="Personal Photo"
            description="Recent photo with white background"
            onFileSelect={(file) => handleFileSelect('photo', file)}
            preview={previews.photo}
            error={errors.photo}
            onRemove={() => handleRemove('photo')}
          />
          
          <DocumentUploadBox
            title="Return Ticket"
            description="Upload confirmed return ticket"
            onFileSelect={(file) => handleFileSelect('returnTicket', file)}
            preview={previews.returnTicket}
            error={errors.returnTicket}
            onRemove={() => handleRemove('returnTicket')}
          />

          <DocumentUploadBox
            title="Other Documents"
            description="Any additional supporting documents"
            onFileSelect={(file) => handleFileSelect('otherDocs', file)}
            preview={previews.otherDocs}
            error={errors.otherDocs}
            onRemove={() => handleRemove('otherDocs')}
          />
        </div>
      </div>
    </Card>
  );
};

export default DocumentUploadSection;