import React, { useState, useEffect } from 'react';
import { addJob } from '../services/JobService';
import { getCandidates } from '../services/CandidateService';
import { useNavigate } from 'react-router-dom';
import { JobStatus } from '../types/Job';

const AddJob: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        status: 'Applied' as JobStatus,
        salary: '',
        notes: '',
        contactName: '',
        contactEmail: '',
        nextSteps: '',
        dateApplied: new Date().toISOString().split('T')[0],
        candidateId: undefined as number | undefined
    });

    const [candidates, setCandidates] = useState<Array<any>>([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCandidates();
                setCandidates(data || []);
            } catch (e) {}
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const jobData = {
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        await addJob(jobData as any);
        navigate('/jobs');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Add New Job Application
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Job Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                                Application Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="candidateId" className="block text-sm font-medium leading-6 text-gray-900">Candidate (optional)</label>
                            <select name="candidateId" id="candidateId" value={formData.candidateId ?? ''} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                                <option value="">-- Select candidate --</option>
                                {candidates.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                                Salary Range
                            </label>
                            <input
                                type="text"
                                name="salary"
                                id="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g., $80,000 - $100,000"
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="dateApplied" className="block text-sm font-medium leading-6 text-gray-900">
                                Date Applied
                            </label>
                            <input
                                type="date"
                                name="dateApplied"
                                id="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="contactName" className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                name="contactName"
                                id="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="contactEmail" className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                id="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                id="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="nextSteps" className="block text-sm font-medium leading-6 text-gray-900">
                                Next Steps
                            </label>
                            <input
                                type="text"
                                name="nextSteps"
                                id="nextSteps"
                                value={formData.nextSteps}
                                onChange={handleChange}
                                placeholder="e.g., Follow up next week, Technical interview scheduled"
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Save Job Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;
