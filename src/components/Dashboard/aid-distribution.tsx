'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ButtonDefault from '../Buttons/ButtonDefault';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

interface Farmer {
  id: string;
  name: string;
  image: string;
  farm_location: string;
  land_size: string;
  income: number;
  crops: Array<{ name: string; season: string; }>;
  farm_ownership_type: string;
  farmer_type: string[] | string;
}

interface AidProgram {
  id: number;
  name: string;
  category: string;
  resource_allocation: string;
  assigned_barangay: string;
  remaining: string;
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
  const [sortField, setSortField] = useState<keyof Farmer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedOwnershipType, setSelectedOwnershipType] = useState<string>('');
  const [selectedFarmerTypes, setSelectedFarmerTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch program details
        const programRes = await fetch(`/api/aid-programs/${programId}/beneficiaries`);
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

  const handleSort = (field: keyof Farmer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesOwnershipType = !selectedOwnershipType ||
      farmer.farm_ownership_type === selectedOwnershipType;

    const matchesFarmerType = selectedFarmerTypes.length === 0 ||
      selectedFarmerTypes.some(type => farmer.farmer_type.includes(type));

    return matchesSearch && matchesOwnershipType && matchesFarmerType;
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
        ? a.income - b.income
        : b.income - a.income;
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
  const parseNumericValue = (value: any): number => {
    const match = value.match(/[\d,]+/); // Extracts the first numeric part
    if (!match) return 0;

    return parseFloat(match[0].replace(/,/g, '')) || 0; // Remove commas and convert to number
  };

  const handleDistribute = async () => {
    if (selectedFarmers.size === 0) {
      toast.warning('Please select farmers first', { autoClose: 1000, });
      return;
    }



    try {
      const selectedFarmersData = Array.from(selectedFarmers).map(farmerId => ({
        farmerId,
        quantity: farmerQuantities[farmerId] || (program?.resource_allocation.quantity || 0)
      }));
      const totalQuantity = selectedFarmersData.reduce((sum, farmer) => sum + farmer.quantity, 0);
      const remainingQuantity = parseNumericValue(program?.remaining) || 0;

      if (totalQuantity > remainingQuantity) {
        toast.warning('Insufficient remaining quantity', { autoClose: 1000, });
        return;
      }
      console.log(totalQuantity);


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

  const handleFarmerTypeChange = (type: string) => {
    setSelectedFarmerTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const resource_allocation = program?.resource_allocation ? JSON.parse(program.resource_allocation) : null;

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
        <ToastContainer />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
          Distribute {program.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select eligible farmers to distribute aid
        </p>
            </div>
          <ButtonDefault
            label="Back to Aid Programs"
            onClick={() => router.push('/dashboard/aid-management')}
            customClasses="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          />
        </div>
      </div>
      <div className="mb-6">
        
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-sm bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-black dark:text-white">Category</h4>
            <p className="mt-1">{program.category}</p>
          </div>
          <div className="rounded-sm bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-black dark:text-white">Total {program.category === 'Financial Assistance' ? 'Budget' : 'Quantity'}</h4>
            <p className="mt-1">
              {program.category === 'Financial Assistance' 
                ? `₱${resource_allocation.budget.toLocaleString()}`
                : `${resource_allocation.quantity} ${resource_allocation.type}`}
            </p>
          </div>
          <div className="rounded-sm bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-black dark:text-white">Remaining</h4>
            <p className="mt-1">{program.remaining}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search farmers..."
            className="rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={selectedOwnershipType}
            onChange={(e) => setSelectedOwnershipType(e.target.value)}
            className="rounded-lg border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
          >
            <option value="">All Ownership Types</option>
            <option value="Land Owner">Land Owner</option>
            <option value="Tenant">Tenant</option>
          </select>

          <ButtonDefault
            label="Distribute Aid"
            onClick={handleDistribute}
            customClasses={`px-6 py-3 rounded-lg ${selectedFarmers.size > 0
                ? 'bg-green-light text-white dark:bg-green'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['Coconut Farmer', 'Rice Farmer', 'Fruit & Vegetables', 'Poultry Farmers'].map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedFarmerTypes.includes(type)}
                onChange={() => handleFarmerTypeChange(type)}
                className="form-checkbox h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{type}</span>
            </label>
          ))}
        </div>
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
                className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
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
              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('farm_ownership_type')}
              >
                Ownership Type <SortIcon field="farm_ownership_type" />
              </th>
              <th
                className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('farmer_type')}
              >
                Farmer Type <SortIcon field="farmer_type" />
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFarmers.length > 0 ? (
              sortedFarmers.map((farmer, index) => (
                <tr
                  key={farmer.id}
                  className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
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
                        style={{ objectFit: 'cover', height: '50px', width: '50px' }}
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
                    ₱{parseInt(farmer.income.toString()).toLocaleString('en-US')}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {farmer.crops.map(crop => crop.name).join(", ")}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                    {farmer.farm_ownership_type || 'N/A'}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                    {Array.isArray(farmer.farmer_type)
                      ? farmer.farmer_type.join(', ')
                      : (typeof farmer.farmer_type === 'string'
                        ? JSON.parse(farmer.farmer_type).join(', ')
                        : 'N/A')}
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
                <td colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-400">
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