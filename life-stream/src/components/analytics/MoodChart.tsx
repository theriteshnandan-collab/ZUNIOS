"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { DailyMood } from '@/lib/analytics';
import { Card } from '@/components/ui/card';

interface MoodChartProps {
    data: DailyMood[];
}

export default function MoodChart({ data }: MoodChartProps) {
    if (data.length === 0 || data.every(d => d.score === 0)) {
        return (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Not enough mood data yet.
            </div>
        );
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        hide
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#aaa' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#moodGradient)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
