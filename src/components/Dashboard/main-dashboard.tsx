"use client";
import React from "react";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import AidDistriOT from "../Charts/AidDistriOT";
import AidCategoriesChart from "../Charts/AidCategoriesChart";
import FarmerDemo from "../Charts/FarmerDemo";

const MainDash: React.FC = () => {
  return (
    <>
      <DataStatsOne />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <AidDistriOT />
        <AidCategoriesChart />
        <FarmerDemo />
      </div>
    </>
  );
};

export default MainDash;
