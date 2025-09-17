import React, { useEffect, useState } from 'react';
import { getJobs } from '../services/JobService';
import { Job } from '../types/Job';
import JobTable from '../components/JobTable';

const JobList: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        getJobs().then(setJobs);
    }, []);

    return (
        <div>
            <h1>Job List</h1>
            <JobTable jobs={jobs} />
        </div>
    );
};

export default JobList;
