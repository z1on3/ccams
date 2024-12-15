'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ButtonDefault from '../Buttons/ButtonDefault';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Farmer {
  id: string;
  name: string;
  image: string;
  farm_location: string;
  land_size: string;
  income: number;
  crops: Array<{ name: string; season: string; }>;
}

interface AidProgram {
  id: number;
  name: string;
  category: string;
  resource_allocation: {
    type: string;
    quantity: number;
    budget: number;
  };
  assigned_barangay: string;
}

const AidDistribution = ({ programId }: { programId: string }) => {
  const router = useRouter();
  const [program, setProgram] = useState<AidProgram | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState<Set<string>>(new Set());
  const [farmerQuantities, setFarmerQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch program details
        const programRes = await fetch(`/api/aid-programs/${programId}`);
        if (!programRes.ok) {
          const errorData = await programRes.json();
          throw new Error(errorData.error || 'Failed to fetch program');
        }
        const programData = await programRes.json();
        setProgram(programData);

        // Fetch eligible farmers
        const farmersRes = await fetch(`/api/aid-programs/${programId}/eligible-farmers`);
        if (!farmersRes.ok) {
          const errorData = await farmersRes.json();
          throw new Error(errorData.error || 'Failed to fetch farmers');
        }
        const farmersData = await farmersRes.json();
        setFarmers(farmersData);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farm_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFarmerSelection = (farmerId: string) => {
    const newSelected = new Set(selectedFarmers);
    if (newSelected.has(farmerId)) {
      newSelected.delete(farmerId);
    } else {
      newSelected.add(farmerId);
    }
    setSelectedFarmers(newSelected);
  };

  const handleQuantityChange = (farmerId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFarmerQuantities(prev => ({
      ...prev,
      [farmerId]: numValue
    }));
  };

  const handleDistribute = async () => {
    if (selectedFarmers.size === 0) {
      toast.warning('Please select farmers first');
      return;
    }

    try {
      const selectedFarmersData = Array.from(selectedFarmers).map(farmerId => ({
        farmerId,
        quantity: farmerQuantities[farmerId] || (program?.resource_allocation.quantity || 0)
      }));

      const response = await fetch(`/api/aid-programs/${programId}/distribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distributions: selectedFarmersData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to distribute aid');
      }

      toast.success('Aid distributed successfully');
      router.push('/dashboard/aid-management');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to distribute aid');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center text-red-500">
          {error || 'Program not found'}
        </div>
        <ButtonDefault
          label="Back to Aid Programs"
          onClick={() => router.push('/dashboard/aid-management')}
          customClasses="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Distribute {program.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select eligible farmers to distribute aid
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search farmers..."
            className="rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ButtonDefault
          label="Distribute Aid"
          onClick={handleDistribute}
          customClasses={`px-6 py-3 rounded-lg ${
            selectedFarmers.size > 0
              ? 'bg-green-light text-white dark:bg-green'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={selectedFarmers.size === 0}
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray dark:bg-gray-dark">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFarmers(new Set(farmers.map(f => f.id)));
                    } else {
                      setSelectedFarmers(new Set());
                    }
                  }}
                  checked={selectedFarmers.size === farmers.length}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </th>
              <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
                Farmer Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Farm Location
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Land Size
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Income
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Crops
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer, index) => (
                <tr 
                  key={farmer.id} 
                  className={`${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <td className="py-5 px-4 dark:border-strokedark">
                    <input
                      type="checkbox"
                      checked={selectedFarmers.has(farmer.id)}
                      onChange={() => toggleFarmerSelection(farmer.id)}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center">
                      <Image 
                        src={farmer.image?.startsWith('/') ? farmer.image : '/images/user/default-user.png'} 
                        width={50} 
                        height={50} 
                        alt={farmer.name} 
                        className="rounded-full mr-3"
                      />
                      <span>{farmer.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {farmer.farm_location}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {farmer.land_size}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    ₱{farmer.income.toLocaleString()}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {farmer.crops.map(crop => crop.name).join(", ")}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {selectedFarmers.has(farmer.id) && (
                      <input
                        type="number"
                        min="0"
                        step={program?.category === 'Financial Assistance' ? '500' : '1'}
                        value={farmerQuantities[farmer.id] || (program?.resource_allocation.quantity || 0)}
                        onChange={(e) => handleQuantityChange(farmer.id, e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                        placeholder={program?.category === 'Financial Assistance' ? 'Amount' : 'Quantity'}
                      />
                    )}
                    {program?.category === 'Financial Assistance' ? ' ₱' : ` ${program?.resource_allocation.type || ''}`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No eligible farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AidDistribution; 