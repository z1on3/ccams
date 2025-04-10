"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Barangays } from "../constants/barangays";

interface AidProgramFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

// Constants for dropdowns
const CATEGORIES = [
  "Financial Assistance",
  "Fertilizer Support",
  "Seed Distribution",
  "Livestock and Poultry Assistance",
  "Farm Tools and Equipment",
];

const farmerTypes = [
  'Coconut Farmer',
  'Rice Farmer',
  'Fruit & Vegetables',
  'Poultry Farmers'
];

const AidProgramForm: React.FC<AidProgramFormProps> = ({
  initialValues,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    category: initialValues?.category || "",
    resource_allocation: {
      type: initialValues?.resource_allocation?.type || "",
      quantity: initialValues?.resource_allocation?.quantity || "",
      budget: initialValues?.resource_allocation?.budget || "",
    },
    eligibility: {
      min_income: initialValues?.eligibility?.min_income || "",
      max_income: initialValues?.eligibility?.max_income || "",
      min_land_size : initialValues?.eligibility?.min_land_size || "",
      max_land_size : initialValues?.eligibility?.max_land_size || "",
      land_ownership_type: initialValues?.eligibility?.land_ownership_type || "",
      last_updated: initialValues?.eligibility?.last_updated || "",
    },
    assigned_barangay: initialValues?.assigned_barangay || "",
    farmer_type: initialValues?.farmer_type || []
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("resource_allocation.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        resource_allocation: {
          ...prev.resource_allocation,
          [field]: value,
        },
      }));
    }
    else if (name.startsWith("eligibility.")) {

      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [field]: value,
        },
      }));
      
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-2xl max-w-5xl w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {initialValues ? "Edit Aid Program" : "Add Aid Program"}
      </h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Program Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Program Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Allocation Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Resource Type
              </label>
              <input
                type="text"
                name="resource_allocation.type"
                value={formData.resource_allocation.type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="resource_allocation.quantity"
                value={formData.resource_allocation.quantity}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Budget
              </label>
              <input
                type="number"
                name="resource_allocation.budget"
                value={formData.resource_allocation.budget}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Assigned Barangay Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Assigned Barangay
            </label>
            <select
              name="assigned_barangay"
              value={formData.assigned_barangay}
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

          {/*Eligibility Section*/}
          <div className="mb-6">

            <h3 className="text-xl font-bold mb-4">Eligibility</h3>
            {/*Income Section*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Minimum Income (PHP)
                </label>
                <input
                  type="number"
                  name="eligibility.min_income"
                  value={formData.eligibility.min_income}
                  onChange={handleInputChange}
                  placeholder="Minimum Income Eligible (Input 0 if not applicable)"
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Maximum Income (PHP)
              </label>
                <input
                  type="number"
                  name="eligibility.max_income"
                  value={formData.eligibility.max_income}
                  onChange={handleInputChange}
                  placeholder="Maximum Income Eligible (Input 0 if not applicable)"
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                /></div>

            </div>

            {/*Income Section*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Minimum Land Size (Square Meters)
                </label>
                <input
                  type="number"
                  name="eligibility.min_land_size"
                  value={formData.eligibility.min_land_size}
                  onChange={handleInputChange}
                  placeholder="Minimum Land Size (Square Meters)"
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Maximum Land Size (Square Meters)
              </label>
                <input
                  type="number"
                  name="eligibility.max_land_size"
                  value={formData.eligibility.max_land_size}
                  onChange={handleInputChange}
                  placeholder="Maximum Land Size (Square Meters)"
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                /></div>

            </div>

            {/*More Eligibility Section*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Land Ownership Type
                </label>
                <select
                  name="eligibility.land_ownership_type"
                  value={formData.eligibility.land_ownership_type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="Tenant">Tenant</option>
                  <option value="Land Owner">Land Owner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Profile Last Updated (This checks if the farmer is active in the system)
                </label>
                <input
                  type="date"
                  name="eligibility.last_updated"
                  value={formData.eligibility.last_updated}
                  onChange={handleInputChange}
                  placeholder="Profile Last Updated (This checks if the farmer is active in the system)"
                  className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
                /></div>

            </div>


            {/*Farmer Type*/}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Farmer Type
                </label>
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
                      : formData.farmer_type.filter((t: string) => t !== type);
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
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition-all"
          >
            {initialValues ? "Update Program" : "Save Program"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AidProgramForm; 