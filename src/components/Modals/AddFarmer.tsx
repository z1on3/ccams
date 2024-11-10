// components/Modals/AddFarmerModal.tsx
"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

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

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ onClose }) => {

    const [farmerData, setFarmerData] = useState({
      name: "",
      image: "",
      age: "",
      income: "",
      land_size: "",
      wetSeasonCrops: [] as string[],
      drySeasonCrops: [] as string[],
    });

    const [imageBlob, setImageBlob] = useState<string | null>(null); // State to hold the blob URL

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        // Store only the file name in farmerData.image
        setFarmerData((prevState) => ({
          ...prevState,
          image: file.name, // Store the file name (not the full file)
        }));
  
        // Create a blob URL for the image and store it in a separate state variable
        const objectUrl = URL.createObjectURL(file);
        setImageBlob(objectUrl); // Set the image blob URL to show in the img tag
      }
    };
  
    const imageSrc = imageBlob || 'default-image-url'; // Use the image blob if available, else use a default
  
    const [wetCropInput, setWetCropInput] = useState(""); // Separate inputs for wet/dry season crops
    const [dryCropInput, setDryCropInput] = useState("");
    const [wetSuggestions, setWetSuggestions] = useState<string[]>([]); // Separate suggestions for wet season
    const [drySuggestions, setDrySuggestions] = useState<string[]>([]); // Separate suggestions for dry season
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
    };
  
    const handleCropSelect = (
        crop: string,
        season: "wetSeasonCrops" | "drySeasonCrops"
      ) => {
        const cropInput = crop.trim().toLowerCase(); // Normalize the input crop value
        const existingCrops = farmerData[season].map(c => c.toLowerCase()); // Normalize existing crops
      
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
        setFarmerData((prev) => ({
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
      setFarmerData((prev) => ({
        ...prev,
        [season]: prev[season].filter((item) => item !== crop),
      }));
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
      {farmerData.image && (
          <div className="mt-4 flex justify-center">
            <img
              src={imageSrc}
              alt="Farmer Image"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Farmer Image</label>
        <input
  type="file"
  name="image"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
/>

        
      </div>

      {/* Name & Age Fields (50% / 50% Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={farmerData.name}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Age Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={farmerData.age}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Income Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Income</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="income"
              value={farmerData.income}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Land Size Field with Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Land Size</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="landSize"
              value={farmerData.land_size.split(' ')[0]} // Get the numeric value part from land_size
              onChange={(e) => {
                setFarmerData(prevState => ({
                  ...prevState,
                  land_size: `${e.target.value} ${farmerData.land_size.split(' ')[1] || 'm²'}`, // Concatenate new size with unit
                }));
              }}
              className="w-2/3 rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            />
            <select
              name="landUnit"
              value={farmerData.land_size.split(' ')[1] || 'm²'} // Get the unit part from land_size
              onChange={(e) => {
                setFarmerData(prevState => ({
                  ...prevState,
                  land_size: `${farmerData.land_size.split(' ')[0]} ${e.target.value}`, // Concatenate size with new unit
                }));
              }}
              className="w-1/3 rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            >
              <option value="m²">Square Meters</option>
              <option value="ha">Hectares</option>
              <option value="acres">Acres</option>
            </select>
          </div>
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
          {farmerData.wetSeasonCrops.map((crop, idx) => (
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
          {farmerData.drySeasonCrops.map((crop, idx) => (
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

  export default  AddFarmerModal;
  