import React, { useEffect, useState } from 'react';
import { getJobs, getJobStats } from '../services/JobService';
import { Job, JobStatus } from '../types/Job';
import PieChart from '../components/JobPieChart';
import {
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const statusColors = {
    Applied: 'text-blue-600',
    Interview: 'text-yellow-600',
    Offer: 'text-green-600',
    Rejected: 'text-red-600'
};

const Dashboard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [stats, setStats] = useState<Record<JobStatus, number>>({
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const [jobsData, statsData] = await Promise.all([
                getJobs(),
                getJobStats()
            ]);
            setJobs(jobsData);
            setStats(statsData);
        };
        fetchData();
    }, []);

    const recentJobs = jobs.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    ).slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                            <p className="mt-1 text-3xl font-semibold text-blue-600">{stats.Applied}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Interviews</h3>
                            <p className="mt-1 text-3xl font-semibold text-yellow-600">{stats.Interview}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Offers</h3>
                            <p className="mt-1 text-3xl font-semibold text-green-600">{stats.Offer}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Rejections</h3>
                            <p className="mt-1 text-3xl font-semibold text-red-600">{stats.Rejected}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="card bg-white">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
                    <div className="h-64">
                        <PieChart jobs={jobs} />
                    </div>
                </div>

                <div className="card bg-white">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h3>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            {recentJobs.map(job => (
                                <li key={job.id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {job.company}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {job.title}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                statusColors[job.status]
                                            } bg-${job.status.toLowerCase()}-100`}>
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
