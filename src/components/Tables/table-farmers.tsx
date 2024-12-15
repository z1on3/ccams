"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Farmer } from "@/types/farmer";
import ButtonDefault from "../Buttons/ButtonDefault";
import { Plus } from "lucide-react";
import AddFarmerModal from "../Modals/AddFarmer";

const FarmersTable = () => {
  const [data, setData] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);

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

  // Function to filter farmers based on the search term
  const filteredFarmers = data.filter(farmer => {
    return (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.crops.some(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
                    Farmer Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Farm Location
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Land Size
                  </th>
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                    Crops
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.length > 0 ? (
                  filteredFarmers.map((farmer, index) => (
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
                    <td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
