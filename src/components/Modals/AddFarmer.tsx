// components/Modals/AddFarmerModal.tsx
"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { Barangays } from "../constants/barangays";
import Image from "next/image";

const cropsList = [
  "Wheat",
  "Rice",
  "Corn",
  "Soybean",
  "Coconut",
  "Banana",
  "Pineapple",
  "Mango",
  "Sugarcane",
  "Coffee",
  "Cacao",
  "Abaca",
  "Cassava",
  "Sweet Potato",
  "Onion",
  "Garlic",
  "Tomato",
  "Eggplant",
  "Chili Pepper",
  "Calamansi",
  "Guava",
  "Papaya",
  "Avocado",
  "Durian",
  "Rambutan",
  "Lanzones",
  "Watermelon",
  "Muskmelon",
  "Cabbage",
  "Cauliflower",
  "Broccoli",
  "Lettuce",
  "Spinach",
  "Pechay",
  "Mung Bean",
  "Sitao",
  "Okra",
  "Kangkong",
  "Petchay",
  "Upo",
  "Labanos",
  "Kamote",
  "Sayote",
  "Talong",
  "Ampalaya",
  "Sitaw",
  "Patola",
  "Kundol",
  "Malunggay"
]; // Known list of crops


interface AddFarmerModalProps {
  onClose: () => void;
}

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
    {text} <span className="text-red-500">*</span>
  </label>
);

interface FarmerFormData {
  name: string;
  birthday: string;
  age: number;
  gender: string;
  contact_number: string;
  farm_location: string;
  farm_type: string;
  farm_owner: string;
  land_size: string;
  income: number;
  image?: File | string;
  wetSeasonCrops: string[];
  drySeasonCrops: string[];
  farm_ownership_type: string;
  farmer_type: string[];
}

