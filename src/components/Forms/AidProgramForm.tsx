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
    assigned_barangay: initialValues?.assigned_barangay || "",
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