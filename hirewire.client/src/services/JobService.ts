import { Job, JobStatus } from '../types/Job';

const API_BASE = "http://localhost:5035/api/jobs"; // your backend

// Get all jobs
export const getJobs = async (): Promise<Job[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
};

// Add new job
export const addJob = async (job: Omit<Job, 'id' | 'lastUpdated'>): Promise<Job> => {
    const payload = {
        ...job,
        status: job.status as 'Applied' | 'Interview' | 'Offer' | 'Rejected',
        dateApplied: job.dateApplied || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
    };

    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // IMPORTANT: top-level object
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Backend error:", error);
        throw new Error("Failed to create job");
    }

    return res.json();
};



// Update job
export const updateJob = async (id: number, updates: Partial<Job>): Promise<Job> => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, id }),
    });
    if (!res.ok) throw new Error("Failed to update job");
    return res.json();
};

// Get job stats
export const getJobStats = async (): Promise<Record<JobStatus, number>> => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    const data = await res.json();

    // Convert from { status, count }[] into { Applied, Interview, Offer, Rejected }
    const stats: Record<JobStatus, number> = {
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
    };
    data.statusBreakdown.forEach((item: { status: JobStatus; count: number }) => {
        stats[item.status] = item.count;
    });
    return stats;
};
