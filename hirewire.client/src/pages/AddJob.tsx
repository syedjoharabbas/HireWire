import React, { useState, useEffect } from 'react';
import { addJob } from '../services/JobService';
import { getCandidates } from '../services/CandidateService';
import { useNavigate } from 'react-router-dom';
import { JobStatus } from '../types/Job';
import { Input, Select, Textarea } from '../components/FormControls';
import { useToast } from '../components/Toast';

type FormDataType = {
    title: string;
    company: string;
    location: string;
    status: JobStatus;
    salary: string;
    notes: string;
    contactName: string;
    contactEmail: string;
    nextSteps: string;
    dateApplied: string;
    candidateId?: number | undefined;
};

const DRAFT_KEY = 'addJobDraft';

const AddJob: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState<FormDataType>(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) return JSON.parse(raw) as FormDataType;
        } catch {}
        return {
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
            candidateId: undefined
        } as FormDataType;
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
        setFormData(prev => {
            const next = ({ ...prev, [name]: value });
            try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const jobData = {
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        try {
            await addJob(jobData as any);
            try { localStorage.removeItem(DRAFT_KEY); } catch {}
            toast.push('Job saved', 'success');
            navigate('/jobs');
        } catch (err: any) {
            toast.push(err?.message || 'Failed to save job', 'error');
        }
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

            <form onSubmit={handleSubmit} className="lux-card">
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Job Title
                            </label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                                Company Name
                            </label>
                            <Input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                Location
                            </label>
                            <Input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                                Application Status
                            </label>
                            <Select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </Select>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="candidateId" className="block text-sm font-medium leading-6 text-gray-900">Candidate (optional)</label>
                            <Select name="candidateId" id="candidateId" value={formData.candidateId ?? ''} onChange={handleChange}>
                                <option value="">-- Select candidate --</option>
                                {candidates.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                            </Select>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                                Salary Range
                            </label>
                            <Input
                                type="text"
                                name="salary"
                                id="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g., $80,000 - $100,000"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="dateApplied" className="block text-sm font-medium leading-6 text-gray-900">
                                Date Applied
                            </label>
                            <Input
                                type="date"
                                name="dateApplied"
                                id="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="contactName" className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Name
                            </label>
                            <Input
                                type="text"
                                name="contactName"
                                id="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="contactEmail" className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Email
                            </label>
                            <Input
                                type="email"
                                name="contactEmail"
                                id="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                                Notes
                            </label>
                            <Textarea
                                name="notes"
                                id="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="nextSteps" className="block text-sm font-medium leading-6 text-gray-900">
                                Next Steps
                            </label>
                            <Input
                                type="text"
                                name="nextSteps"
                                id="nextSteps"
                                value={formData.nextSteps}
                                onChange={handleChange}
                                placeholder="e.g., Follow up next week, Technical interview scheduled"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={() => { try { localStorage.removeItem(DRAFT_KEY); } catch {} navigate('/jobs'); }}
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="lux-btn px-3 py-2 text-sm font-semibold"
                    >
                        Save Job Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;
