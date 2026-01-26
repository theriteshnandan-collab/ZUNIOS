"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

interface CognitiveRadarProps {
    data: {
        subject: string;
        A: number; // Value
        fullMark: number;
    }[];
}

export default function CognitiveRadar({ data }: CognitiveRadarProps) {
    // If no data, show a default balanced shape
    const chartData = data.length > 0 ? data : [
        { subject: 'Vision', A: 50, fullMark: 100 },
        { subject: 'Build', A: 50, fullMark: 100 },
        { subject: 'Log', A: 50, fullMark: 100 },
        { subject: 'Think', A: 50, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                    />
                    <Radar
                        name="Cognitive Balance"
                        dataKey="A"
                        stroke="#a855f7"
                        strokeWidth={2}
                        fill="#a855f7"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Decorative center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        </div>
    );
}
