import React, { useEffect, useState } from 'react';
import { getCandidates, createCandidate, uploadResume } from '../services/CandidateService';
import { useAuth } from '../context/AuthContext';
import ResumeViewer from '../components/ResumeViewer';

// Ensure this matches the server address
const API_BASE = 'http://localhost:5035';

function resolveResumeUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { isAdmin } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCandidates();
      const normalized = (data || []).map((c: any) => ({
        ...c,
        resumePath: resolveResumeUrl(c.resumePath)
      }));
      setCandidates(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!fullName.trim()) return alert('Name required');
    try {
      await createCandidate({ fullName, email, phone });
      setFullName(''); setEmail(''); setPhone('');
      await load();
    } catch (err: any) {
      alert(err?.message || 'Failed to create candidate');
    }
  };

  const handleUpload = async (id: number, file: File | null) => {
    if (!file) return alert('Select a file first');
    try {
      const res = await uploadResume(id, file);
      // server returns absolute url; normalize just in case
      const url = resolveResumeUrl(res?.url ?? null);
      alert('Uploaded: ' + url);
      await load();
    } catch (err: any) {
      alert(err?.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Candidates</h2>

      <div className="bg-white p-4 rounded shadow grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input className="input col-span-1 sm:col-span-1" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input className="input col-span-1 sm:col-span-1" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input col-span-1 sm:col-span-1" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <div className="col-span-1 sm:col-span-1 flex items-center">
          <button onClick={handleCreate} className="btn btn-primary w-full">Create</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
        <table className="min-w-full bg-white rounded overflow-hidden shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Resume</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.fullName}</td>
                <td className="px-4 py-2">{c.email || '—'}</td>
                <td className="px-4 py-2">
                  {c.resumePath ? (
                    <button onClick={() => setPreviewUrl(resolveResumeUrl(c.resumePath))} className="text-primary-600">View</button>
                  ) : '—'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <input
                    type="file"
                    id={`resume-${c.id}`}
                    className="inline-block"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`resume-${c.id}`) as HTMLInputElement | null;
                      const file = input?.files?.[0] ?? null;
                      handleUpload(c.id, file);
                    }}
                    className="btn btn-secondary"
                  >
                    Upload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {previewUrl && <ResumeViewer url={previewUrl} onClose={() => setPreviewUrl(null)} />}
        </>
      )}
    </div>
  );
};

export default Candidates;
