// app/dashboard/farmer-management/profile/page.tsx
"use client";
import { Farmer } from "@/types/farmer";
import FarmerProfile from "@/components/Dashboard/farmer-profile";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const FarmerProfilePage = () => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        const response = await fetch('/api/farmers/profile', {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please login to view your profile');
            router.push('/farmer/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setFarmer(data.farmer);
      } catch (error) {
        console.error('Error fetching farmer profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerProfile();
  }, [router]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (!farmer) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Account not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please make sure you are logged in.
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <FarmerProfile farmer={farmer} />
    </DefaultLayout>
  );
};

export default FarmerProfilePage;
