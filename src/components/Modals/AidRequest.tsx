'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';

interface AidRequestProps {
    farmerID: string;
    onSuccess: () => void;
    onClose: () => void;
}
const CATEGORIES = [
    "Financial Assistance",
    "Fertilizer Support",
    "Seed Distribution",
    "Livestock and Poultry Assistance",
    "Farm Tools and Equipment",
  ];
const AidRequest = ({ onClose, onSuccess, farmerID }: AidRequestProps) => {
  const [formData, setFormData] = useState({
    farmer_id: farmerID,
    category: '',
    req_note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/aid-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit aid request');
      }

      toast.success('Aid request submitted successfully', { autoClose: 1000 });
      onSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit aid request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <ToastContainer/>
      <div className="w-full max-w-lg rounded-lg bg-white p-8 dark:bg-gray-dark">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Request Aid
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Request Note
            </label>
            <textarea
              name="req_note"
              value={formData.req_note}
              onChange={handleChange}
              placeholder="Enter request details"
              required
              className="w-full rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary py-2 px-6 text-white hover:shadow-1"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AidRequest;
