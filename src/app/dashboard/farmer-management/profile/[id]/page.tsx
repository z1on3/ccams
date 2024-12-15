// app/dashboard/farmer-management/profile/page.tsx
"use client";
import { Farmer } from "@/types/farmer";
import FarmerProfile from "@/components/Dashboard/farmer-profile";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MainLayout from "@/components/Layouts/MainLayout";

const FarmerPage = ({ params }: { params: { id: string } }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const response = await fetch(`/api/farmers/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch farmer data');
        }
        const data = await response.json();
        setFarmer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching farmer:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmer();
  }, [params.id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !farmer) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">
            {error || 'Farmer not found'}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Farmer Profile" />
        <FarmerProfile farmer={farmer} />
      </div>
    </MainLayout>
  );
};

export default FarmerPage;
