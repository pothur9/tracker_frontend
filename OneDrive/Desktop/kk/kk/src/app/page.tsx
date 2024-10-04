"use client";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "./contexts/LanguageContext";
import Navbar from "../app/components/navbar";
import en from "../../public/locales/en/common.json";
import kn from "../../public/locales/kn/common.json";
import hi from "../../public/locales/hi/common.json";
import imageCompression from "browser-image-compression"; // Import image compression library

const translations = { en, kn, hi };

// Mapping operator types to corresponding image URLs
const operatorImages: Record<string, string> = {
  excavator: "./excavator.jpeg",
  backhoeloader: "./backholed.jpeg",
  bulldozer: "./bulldozer.jpeg",
  loader: "./loader.jpeg",
  grader: "./grader.jpeg",
  dumper: "./dumper.jpeg",
  truck: "./truck.jpeg",
  roadroller: "./road_roller.jpeg",
  concretebatching: "./Concrete_Batching_plant.jpeg",
  asphaltbatching: "./Asphalt_Batching_plant.jpeg",
  asphaltpaver: "./asphalt_paver.jpeg",
  towercrane: "./tower_crane.jpeg",
  staticconcretepump: "./Static_Concrete_Pump.jpeg",
  crane: "./crane.jpeg",
  hydra: "./Hydra.jpeg",
  boomlift: "./boom_lift.jpeg",
  borewell: "./Bore_Well_Machhine.jpeg",
  pilingmachine: "./piling_machine.jpeg",
};

const statesInIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function Home() {
  const { language } = useContext(LanguageContext); // Access language from context
  const [t, setT] = useState({}); // To store translations for the current language
  const [photo, setPhoto] = useState<File | null>(null); // To store the uploaded file
  const [photoError, setPhotoError] = useState<string | null>(null); // Error handling for file upload
  const [compressedSize, setCompressedSize] = useState<number | null>(null); // To store the compressed file size
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store the image preview
  const [operatorImage, setOperatorImage] = useState<string | null>(null);

  useEffect(() => {
    if (language) {
      // Load the appropriate translation based on the selected language
      setT(translations[language as keyof typeof translations]);
    }
  }, [language]); // Update translations when the language changes

  if (!t || Object.keys(t).length === 0) {
    return <div>Loading translations...</div>; // Show loading state until translations are available
  }

  // Function to handle photo upload and compress the image to 100 KB
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the uploaded file
    if (!file) return; // If no file is selected, return early

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Only JPEG, PNG, and PDF formats are allowed.");
      return;
    }

    setPhotoError(null); // Clear previous error

    // If the file is an image, compress it
    if (file.type.startsWith("image")) {
      try {
        let compressedFile = file;
        let compressionOptions = {
          maxSizeMB: 1, // Start with 1MB as initial compression
          useWebWorker: true,
        };

        // Iteratively compress the image until its size is <= 100 KB
        while (compressedFile.size > 100 * 1024) {
          compressedFile = await imageCompression(file, compressionOptions);
          compressionOptions.maxSizeMB = 0.1; // Adjust the compression to try a tighter compression
        }

        // Set the compressed file and update size
        setPhoto(compressedFile);
        setCompressedSize(Math.round(compressedFile.size / 1024)); // Update the compressed size in KB

        // Create image preview
        const imageUrl = URL.createObjectURL(compressedFile);
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("Error compressing image:", error);
        setPhotoError("An error occurred during image compression.");
      }
    } else {
      // If it's a PDF, just set the file directly and show PDF details
      setPhoto(file);
      setCompressedSize(null); // Reset compressed size when not an image
      setImagePreview(null); // Reset image preview if not an image
    }
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOperator = e.target.value;
    if (operatorImages[selectedOperator]) {
      setOperatorImage(operatorImages[selectedOperator]);
    } else {
      setOperatorImage(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="hero bg-slate-100 min-h-screen w-full">
  <div className="hero-content flex-col-reverse lg:flex-row-reverse w-full">
    <img
      src="hero-2.png"
      className="max-w-full rounded-lg lg:max-w-xl"
      alt="hero image"
      style={{ width: "100%", height: "auto", maxWidth: "500px", maxHeight: "500px" }}
    />
    <div className="text-center lg:text-left mt-6 lg:mt-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: "black" }}>
        {t.hero_title}
      </h1>
      <p className="py-6 text-base sm:text-lg">{t.hero_text}</p>
      <button className="btn btn-primary">{t.join_us}</button>
    </div>
  </div>
</div>

      {/* about company*/}
      <div class="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto my-8">
  <h1 class="text-4xl font-semibold text-center text-primary mb-6">Our Vision</h1>
  <p class="text-gray-600 leading-relaxed text-lg">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. In odit eveniet ipsam debitis minus quo unde asperiores hic voluptates. Magnam at labore nobis neque, saepe fugiat a illum ullam libero. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam, quia. Incidunt quisquam ex aspernatur, nesciunt fugiat eius officiis dolorum eos autem? Quidem facere nam eaque fugiat, dolores ullam non magnam!
  </p>
</div>


      {/* Driver Application Form */}
      <div className="max-w-lg mx-auto p-8 bg-base-100 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t.form_title}
        </h2>

        {/* Name Field */}
        <div className="form-control mb-4">
          <label htmlFor="name" className="label">
            <span className="label-text">{t.form_name}</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder={t.form_name_placeholder}
            className="input input-bordered w-full"
          />
        </div>

        {/* Date of Birth */}
        <div className="form-control mb-4">
          <label htmlFor="dob" className="label">
            <span className="label-text">{t.form_dob}</span>
          </label>
          <input type="date" id="dob" className="input input-bordered w-full" />
        </div>

        {/* Gender Field */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">{t.form_gender}</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="">{t.select_gender}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>

        {/* Contact Number */}
        <div className="form-control mb-4">
          <label htmlFor="contact" className="label">
            <span className="label-text">{t.form_contact}</span>
          </label>
          <input
            type="number"
            id="contact"
            placeholder={t.form_contact_placeholder}
            className="input input-bordered w-full"
          />
        </div>

       

        {/* Add Photo (JPEG, PNG, PDF only) */}
        <div className="form-control mb-4">
          <label htmlFor="userphoto" className="label">
            <span className="label-text">{t.add_photo}</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handlePhotoChange}
            className="file-input file-input-bordered w-full"
          />
          {photoError && (
            <p className="text-red-500 text-sm mt-2">{photoError}</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-w-xs rounded-lg"
            />
          )}
          {photo && compressedSize !== null && (
            <p className="mt-2 text-sm">
              {t.file_size}: {compressedSize} KB
            </p>
          )}
        </div>

        {/* Operator Type */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">{t.form_operator}</span>
          </label>
          <select
            className="select select-bordered w-full"
            onChange={handleOperatorChange}
          >
            <option value="">{t.select_operator}</option>
            {Object.keys(operatorImages).map((key) => (
              <option key={key} value={key}>
                {t[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Operator Image Preview */}
        {operatorImage && (
          <img
            src={operatorImage}
            alt="Selected Operator"
            className="my-4 max-w-xs rounded-lg"
          />
        )}

           {/* Gender Field */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">{t.form_optype}</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="">{t.select_Load}</option>
            <option value="Light">{t.Light}</option>
            <option value="Medium">{t.Medium}</option>
            <option value="Heavy">{t.Heavy}</option>
          </select>
        </div>

        {/* Experience in Years */}
        <div className="form-control mb-4">
          <label htmlFor="experience" className="label">
            <span className="label-text">{t.form_experience}</span>
          </label>
          <input
            type="number"
            id="experience"
            placeholder={t.form_experience_placeholder}
            className="input input-bordered w-full"
            min="0"
            max="50"
          />
        </div>

        {/* Company Details */}
        <div className="form-control mb-4">
          <label htmlFor="company" className="label">
            <span className="label-text">{t.form_company}</span>
          </label>
          <input
            type="text"
            id="company"
            placeholder={t.form_company_placeholder}
            className="input input-bordered w-full"
          />
        </div>

        {/* Address */}
        <div className="form-control mb-4">
          <label htmlFor="address" className="label">
            <span className="label-text">{t.form_address}</span>
          </label>
          <textarea
            id="address"
            placeholder={t.form_address_placeholder}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>
        {/* Address */}
        <div className="form-control mb-4">
          <label htmlFor="address" className="label">
            <span className="label-text">{t.pform_address}</span>
          </label>
          <textarea
            id="address"
            placeholder={t.pform_address_placeholder}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        {/* State of Interest */}
        <div className="form-control mb-4">
          <label htmlFor="state" className="label">
            <span className="label-text">{t.form_state}</span>
          </label>
          <select id="state" className="select select-bordered w-full">
            <option value="">{t.select_state}</option>
            {statesInIndia.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button className="btn btn-primary">{t.submit}</button>
        </div>
      </div>
    </>
  );
}

