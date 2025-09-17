import React, { useState, useMemo } from 'react';
import { Job, JobStatus } from '../types/Job';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

interface Props {
    jobs: Job[];
    onUpdateStatus?: (id: number, status: JobStatus) => void;
}

type SortField = keyof Pick<Job, 'title' | 'company' | 'location' | 'dateApplied' | 'status'>;
type SortDirection = 'asc' | 'desc';

const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
};

const JobTable: React.FC<Props> = ({ jobs, onUpdateStatus }) => {
    const [sortField, setSortField] = useState<SortField>('dateApplied');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>('All');

    const sortedAndFilteredJobs = useMemo(() => {
        return jobs
            .filter(job => {
                const matchesSearch = 
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                const modifier = sortDirection === 'asc' ? 1 : -1;
                
                if (aValue < bValue) return -1 * modifier;
                if (aValue > bValue) return 1 * modifier;
                return 0;
            });
    }, [jobs, sortField, sortDirection, searchTerm, statusFilter]);

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (field !== sortField) return null;
        return sortDirection === 'asc' ? (
            <ArrowUpIcon className="h-4 w-4 inline ml-1" />
        ) : (
            <ArrowDownIcon className="h-4 w-4 inline ml-1" />
        );
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <div className="relative rounded-md shadow-sm max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mt-3 sm:ml-4 sm:mt-0">
                    <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'All')}
                            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                onClick={() => handleSort('title')}
                            >
                                Title {getSortIcon('title')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                onClick={() => handleSort('company')}
                            >
                                Company {getSortIcon('company')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                onClick={() => handleSort('location')}
                            >
                                Location {getSortIcon('location')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                onClick={() => handleSort('dateApplied')}
                            >
                                Applied {getSortIcon('dateApplied')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                Status {getSortIcon('status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {sortedAndFilteredJobs.map(job => (
                            <tr key={job.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {job.title}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {job.company}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {job.location}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(job.dateApplied).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                    {onUpdateStatus ? (
                                        <select
                                            value={job.status}
                                            onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatus)}
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Offer">Offer</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
                                            {job.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedAndFilteredJobs.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    No jobs found matching your criteria
                </div>
            )}
        </div>
    );
};

export default JobTable;
