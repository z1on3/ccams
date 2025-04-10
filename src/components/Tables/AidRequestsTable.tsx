"use client";

import { useState, useEffect } from 'react';
import ButtonDefault from '../Buttons/ButtonDefault';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

interface AidRequest {
    id: number;
    farmer_name: string;
    category: string;
    req_note: string;
    program_name: string;
    quantity_received: string;
    request_date: string;
    distribution_date: string | null;
    status: string;
}

const AidRequestsTable = () => {
    const [data, setData] = useState<AidRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof AidRequest>('request_date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('/api/aid-requests');
                const result = await response.json();
                setData(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('Failed to fetch aid requests:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const handleSort = (field: keyof AidRequest) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredData = data.filter((record) =>
        record.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.program_name && record.program_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRecords = [...filteredData].sort((a, b) => {
        if (sortField === 'quantity_received') {
            const aValue = parseFloat(a.quantity_received.replace(/[^\d.]/g, '')) || 0;
            const bValue = parseFloat(b.quantity_received.replace(/[^\d.]/g, '')) || 0;
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (sortField === 'request_date' || sortField === 'distribution_date') {
            const aDate = a[sortField] ? new Date(a[sortField] as string).getTime() : 0;
            const bDate = b[sortField] ? new Date(b[sortField] as string).getTime() : 0;
            return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }

        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

    const SortIcon = ({ field }: { field: keyof AidRequest }) => (
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
            case 'Distributed':
                return 'bg-success bg-opacity-10 text-success';
            case 'Pending':
                return 'bg-warning bg-opacity-10 text-warning';
            case 'Cancelled':
                return 'bg-danger bg-opacity-10 text-danger';
            default:
                return 'bg-gray-500 bg-opacity-10 text-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-body-2xlg font-bold text-dark dark:text-white">Aid Requests</h4>
                <input
                    type="text"
                    placeholder="Search aid requests..."
                    className="rounded-full border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray dark:bg-gray-dark">
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('farmer_name')}>Farmer Name <SortIcon field="farmer_name" /></th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer">Request Note</th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('category')}>Aid Category <SortIcon field="category" /></th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('program_name')}>Aid Program <SortIcon field="program_name" /></th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('quantity_received')}>Quantity/Amount <SortIcon field="quantity_received" /></th>

                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('distribution_date')}>Distribution Date <SortIcon field="distribution_date" /></th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('request_date')}>Request Date <SortIcon field="request_date" /></th>
                                <th
                                    className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                                <th
                                    className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                                    >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((record, index) => (
                                <tr key={record.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                                    <td className="py-5 px-4 dark:border-strokedark">{record.farmer_name}</td>
                                    <td className="py-5 px-4 dark:border-strokedark">{record.req_note}</td>
                                    <td className="py-5 px-4 dark:border-strokedark">{record.category}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center">{record.program_name || "PENDING"}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center">{record.quantity_received || "PENDING"}</td>

                                    <td className="py-5 px-4 dark:border-strokedark text-center">{record.distribution_date ? formatDate(record.distribution_date) : "PENDING"}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center">{formatDate(record.request_date)}</td>
                                    <td className="py-5 px-4 dark:border-strokedark text-center"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>{record.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>
            )}

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
                                className={`px-3 py-1 rounded border ${currentPage === page
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
    );
};

export default AidRequestsTable;
