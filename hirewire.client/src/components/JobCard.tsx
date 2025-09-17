import React from 'react';
import { Job } from '../types/Job';

interface Props {
    job: Job;
}

const JobCard: React.FC<Props> = ({ job }) => (
    <div style={{ border: '1px solid #ccc', margin: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}>
        <h3>{job.title}</h3>
        <p>{job.company} - {job.location}</p>
        <p>Status: {job.status}</p>
    </div>
);

export default JobCard;
