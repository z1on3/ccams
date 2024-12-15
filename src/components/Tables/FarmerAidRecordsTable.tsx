"use client";

import { useState, useEffect } from 'react';
import ButtonDefault from '../Buttons/ButtonDefault';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

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
  const [sortField, setSortField] = useState<keyof FarmerAidRecord>('distribution_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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

  const handleSort = (field: keyof FarmerAidRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(record => 
    record.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.program_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort records
  const sortedRecords = [...filteredData].sort((a, b) => {
    if (sortField === 'quantity_received') {
      // Handle financial assistance amounts
      const aValue = a.program_category === 'Financial Assistance' 
        ? parseFloat(a.quantity_received.substring(1).replace(/,/g, ''))
        : parseFloat(a.quantity_received) || 0;
      const bValue = b.program_category === 'Financial Assistance'
        ? parseFloat(b.quantity_received.substring(1).replace(/,/g, ''))
        : parseFloat(b.quantity_received) || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (sortField === 'distribution_date') {
      const aDate = new Date(a.distribution_date).getTime();
      const bDate = new Date(b.distribution_date).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }

    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const SortIcon = ({ field }: { field: keyof FarmerAidRecord }) => (
    <span className="inline-flex ml-1">
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )
      ) : (
        <div className="w-4 h-4 flex flex-col opacity-30">
          <ChevronUpIcon className="w-4 h-2" />
          <ChevronDownIcon className="w-4 h-2" />
        </div>
      )}
    </span>
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'distributed':
        return 'bg-success bg-opacity-10 text-success';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'cancelled':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
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
                  <th 
                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('farmer_name')}
                  >
                    Farmer Name <SortIcon field="farmer_name" />
                  </th>
                  <th 
                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('program_name')}
                  >
                    Aid Program <SortIcon field="program_name" />
                  </th>
                  <th 
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('program_category')}
                  >
                    Aid Type <SortIcon field="program_category" />
                  </th>
                  <th 
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('quantity_received')}
                  >
                    Quantity/Amount <SortIcon field="quantity_received" />
                  </th>
                  <th 
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('distribution_date')}
                  >
                    Distribution Date <SortIcon field="distribution_date" />
                  </th>
                  <th 
                    className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status <SortIcon field="status" />
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record, index) => (
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

            {/* Pagination Controls */}
            {!isLoading && sortedRecords.length > 0 && (
              <div className="flex justify-between items-center mt-4 mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedRecords.length)} of {sortedRecords.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerAidRecordsTable; 