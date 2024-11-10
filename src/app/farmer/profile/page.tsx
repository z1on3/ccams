// app/dashboard/farmer-management/profile/page.tsx
"use client"; // Ensure it's client-side rendered in Next.js
import { Farmer } from "@/types/farmer"; // Your farmer type
import FarmerProfile from "@/components/Dashboard/farmer-profile";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MainLayout from "@/components/Layouts/MainLayout";
import { Barangays } from "@/components/constants/barangays";
import PageLayout from "@/components/Layouts/PageLayout";

// Dummy data for farmers
const getRandomBarangay = () => {
  const randomIndex = Math.floor(Math.random() * Barangays.length);
  return Barangays[randomIndex];
};

// Dummy data for farmers
const farmerData: Farmer[] = [
  {
    id: "18273456",
    image: "/images/user/user-01.png",
    name: "Maria Santos",
    age: 45,
    birthday: new Date(1979, 4, 12),
    phone: 1234567890,
    email: 987654321,
    farm_location: getRandomBarangay().name,
    land_size: "2 hectares",
    crops: [
      { name: "Rice", season: "Wet" },
      { name: "Coconut", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 15000,
  },
  {
    id: "781212864",
    image: "/images/user/user-02.png",
    name: "Juan Dela Cruz",
    age: 50,
    birthday: new Date(1974, 6, 22),
    phone: 9876543210,
    email: 654321987,
    farm_location: getRandomBarangay().name,
    land_size: "3 hectares",
    crops: [
      { name: "Bananas", season: "Wet" },
      { name: "Corn", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 20000,
  },
  {
    id: "1828127",
    image: "/images/user/user-03.png",
    name: "Pedro Bautista",
    age: 35,
    birthday: new Date(1989, 9, 10),
    phone: 6543210987,
    email: 543219876,
    farm_location: "Casiguran",
    land_size: "1.5 hectares",
    crops: [
      { name: "Root Crops", season: "Wet" },
      { name: "Citrus Fruits", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 12000,
  },
  {
    id: "1825634",
    image: "/images/user/user-04.png",
    name: "Jose Reyes",
    age: 40,
    birthday: new Date(1984, 11, 3),
    phone: 4321098765,
    email: 321098765,
    farm_location: getRandomBarangay().name,
    land_size: "4 hectares",
    crops: [
      { name: "Coffee", season: "Wet" },
      { name: "Coconut", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 25000,
  },
  {
    id: "1234856",
    image: "/images/user/user-05.png",
    name: "Lucia Gomez",
    age: 30,
    birthday: new Date(1994, 2, 14),
    phone: 2109876543,
    email: 109876543,
    farm_location: getRandomBarangay().name,
    land_size: "1 hectare",
    crops: [
      { name: "Peanuts", season: "Wet" },
      { name: "Abaca", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 10000,
  },
  // Add more dummy farmers as needed...
];


interface FarmerPageProps {
  farmer: Farmer | null;
}

const FarmerProfilePage = ({ params }: { params: { id: string } }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    // Simulate fetching the farmer data based on the ID
    //This is placeholder for now.
    const fetchedFarmer = farmerData[0];
    setFarmer(fetchedFarmer || null);
  }, [params.id]);

  if (!farmer) {
    return <div>Account not found.</div>;
  }

  return (
  <>



    <DefaultLayout><FarmerProfile farmer={farmer} /></DefaultLayout>
      


    </>
  );
};

export default FarmerProfilePage;
