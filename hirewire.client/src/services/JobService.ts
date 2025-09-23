import { Job, JobStatus } from '../types/Job';

const API_BASE = "http://localhost:5035/api";
const AUTH_BASE = `${API_BASE}/authentication`;
const JOBS_BASE = `${API_BASE}/jobs`;
const ADMIN_BASE = `${API_BASE}/admin`;

// ---------------------- Authentication ----------------------
export const registerUser = async (username: string, password: string, role?: string): Promise<void> => {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  if (!res.ok) throw new Error(await res.text());
};

export const loginUser = async (username: string, password: string): Promise<{ token: string; role: string | null }> => {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  const token = data.token as string;
  const role = data.role as string | null;

  // persist token and role for AuthContext
  localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role);
  else localStorage.removeItem("role");

  return { token, role };
};

// ---------------------- Fetch Wrapper with JWT ----------------------
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    // try to parse JSON error body, fallback to text
    const text = await res.text().catch(() => "");
    try {
      const json = text ? JSON.parse(text) : null;
      throw new Error(json?.message || text || res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  // No content
  if (res.status === 204) return null;

  // Try parsing JSON, otherwise return null
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return null;
};

// ---------------------- Admin APIs ----------------------
export const getUsers = async (): Promise<Array<{ id: number; username: string; role: string }>> => {
  return authFetch(`${ADMIN_BASE}/users`);
};

export const updateUserRole = async (id: number, role: string): Promise<void> => {
  await authFetch(`${ADMIN_BASE}/users/${id}/role`, { method: 'POST', body: JSON.stringify({ role }) });
};

export const deleteUser = async (id: number): Promise<void> => {
  await authFetch(`${ADMIN_BASE}/users/${id}`, { method: 'DELETE' });
};

// ---------------------- Jobs Service ----------------------
export const getJobs = async (): Promise<Job[]> => {
  return authFetch(JOBS_BASE);
};

export const getJob = async (id: number): Promise<Job> => {
  return authFetch(`${JOBS_BASE}/${id}`);
};

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

export const deleteJob = async (id: number): Promise<void> => {
  await authFetch(`${JOBS_BASE}/${id}`, { method: "DELETE" });
};

export const getJobStats = async (): Promise<Record<JobStatus, number>> => {
  const data = await authFetch(`${JOBS_BASE}/stats`);
  const stats: Record<JobStatus, number> = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  (data?.statusBreakdown || []).forEach((item: { status: JobStatus; count: number }) => {
    stats[item.status] = item.count;
  });
  return stats;
};