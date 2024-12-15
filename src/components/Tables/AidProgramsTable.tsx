"use client";

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ButtonDefault from '../Buttons/ButtonDefault';
import AidProgramForm from '../Forms/AidProgramForm';
import { useRouter } from 'next/navigation';

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
  remaining?: string;
}

const AidProgramsTable = () => {
  const [data, setData] = useState<AidProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<AidProgram | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/aid-programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const result = await response.json();
      
      // Fetch remaining quantities for each program
      const programsWithRemaining = await Promise.all(
        result.map(async (program: AidProgram) => {
          const res = await fetch(`/api/aid-programs/${program.id}/beneficiaries`);
          if (res.ok) {
            const details = await res.json();
            return { ...program, remaining: details.remaining };
          }
          return program;
        })
      );
      
      setData(programsWithRemaining);
    } catch (error) {
      console.error('Error:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (program: AidProgram) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this aid program?')) {
      try {
        await fetch('/api/aid-programs', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        fetchPrograms();
      } catch (error) {
        console.error('Failed to delete aid program:', error);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const method = selectedProgram ? 'PUT' : 'POST';
      const body = selectedProgram ? { ...values, id: selectedProgram.id } : values;

      await fetch('/api/aid-programs', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      setIsModalOpen(false);
      setSelectedProgram(null);
      fetchPrograms();
    } catch (error) {
      console.error('Failed to save aid program:', error);
    }
  };

  const filteredData = data?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.assigned_barangay.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Aid Programs List
        </h4>
        <div className="flex gap-2 2xsm:gap-4">
          <ButtonDefault
            label="Add Program"
            onClick={() => setIsModalOpen(true)}
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
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Program Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Category
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Quantity/Amount
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Remaining
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Assigned Barangay
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((program, index) => (
                    <tr key={program.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="py-5 px-4 pl-9 xl:pl-11 dark:border-strokedark">
                        {program.name}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {program.category}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {program.category === 'Financial Assistance'
                          ? `₱${parseInt(program.resource_allocation.budget as unknown as string).toLocaleString()}`
                          : `${program.resource_allocation.quantity} ${program.resource_allocation.type}`}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {program.remaining || 'Loading...'}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        {program.assigned_barangay}
                      </td>
                      <td className="py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-2">
                          <ButtonDefault
                            label="View"
                            onClick={() => router.push(`/dashboard/aid-management/program/${program.id}`)}
                            customClasses="bg-blue-light text-white dark:bg-blue px-4 py-2 rounded"
                          />
                          <ButtonDefault
                            label="Distribute"
                            onClick={() => router.push(`/dashboard/aid-management/distribute/${program.id}`)}
                            customClasses="bg-green-light text-white dark:bg-green px-4 py-2 rounded"
                          />
                          <ButtonDefault
                            label="Edit"
                            onClick={() => handleEdit(program)}
                            customClasses="bg-warning text-white px-4 py-2 rounded bg-orange-light dark:bg-orange"
                          />
                          <ButtonDefault
                            label="Delete"
                            onClick={() => handleDelete(program.id)}
                            customClasses="bg-danger text-white px-4 py-2 rounded bg-red-light dark:bg-red"
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
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AidProgramForm
            initialValues={selectedProgram}
            onSubmit={handleSubmit}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProgram(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AidProgramsTable; 