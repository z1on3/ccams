"use client";

import MainLayout from "@/components/Layouts/MainLayout";
import FarmersTable from "@/components/Tables/table-farmers";
import FarmerAidRecordsTable from "@/components/Tables/FarmerAidRecordsTable";
import DataStatsOne from "@/components/DataStats/DataStatsOne";

export default function FarmerManagement() {
  return (
    <MainLayout>
      <DataStatsOne />
      <div className="mt-6 grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
      
        <div className="col-span-12">
          <FarmersTable />
        </div>

      </div>
    </MainLayout>
  );
}
