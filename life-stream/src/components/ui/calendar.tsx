"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-2", className)}
            // Force narrow weekday names (S, M, T, W, T, F, S) for modernity
            formatters={{
                formatWeekdayName: (day) => day.toLocaleDateString("en-US", { weekday: "narrow" }),
            }}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-2",
                caption_label: "text-sm font-medium uppercase tracking-widest text-white/90",
                nav: "space-x-1 flex items-center bg-white/5 rounded-full p-0.5",
                nav_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-white/10"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",

                // GRID ARCHITECTURE
                // Use standard table display for robust column alignment
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full mb-2", // Flex row for headers
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] text-center flex-1", // Flex-1 ensures equal width

                row: "flex w-full mt-2", // Flex row for days
                cell: "h-9 w-full text-center text-sm p-0 relative flex-1 flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",

                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-sm hover:bg-purple-500/20 hover:text-purple-200"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white rounded-full shadow-lg shadow-purple-500/20",
                day_today: "bg-white/10 text-white font-bold ring-1 ring-white/20",
                day_outside:
                    "day-outside text-zinc-500 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: (props) => {
                    if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />;
                    return <ChevronRight className="h-4 w-4" />;
                }
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
