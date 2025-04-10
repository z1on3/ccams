'use client';

import { useState } from 'react';
import AidProgramsTable from '@/components/Tables/AidProgramsTable';
import FarmerAidRecordsTable from '@/components/Tables/FarmerAidRecordsTable';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import AidRequestsTable from '../Tables/AidRequestsTable';

const AidManagement = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'farmers' | 'requests'>('programs');

  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="flex space-x-4">
            <ButtonDefault
              label="Aid Programs"
              onClick={() => setActiveTab('programs')}
              customClasses={`px-6 py-2 rounded-lg ${activeTab === 'programs'
                ? 'bg-green-light text-white dark:bg-green'
                : 'bg-gray-2 text-gray-700 dark:bg-gray-dark dark:text-gray-300'
                }`}
            />
            <ButtonDefault
              label="Farmers Aid Records"
              onClick={() => setActiveTab('farmers')}
              customClasses={`px-6 py-2 rounded-lg ${activeTab === 'farmers'
                ? 'bg-green-light text-white dark:bg-green'
                : 'bg-gray-2 text-gray-700 dark:bg-gray-dark dark:text-gray-300'
                }`}
            />

            <ButtonDefault
              label="Aid Requests"
              onClick={() => setActiveTab('requests')}
              customClasses={`px-6 py-2 rounded-lg ${activeTab === 'requests'
                ? 'bg-green-light text-white dark:bg-green'
                : 'bg-gray-2 text-gray-700 dark:bg-gray-dark dark:text-gray-300'
                }`}
            />
          </div>
        </div>

        <div className="col-span-12">


          {activeTab === 'programs' ? (
            <AidProgramsTable />
          ) : activeTab === 'farmers' ? (
            <FarmerAidRecordsTable />
          ) : (
            <AidRequestsTable />
          )}

        </div>
      </div>
    </>
  );
};

export default AidManagement; 