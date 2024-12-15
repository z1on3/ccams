"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Farmer } from "@/types/farmer";
import ButtonDefault from "../Buttons/ButtonDefault";
import { Plus, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import AddFarmerModal from "../Modals/AddFarmer";

const FarmersTable = () => {
  const [data, setData] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Farmer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch farmers data
  const fetchFarmers = async () => {
    try {
      const response = await fetch('/api/farmers');
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  // Toggle function
  const openAddFarmerModal = () => setIsAddFarmerModalOpen(true);
  const closeAddFarmerModal = () => {
    setIsAddFarmerModalOpen(false);
    fetchFarmers(); // Refresh the list after closing the modal
  };

  const handleSort = (field: keyof Farmer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to filter farmers based on the search term
  const filteredFarmers = data.filter(farmer => {
    return (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.crops.some(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Sort farmers
  const sortedFarmers = [...filteredFarmers].sort((a, b) => {
    if (sortField === 'crops') {
      const aCrops = a.crops.map(c => c.name).join(', ');
      const bCrops = b.crops.map(c => c.name).join(', ');
      return sortDirection === 'asc' 
        ? aCrops.localeCompare(bCrops)
        : bCrops.localeCompare(aCrops);
    }

    if (sortField === 'income') {
      return sortDirection === 'asc'
        ? parseInt(a.income.toString()) - parseInt(b.income.toString())
        : parseInt(b.income.toString()) - parseInt(a.income.toString());
    }

    if (sortField === 'land_size') {
      // Convert land size to square meters for comparison
      const convertToSqm = (size: string): number => {
        const value = parseFloat(size.replace(/[^\d.]/g, '')) || 0;
        const unit = size.toLowerCase();
        
        if (unit.includes('hectare') || unit.includes('ha')) {
          return value * 10000; // 1 hectare = 10000 sqm
        } else if (unit.includes('acre')) {
          return value * 4046.86; // 1 acre = 4046.86 sqm
        } else if (unit.includes('sqm') || unit.includes('sq m') || unit.includes('m2')) {
          return value; // already in sqm
        } else {
          return value; // default to original value if unit not recognized
        }
      };

      const aSize = convertToSqm(a.land_size);
      const bSize = convertToSqm(b.land_size);
      
      return sortDirection === 'asc'
        ? aSize - bSize
        : bSize - aSize;
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
  const currentRecords = sortedFarmers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedFarmers.length / recordsPerPage);

  const SortIcon = ({ field }: { field: keyof Farmer }) => (
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Farmers List
        </h4>
        <div className="flex gap-2 2xsm:gap-4">
          <ButtonDefault
            label="Add Farmer"
            onClick={openAddFarmerModal}
            customClasses="rounded-full py-3 pl-5 pr-5 bg-green-light text-white focus:border-primary focus:outline-none dark:bg-green dark:text-white dark:focus:border-primary"
          >
            <Plus />
          </ButtonDefault>

          <input
            type="text"
            placeholder="Search..."
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
                    className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Farmer Name <SortIcon field="name" />
                  </th>
                  <th 
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('farm_location')}
                  >
                    Farm Location <SortIcon field="farm_location" />
                  </th>
                  <th 
                    className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('land_size')}
                  >
                    Land Size <SortIcon field="land_size" />
                  </th>
                  <th 
                    className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('income')}
                  >
                    Income <SortIcon field="income" />
                  </th>
                  <th 
                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                    onClick={() => handleSort('crops')}
                  >
                    Crops <SortIcon field="crops" />
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((farmer, index) => (
                    <tr key={farmer.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center">
                          <Image
                            src={farmer.image?.startsWith('/') ? farmer.image : '/images/logo/logo-circle.png'}
                            width={80}
                            height={80}
                            alt={farmer.name}
                            className="rounded-full mr-3 object-cover"
                            style={{
                              width: '50px',
                              height: '50px',
                            }}
                          />
                          <span>{farmer.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark text-center">
                        {farmer.farm_location}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark text-center">
                        {farmer.land_size}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark text-center">
                        ₱{parseInt(farmer.income.toString()).toLocaleString('en-US')}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark text-center">
                        {farmer.crops && farmer.crops.length > 0
                          ? farmer.crops.map(crop => crop.name).join(", ")
                          : "No crops"}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-2">
                          <ButtonDefault
                            link={`/dashboard/farmer-management/profile/${farmer.id}`}
                            label="View"
                            customClasses="bg-green-light text-white dark:bg-green px-4 py-2 rounded"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {!isLoading && sortedFarmers.length > 0 && (
              <div className="flex justify-between items-center mt-4 mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedFarmers.length)} of {sortedFarmers.length} entries
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

      {isAddFarmerModalOpen && (
        <AddFarmerModal onClose={closeAddFarmerModal} />
      )}
    </div>
  );
};

export default FarmersTable;
