"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isSameDay,
    startOfMonth,
    startOfWeek,
    subMonths
} from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = {
    mode?: "single" | "range" | "multiple";
    selected?: Date | undefined;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
    classNames?: any;
    modifiers?: {
        hasEntry?: (date: Date) => boolean;
    };
    modifiersClassNames?: {
        hasEntry?: string;
    };
    showOutsideDays?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    mode = "single",
    selected,
    onSelect,
    modifiers,
    modifiersClassNames,
    ...props
}: CalendarProps) {
    // State for the currently visible month
    const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date()); // Default to today/now

    // Effect: If selected date changes and is valid, jump to it (optional, but good UX)
    // React.useEffect(() => {
    //   if (selected) setCurrentMonth(selected);
    // }, [selected]);

    // Generators
    const today = new Date();

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Grid Generation Logic (Crucial Step 2)
    // 1. Find the first day of the visual grid (start of week of start of month)
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart); // Default Sunday start
    const endDate = endOfWeek(monthEnd);

    // 2. Generate all days
    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Weekday Headers
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className={cn("p-3", className)} {...props}>
            {/* 4. Header: Month Year + Navigation */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white ml-2">
                    {format(currentMonth, "MMMM yyyy")}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className={cn(buttonVariants({ variant: "ghost" }), "h-7 w-7 p-0 text-zinc-400 hover:text-white")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className={cn(buttonVariants({ variant: "ghost" }), "h-7 w-7 p-0 text-zinc-400 hover:text-white")}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* 1. Visual Structure: CSS Grid 7 Cols - Responsive Compact */}
            <div className="grid grid-cols-7 gap-y-1 md:gap-y-[2px]">
                {/* Weekday Headers */}
                {weekDays.map((day, i) => (
                    <div key={i} className="flex justify-center items-center h-8 md:h-5">
                        <span className="text-[10px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                            {day}
                        </span>
                    </div>
                ))}

                {/* Main Grid Dates */}
                {calendarDays.map((day, dayIdx) => {
                    const isSelected = selected && isSameDay(day, selected);
                    const isToday = isSameDay(day, today);
                    const isOutside = !isSameMonth(day, currentMonth);
                    const hasEntry = modifiers?.hasEntry?.(day);

                    // 3. Styling & States
                    return (
                        <div key={day.toString()} className="flex justify-center items-center h-9 w-9 md:h-6 md:w-6 relative">
                            <button
                                onClick={() => onSelect?.(day)}
                                className={cn(
                                    "h-7 w-7 md:h-6 md:w-6 rounded-full flex items-center justify-center text-xs md:text-[10px] transition-all relative z-10 touch-target",

                                    // Normal State (Current Month)
                                    !isOutside && "text-white hover:bg-white/10",

                                    // Padding Dates (Outside)
                                    isOutside && "text-zinc-700 opacity-40 hover:bg-white/5",

                                    // Today's Date
                                    isToday && !isSelected && "bg-blue-600/20 text-blue-200 ring-1 ring-blue-500",

                                    // Selected State (Overrides everything) - Aether Cyan
                                    isSelected && "bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400",
                                )}
                            >
                                {format(day, "d")}
                            </button>

                            {/* Modifiers (Has Entry Dot) */}
                            {hasEntry && !isSelected && (
                                <div className={cn(
                                    "absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400",
                                    modifiersClassNames?.hasEntry
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export { Calendar };
