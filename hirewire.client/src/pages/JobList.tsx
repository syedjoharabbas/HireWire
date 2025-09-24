import React, { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../services/JobService';
import { Job } from '../types/Job';
import JobTable from '../components/JobTable';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Confirm from '../components/Confirm';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { role } = useAuth();
  const toast = useToast();
  const [confirming, setConfirming] = useState<number | null>(null);

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
    setConfirming(id);
  };

  const doDelete = async (id: number) => {
    setConfirming(null);
    try {
      await deleteJob(id);
      toast.push('Job deleted', 'success');
      await loadJobs();
    } catch (err: any) {
      toast.push(err?.message || 'Failed to delete job', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <JobTable jobs={jobs} onDelete={handleDelete} {...({ isAdmin: role === 'Admin' } as any)} />
      {confirming && (
        <Confirm
          message="Are you sure you want to delete this job?"
          onCancel={() => setConfirming(null)}
          onConfirm={() => doDelete(confirming)}
        />
      )}
    </div>
  );
};

export default JobList;
