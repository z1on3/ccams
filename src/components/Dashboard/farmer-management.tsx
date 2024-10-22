"use client";
import React from "react";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import MapOne from "../Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import FarmerDemo from "../Charts/FarmerDemo";
import AidDistriOT from "../Charts/AidDistriOT";
import FarmersTable from "../Tables/table-farmers";
import SearchForm from "../Header/SearchForm";
import SearchFarmer from "./search-farmer";

const FarmerManagement: React.FC = () => {
  return (
    <>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <FarmersTable/>
      </div>
      
    </>
  );
};

export default FarmerManagement;
