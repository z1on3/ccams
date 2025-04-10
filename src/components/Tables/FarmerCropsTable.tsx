import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { CropCount } from '@/types/cropcount';

const FarmerCropsTable = () => {
    const [data, setData] = useState<CropCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const [sortField, setSortField] = useState<keyof CropCount>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await fetch('/api/farmer-crops');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch farmer crops:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrops();
    }, []);

    const handleSort = (field: keyof CropCount) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(data.length / recordsPerPage);

    const SortIcon = ({ field }: { field: keyof CropCount }) => (
        <span className="inline-flex ml-1">
            {sortField === field ? (
                sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
            ) : (
                <div className="w-4 h-4 flex flex-col opacity-30">
                    <ChevronUpIcon className="w-4 h-2" />
                    <ChevronDownIcon className="w-4 h-2" />
                </div>
            )}
        </span>
    );

    return (
        <div className="col-span-12 flex flex-col justify-start rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
            <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
                    Farmer Crops
                </h4>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-green-light dark:bg-green">
                                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer" onClick={() => handleSort('name')}>
                                    Crop Name <SortIcon field="name" />
                                </th>
                                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer" onClick={() => handleSort('season')}>
                                    Season <SortIcon field="season" />
                                </th>
                                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer" onClick={() => handleSort('quantity')}>
                                    Quantity <SortIcon field="quantity" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((crop, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                                    <td className="py-5 px-4 dark:border-strokedark">{crop.name}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center">{crop.season}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center">{crop.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && data.length > 0 && (
                <div className="flex justify-between items-center mt-4 mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, data.length)} of {data.length} entries
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
                                className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}
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
    );
};

export default FarmerCropsTable;
