'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ButtonDefault from '../Buttons/ButtonDefault';

interface Beneficiary {
  name: string;
  quantity_received: string;
  distribution_date: string;
  status: string;
}

interface ProgramData {
  id: number;
  name: string;
  category: string;
  resource_allocation: string;
  beneficiaries: Beneficiary[];
  remaining: string;
  total_distributed: string;
}

const ProgramDetails = ({ programId }: { programId: string }) => {
  const router = useRouter();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(`/api/aid-programs/${programId}/beneficiaries`);
        if (!response.ok) {
          throw new Error('Failed to fetch program details');
        }
        const data = await response.json();
        setProgram(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId]);

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

  const resource_allocation = JSON.parse(program.resource_allocation);

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            {program.name}
          </h2>
          <ButtonDefault
            label="Back to Aid Programs"
            onClick={() => router.push('/dashboard/aid-management')}
            customClasses="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          />
        </div>
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

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray dark:bg-gray-dark">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Beneficiary Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Quantity/Amount Received
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Distribution Date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {program.beneficiaries.length > 0 ? (
              program.beneficiaries.map((beneficiary, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                    {beneficiary.name}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                  {program.category === 'Financial Assistance'
                          ? `₱${parseInt(beneficiary.quantity_received.substring(1) as unknown as string).toLocaleString()}`
                          : `${beneficiary.quantity_received}`}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                    {new Date(beneficiary.distribution_date).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark text-center">
                    <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${
                      beneficiary.status.toLowerCase() === 'distributed'
                        ? 'bg-success bg-opacity-10 text-success'
                        : 'bg-warning bg-opacity-10 text-warning'
                    }`}>
                      {beneficiary.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No beneficiaries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProgramDetails; 