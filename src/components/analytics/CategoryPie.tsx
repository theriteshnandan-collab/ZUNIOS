"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryData } from '@/lib/analytics';

interface CategoryPieProps {
    data: CategoryData[];
}

export default function CategoryPie({ data }: CategoryPieProps) {
    if (data.length === 0) {
        return (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                No entries to categorize.
            </div>
        );
    }

    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="text-2xl font-bold text-white">
                        {data.reduce((acc, curr) => acc + curr.value, 0)}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Items</p>
                </div>
            </div>

            {/* Legend Overlay (Bottom) */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-3">
                {data.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[10px] text-muted-foreground uppercase">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
