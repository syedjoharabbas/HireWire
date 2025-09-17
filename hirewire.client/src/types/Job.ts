export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    status: JobStatus;
    dateApplied: string;
    salary?: string;
    notes?: string;
    contactName?: string;
    contactEmail?: string;
    nextSteps?: string;
    lastUpdated: string;
}

