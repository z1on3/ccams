"use client"; // Ensure it's client-side rendered in Next.js

import React from "react";
import Image from "next/image";
import { Camera, Edit, Pencil } from "lucide-react"; // Importing icons from lucide-react
import { Farmer } from "@/types/farmer"; // Assuming the Farmer type is defined correctly
import { usePathname } from "next/navigation";

interface FarmerProfileProps {
  farmer: Farmer; // Accept the farmer object as a prop
}

const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmer }) => {
  const pathname = usePathname();
  const { image, name, farm_location, crops, income } = farmer;

  // Ensure image path has leading slash
  const farmerImage = image?.startsWith('/') ? image : '/images/user/default-user.png';

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="relative z-20 h-35 md:h-65" >
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-100 rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
          <label
            htmlFor="cover"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              className="sr-only"
              accept="image/png, image/jpg, image/jpeg"
            />
            <span>
              <Camera className="text-white" />
            </span>
            <span>Edit</span>
          </label>
        </div>
      </div>
      <div className="px-10 pb-6 text-center lg:pb-8 xl:pb-11.5">
        
        <div className="relative z-30 mx-auto -mt-14 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-cover bg-center">
          <Image
            src={farmerImage}
            alt={name}
            className="object-cover"
            width={120}
            height={120}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
       
        <h4 className="mt-4 text-2xl font-bold text-body-dark dark:text-body-light">{name}</h4>
        <p className="mt-1 text-base font-normal text-body-sm dark:text-body-light">
          {farm_location}
        </p>
        <p className="mt-2 text-sm text-body-light dark:text-body-dark">
          Income: PHP {income.toLocaleString()}
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
  {/* Wet Season Crops */}
  <div className="w-full max-w-lg">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Wet Season Crops</h3>
    <div className="flex justify-center flex-wrap gap-2">
      {crops
        .filter((crop) => crop.season.toLowerCase() === "wet")
        .map((crop, index) => (
          <span
            key={index}
            className="rounded-md bg-blue-200 px-2 py-1 text-sm font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-100"
          >
            {crop.name}
          </span>
        ))}
    </div>
  </div>

  {/* Dry Season Crops */}
  <div className="w-full max-w-lg">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Dry Season Crops</h3>
    <div className="flex justify-center flex-wrap gap-2">
      {crops
        .filter((crop) => crop.season.toLowerCase() === "dry")
        .map((crop, index) => (
          <span
            key={index}
            className="rounded-md bg-yellow-200 px-2 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
          >
            {crop.name}
          </span>
        ))}
    </div>
  </div>
</div>


        <div className="w-full flex justify-center mt-4">
          <label
            htmlFor="cover"
            className="w-fit flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              className="sr-only"
              accept="image/png, image/jpg, image/jpeg"
            />
            <span>
              <Pencil/>
            </span>
            <span>Edit Info</span>
          </label>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-left mb-6">Farm Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      
        <div className="relative">
        <img
            src="https://via.placeholder.com/300?text=Add%20Photo"
            alt="Placeholder with plus sign"

            width={300}
            height={300}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
            <span className="text-white font-bold text-xl">Upload Image</span>
          </div>
        </div>
      
        {Array.from({ length: Math.floor(Math.random() * (16 - 4 + 1)) + 4 }).map((_, index) => (
          <div key={index} className="relative">
                        <img
              src={`https://via.placeholder.com/300?text=Image+${index + 1}`}
              alt={`Placeholder Image ${index + 1}`}

              width={300}
              height={300}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
              <span className="text-white font-bold text-xl">View</span>
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>
      
    </div>
  );
};

export default FarmerProfile;
