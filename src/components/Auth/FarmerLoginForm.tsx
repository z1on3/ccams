"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function FarmerLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    birthday: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/farmer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!');
        // Wait for the toast to be visible
        await new Promise(resolve => setTimeout(resolve, 500));
        // Redirect to farmer profile
        router.push('/farmer/profile');
        router.refresh();
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Farmer Username
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your Farmer ID"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="birthday"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Birthday
        </label>
        <div className="relative">
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-light p-4 font-medium text-white transition hover:bg-opacity-90 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>
      <Link href="/farmer/signup" className="text-sm">Don't have an account? <span className="text-sm text-blue-light">Register</span></Link>
    </form>
  );
} 