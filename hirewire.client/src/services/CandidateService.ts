const API_BASE = "http://localhost:5035/api";
const CANDIDATES_BASE = `${API_BASE}/candidates`;

// authFetch similar to JobService
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    try {
      const json = text ? JSON.parse(text) : null;
      throw new Error(json?.message || text || res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return null;
};

export interface CandidateDto {
  id?: number;
  fullName: string;
  email?: string;
  phone?: string;
  notes?: string;
  resumePath?: string;
}

export const getCandidates = async (): Promise<CandidateDto[]> => {
  return authFetch(CANDIDATES_BASE);
};

export const createCandidate = async (payload: CandidateDto): Promise<CandidateDto> => {
  return authFetch(CANDIDATES_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
};

export const uploadResume = async (id: number, file: File): Promise<{ url: string }> => {
  const form = new FormData();
  form.append('file', file, file.name);

  const token = localStorage.getItem('token');
  const res = await fetch(`${CANDIDATES_BASE}/${id}/uploadResume`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
