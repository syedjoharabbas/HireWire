import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Job } from '../types/Job';

interface Props {
    jobs: Job[];
}

const COLORS = {
    Applied: '#3B82F6',  // blue-500
    Interview: '#EAB308', // yellow-500
    Offer: '#22C55E',    // green-500
    Rejected: '#EF4444'  // red-500
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-2 shadow-lg rounded-lg border">
                <p className="font-medium">{data.name}</p>
                <p className="text-sm text-gray-600">
                    Count: <span className="font-medium">{data.value}</span>
                </p>
                <p className="text-sm text-gray-600">
                    Percentage: <span className="font-medium">
                        {((data.value / data.total) * 100).toFixed(1)}%
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

const JobStatusPieChart: React.FC<Props> = ({ jobs }) => {
    const statusCounts = {
        Applied: jobs.filter(j => j.status === 'Applied').length,
        Interview: jobs.filter(j => j.status === 'Interview').length,
        Offer: jobs.filter(j => j.status === 'Offer').length,
        Rejected: jobs.filter(j => j.status === 'Rejected').length,
    };

    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    const data = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
        total
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    labelLine={false}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        name
                    }: {
                        cx: number;
                        cy: number;
                        midAngle: number;
                        innerRadius: number;
                        outerRadius: number;
                        value: number;
                        name: string;
                    }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        const percent = ((value / total) * 100).toFixed(0);
                        if (value === 0) return null;
                        return (
                            <text
                                x={x}
                                y={y}
                                fill={COLORS[name as keyof typeof COLORS]}
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                                className="text-sm"
                            >
                                {`${name} (${percent}%)`}
                            </text>
                        );
                    }}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.name}
                            fill={COLORS[entry.name as keyof typeof COLORS]}
                            strokeWidth={2}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default JobStatusPieChart;
