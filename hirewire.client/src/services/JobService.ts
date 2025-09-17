import { Job, JobStatus } from '../types/Job';

// Mock data
const mockJobs: Job[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        status: 'Applied',
        dateApplied: '2025-09-01',
        salary: '$150,000 - $180,000',
        notes: 'Great tech stack, modern tools',
        contactName: 'John Smith',
        contactEmail: 'john@techcorp.com',
        nextSteps: 'Technical interview scheduled',
        lastUpdated: '2025-09-15'
    },
    {
        id: 2,
        title: 'Full Stack Engineer',
        company: 'StartupX',
        location: 'Remote',
        status: 'Interview',
        dateApplied: '2025-08-25',
        salary: '$130,000 - $160,000',
        notes: 'Series A startup, growing team',
        contactName: 'Sarah Johnson',
        contactEmail: 'sarah@startupx.com',
        nextSteps: 'Final round next week',
        lastUpdated: '2025-09-10'
    },
    {
        id: 3,
        title: 'Software Architect',
        company: 'Enterprise Solutions',
        location: 'New York, NY',
        status: 'Offer',
        dateApplied: '2025-08-15',
        salary: '$180,000 - $220,000',
        notes: 'Negotiating benefits package',
        contactName: 'Mike Brown',
        contactEmail: 'mike@enterprise.com',
        nextSteps: 'Review offer letter',
        lastUpdated: '2025-09-16'
    },
    {
        id: 4,
        title: 'React Developer',
        company: 'Digital Agency',
        location: 'Austin, TX',
        status: 'Rejected',
        dateApplied: '2025-08-10',
        salary: '$120,000 - $140,000',
        notes: 'Position filled internally',
        contactName: 'Lisa Chen',
        contactEmail: 'lisa@digital.com',
        lastUpdated: '2025-09-01'
    }
];

// Local storage key
const STORAGE_KEY = 'hirewire_jobs';

// Initialize local storage with mock data if empty
const initializeStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockJobs));
    }
};

// Initialize on import
initializeStorage();

// Get all jobs
export const getJobs = async (): Promise<Job[]> => {
    const jobs = localStorage.getItem(STORAGE_KEY);
    return jobs ? JSON.parse(jobs) : [];
};

// Add new job
export const addJob = async (job: Omit<Job, 'id'>): Promise<Job> => {
    const jobs = await getJobs();
    const newJob: Job = {
        ...job,
        id: jobs.length + 1,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    const updatedJobs = [...jobs, newJob];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
    return newJob;
};

// Update job
export const updateJob = async (id: number, updates: Partial<Job>): Promise<Job> => {
    const jobs = await getJobs();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) throw new Error('Job not found');
    
    const updatedJob = {
        ...jobs[index],
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    jobs[index] = updatedJob;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    return updatedJob;
};

// Get job statistics
export const getJobStats = async (): Promise<Record<JobStatus, number>> => {
    const jobs = await getJobs();
    const stats = {
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0
    };
    
    jobs.forEach(job => {
        stats[job.status]++;
    });
    
    return stats;
};
