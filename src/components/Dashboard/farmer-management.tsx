"use client";
import React from "react";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import FarmersTable from "../Tables/table-farmers";

const FarmerManagement: React.FC = () => {
  return (
    <>
      <DataStatsOne />
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <FarmersTable />
      </div>
    </>
  );
};

export default FarmerManagement;
