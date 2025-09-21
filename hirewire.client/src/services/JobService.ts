import { Job, JobStatus } from '../types/Job';

const API_BASE = "http://localhost:5035/api";
const AUTH_BASE = `${API_BASE}/authentication`;
const JOBS_BASE = `${API_BASE}/jobs`;

// ---------------------- Authentication ----------------------
export const registerUser = async (username: string, password: string): Promise<void> => {
    const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());
};

export const loginUser = async (username: string, password: string): Promise<string> => {
    const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());

    const { token } = await res.json();
    localStorage.setItem("jwt", token); // store token
    return token;
};

// ---------------------- Fetch Wrapper with JWT ----------------------
const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("jwt");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }
    return res.json();
};

// ---------------------- Jobs Service ----------------------
export const getJobs = async (): Promise<Job[]> => authFetch(JOBS_BASE);

export const addJob = async (job: Omit<Job, 'id' | 'lastUpdated'>): Promise<Job> => {
    const payload = {
        ...job,
        status: job.status as 'Applied' | 'Interview' | 'Offer' | 'Rejected',
        dateApplied: job.dateApplied || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
    };
    return authFetch(JOBS_BASE, { method: "POST", body: JSON.stringify(payload) });
};

export const updateJob = async (id: number, updates: Partial<Job>): Promise<Job> => {
    return authFetch(`${JOBS_BASE}/${id}`, { method: "PUT", body: JSON.stringify({ ...updates, id }) });
};

export const getJobStats = async (): Promise<Record<JobStatus, number>> => {
    const data = await authFetch(`${JOBS_BASE}/stats`);
    const stats: Record<JobStatus, number> = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    data.statusBreakdown.forEach((item: { status: JobStatus; count: number }) => {
        stats[item.status] = item.count;
    });
    return stats;
};