const farmerTypes = [
  'Coconut Farmer',
  'Rice Farmer',
  'Fruit & Vegetables',
  'Poultry Farmers'
];

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ onClose }) => {

  const [formData, setFormData] = useState<FarmerFormData>({
    name: "",
    birthday: "",
    age: 0,
    gender: "",
    contact_number: "",
    farm_location: "",
    farm_type: "",
    farm_owner: "",
    land_size: "",
    income: 0,
    wetSeasonCrops: [],
    drySeasonCrops: [],
    farm_ownership_type: "",
    farmer_type: []
  });

  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'birthday') {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        age: age
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a blob URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImageBlob(objectUrl);

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Update farmer data with the new image path
      setFormData(prev => ({
        ...prev,
        image: data.path
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      // Reset to default image on error
      setFormData(prev => ({
        ...prev,
        image: '/images/user/default-user.png'
      }));
      setImageBlob(null);
    } finally {
      setIsUploading(false);
    }
  };

  const imageSrc = imageBlob || formData.image;

  const [wetCropInput, setWetCropInput] = useState(""); // Separate inputs for wet/dry season crops
  const [dryCropInput, setDryCropInput] = useState("");
  const [wetSuggestions, setWetSuggestions] = useState<string[]>([]); // Separate suggestions for wet season
  const [drySuggestions, setDrySuggestions] = useState<string[]>([]); // Separate suggestions for dry season

  const handleCropSelect = (
    crop: string,
    season: "wetSeasonCrops" | "drySeasonCrops"
  ) => {
    const cropInput = crop.trim().toLowerCase(); // Normalize the input crop value
    const existingCrops = formData[season].map(c => c.toLowerCase()); // Normalize existing crops

    // Check if the crop already exists
    if (existingCrops.includes(cropInput)) {
      toast.error(`${crop} is already added to ${season === 'wetSeasonCrops' ? 'wet' : 'dry'} season crops.`, {
        position: "bottom-center", // "top-left", "bottom-right", etc.
        autoClose: 3000, // 3 seconds
        hideProgressBar: false, // Show progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause on hover
        draggable: true, // Allow dragging the toast
      });

      return;
    }

    // Update the farmer data with the new crop
    setFormData((prev) => ({
      ...prev,
      [season]: [...prev[season], crop], // Add the new crop
    }));

    // Clear the input and reset suggestions
    season === "wetSeasonCrops" ? setWetCropInput("") : setDryCropInput("");
    season === "wetSeasonCrops" ? setWetSuggestions([]) : setDrySuggestions([]); // Clear suggestions for the selected season
  };

  const handleCropInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    season: "wetSeasonCrops" | "drySeasonCrops"
  ) => {
    const input = e.target.value;
    if (season === "wetSeasonCrops") {
      setWetCropInput(input);
      setWetSuggestions(
        cropsList.filter((crop) => crop.toLowerCase().includes(input.toLowerCase()))
      );
    } else {
      setDryCropInput(input);
      setDrySuggestions(
        cropsList.filter((crop) => crop.toLowerCase().includes(input.toLowerCase()))
      );
    }
  };

  const handleCropInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    season: "wetSeasonCrops" | "drySeasonCrops"
  ) => {
    if (e.key === "Enter" && (season === "wetSeasonCrops" ? wetCropInput : dryCropInput).trim()) {
      handleCropSelect((season === "wetSeasonCrops" ? wetCropInput : dryCropInput).trim(), season);
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const handleCropRemove = (
    crop: string,
    season: "wetSeasonCrops" | "drySeasonCrops"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [season]: prev[season].filter((item) => item !== crop),
    }));
  };

  const handleFarmerTypeChange = (type: string) => {
    setFormData(prev => {
      const updatedTypes = prev.farmer_type.includes(type)
        ? prev.farmer_type.filter(t => t !== type)
        : [...prev.farmer_type, type];
      return { ...prev, farmer_type: updatedTypes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data
      const formattedData = {
        name: formData.name,
        image: formData.image || 'default-user.png',
        age: parseInt(formData.age as unknown as string),
        birthday: new Date(formData.birthday).toISOString().split('T')[0],
        phone: formData.contact_number ? parseInt(formData.contact_number) : null,
        email: formData.email ? parseInt(formData.email) : null,
        farm_location: formData.farm_location,
        land_size: formData.land_size,
        farm_owner: formData.farm_owner,
        income: parseFloat(formData.income as unknown as string),
        crops: [
          ...formData.wetSeasonCrops.map(crop => ({ name: crop, season: 'Wet' })),
          ...formData.drySeasonCrops.map(crop => ({ name: crop, season: 'Dry' }))
        ],
        farmOwnerClassification: formData.farm_ownership_type,
        farmerType: formData.farmer_type
      };

      console.log('Sending data:', formattedData); // Debug log

      // Send the data to the API
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save farmer');
      }
      const data = await response.json();
      toast.success('Farmer added successfully!', {
        position: "bottom-center",
        autoClose: 3000,
      });
      window.open(`/farmer/success?username=${data.farmer_details.username}`, '_blank');


      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error saving farmer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add farmer. Please try again.', {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-2xl max-w-5xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add Farmer</h2>
        <ToastContainer />
        <form className="space-y-6">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Image Upload */}
            <div className="mb-6">
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <Image
                    src={imageSrc}
                    alt="Farmer Image"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Farmer Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Name & Age Fields (50% / 50% Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div>
                <RequiredLabel text="Name" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              {/* Gender Field */}
              <div>
                <RequiredLabel text="Gender" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="LGBTQ+">LGBTQ+</option>
                </select>
              </div>
            </div>

            {/* Birthday & Age Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <RequiredLabel text="Birthday" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              {/* Age Field */}
              <div>
                <RequiredLabel text="Age" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Phone & Farm Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Phone</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <RequiredLabel text="Farm Location" />
                <select
                  name="farm_location"
                  value={formData.farm_location}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Barangay</option>
                  {Barangays.map((barangay) => (
                    <option key={barangay.code} value={barangay.name}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email & Farm Owner Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <RequiredLabel text="Farm Owner" />
                <select
                  name="farm_owner"
                  value={formData.farm_owner}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {/* Land Size & Income Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <RequiredLabel text="Land Size" />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="land_size"
                    value={formData.land_size.split(' ')[0]}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        land_size: `${e.target.value} ${prev.land_size.split(' ')[1] || 'ha'}`
                      }));
                    }}
                    className="w-2/3 rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                    required
                  />
                  <select
                    value={formData.land_size.split(' ')[1] || 'ha'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        land_size: `${prev.land_size.split(' ')[0]} ${e.target.value}`
                      }));
                    }}
                    className="w-1/3 rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  >
                    <option value="ha">Hectares</option>
                    <option value="sqm">Square Meters</option>
                    <option value="acre">Acres</option>
                  </select>
                </div>
              </div>

              <div>
                <RequiredLabel text="Income" />
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Wet Season Crops Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Wet Season Crops</label>
              <input
                type="text"
                placeholder="Type crop name"
                value={wetCropInput}
                onChange={(e) => handleCropInput(e, "wetSeasonCrops")}
                onKeyDown={(e) => handleCropInputKeyPress(e, "wetSeasonCrops")}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
              {/* Wet season suggestions */}
              {wetSuggestions.length > 0 && (
                <ul className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-gray-2 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary">
                  {wetSuggestions.map((crop, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleCropSelect(crop, "wetSeasonCrops")}
                      className=" bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary hover:bg-gray-7 dark:hover:bg-dark-6"
                    >
                      {crop}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.wetSeasonCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="bg-green-200 text-green-800 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm"
                  >
                    {crop}
                    <button
                      type="button"
                      onClick={() => handleCropRemove(crop, "wetSeasonCrops")}
                      className="text-red-500 text-xs"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dry Season Crops Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Dry Season Crops</label>
              <input
                type="text"
                placeholder="Type crop name"
                value={dryCropInput}
                onChange={(e) => handleCropInput(e, "drySeasonCrops")}
                onKeyDown={(e) => handleCropInputKeyPress(e, "drySeasonCrops")}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
              {/* Dry season suggestions */}
              {drySuggestions.length > 0 && (
                <ul className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-gray-2 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary">
                  {drySuggestions.map((crop, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleCropSelect(crop, "drySeasonCrops")}
                      className="bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary hover:bg-gray-7 dark:hover:bg-dark-6"
                    >
                      {crop}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.drySeasonCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm"
                  >
                    {crop}
                    <button
                      type="button"
                      onClick={() => handleCropRemove(crop, "drySeasonCrops")}
                      className="text-red-500 text-xs"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Farm Ownership Type & Farmer Type Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <RequiredLabel text="Farm Ownership Type" />
                <select
                  name="farm_ownership_type"
                  value={formData.farm_ownership_type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Ownership Type</option>
                  <option value="Land Owner">Land Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>

              <div>
                <RequiredLabel text="Farmer Type" />
                <div className="space-y-2">
                  {farmerTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`farmer-type-${type}`}
                        checked={formData.farmer_type.includes(type)}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.farmer_type, type]
                            : formData.farmer_type.filter((t) => t !== type);
                          setFormData({ ...formData, farmer_type: updatedTypes });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`farmer-type-${type}`} className="text-sm text-gray-700 dark:text-gray-200">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
          </div>
          <div className="mt-8 flex justify-end space-x-6">
            <button
              onClick={onClose} // Use the onClose prop to close the modal
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition-all"
            >
              Save Farmer
            </button>
          </div>
        </form>
      </div>
    </div>


  );
};

export default AddFarmerModal;
