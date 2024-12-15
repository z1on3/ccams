"use client";

import { useState, useEffect } from 'react';
import ButtonDefault from '../Buttons/ButtonDefault';

interface FarmerAidRecord {
  id: number;
  farmer_name: string;
  program_name: string;
  program_category: string;
  quantity_received: string;
  distribution_date: string;
  status: string;
}

const FarmerAidRecordsTable = () => {
  const [data, setData] = useState<FarmerAidRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/aid-records');
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Failed to fetch aid records:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredData = data.filter(record => 
    record.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.program_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'distributed':
        return 'bg-success bg-opacity-10 text-success';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-danger bg-opacity-10 text-danger';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Farmer Aid Records
        </h4>
        <div className="flex gap-2 2xsm:gap-4">
          <input
            type="text"
            placeholder="Search records..."
            className="rounded-full border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <div className="">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray dark:bg-gray-dark">
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                    Farmer Name
                  </th>
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                    Aid Program
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Aid Type
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Quantity/Amount
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Distribution Date
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {record.farmer_name}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {record.program_name}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {record.program_category}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                      {record.program_category === 'Financial Assistance'
                          ? `₱${parseInt(record.quantity_received.substring(1) as unknown as string).toLocaleString()}`
                          : `${record.quantity_received}`}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {new Date(record.distribution_date).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-2">
                          <ButtonDefault
                            label="View"
                            onClick={() => {}}
                            customClasses="bg-green-light text-white dark:bg-green px-4 py-2 rounded"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerAidRecordsTable; 