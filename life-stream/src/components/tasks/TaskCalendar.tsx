import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";
import { GlassCard } from "../ui/GlassCard";
import { normalizeDateKey } from "@/lib/date-utils";

interface TaskCalendarProps {
    tasks: Task[];
    selectedDate: Date | undefined;
    onSelectDate: (date: Date | undefined) => void;
}

export default function TaskCalendar({ tasks, selectedDate, onSelectDate }: TaskCalendarProps) {
    // Pre-calculate days with tasks map for O(1) lookup during render
    const taskDayMap = tasks.reduce((acc, task) => {
        if (task.status !== 'done') {
            const key = normalizeDateKey(task.due_date);
            if (key) {
                acc[key] = (acc[key] || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <GlassCard className="p-6 w-full flex-shrink-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelectDate}
                    className="w-full border-0 select-none"
                    classNames={{
                        month: "w-full space-y-4",
                        caption: "flex justify-center pt-2 relative items-center mb-6",
                        caption_label: "text-xl font-bold text-white tracking-tight",
                        nav: "flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity",

                        // Grid Layout
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between mb-4",
                        head_cell: "text-muted-foreground w-full font-medium text-xs uppercase tracking-widest text-center",
                        row: "flex w-full justify-between mt-2 gap-2",

                        // Individual Cells - MAXIMIZED TOUCH TARGETS
                        cell: "text-center p-0 relative w-full aspect-square focus-within:relative focus-within:z-20",
                        day: "w-full h-full text-lg p-0 font-medium text-white/70 hover:bg-white/10 rounded-2xl transition-all data-[selected]:shadow-2xl",

                        // States
                        day_selected: "bg-purple-600 text-white hover:bg-purple-500 hover:text-white focus:bg-purple-600 focus:text-white shadow-[0_0_25px_rgba(147,51,234,0.5)] scale-105 z-10",
                        day_today: "bg-white/5 text-white border border-white/20",
                        day_outside: "text-muted-foreground/20 opacity-20",
                        day_disabled: "text-muted-foreground opacity-20",
                        day_hidden: "invisible",
                    }}
                    modifiers={{
                        hasEntry: (d) => !!taskDayMap[normalizeDateKey(d) || '']
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                    }}
                />
            </GlassCard>

            {/* Visual Hint */}
            <div className="text-center text-white/30 text-xs uppercase tracking-widest">
                {selectedDate ? "Filtering by Date" : "Showing All Missions"}
            </div>
        </div>
    );
}
