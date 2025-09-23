import React, { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../services/JobService';
import { Job } from '../types/Job';
import JobTable from '../components/JobTable';
import { useAuth } from '../context/AuthContext';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { role } = useAuth();

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(id);
      await loadJobs();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete job');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <JobTable jobs={jobs} onDelete={handleDelete} {...({ isAdmin: role === 'Admin' } as any)} />
    </div>
  );
};

export default JobList;
