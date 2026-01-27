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
            className={cn("p-1", className)} // Reduced padding
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full", // Ensure month takes full width
                caption: "flex justify-center pt-1 relative items-center mb-2",
                caption_label: "text-xs font-medium uppercase tracking-widest", // Smaller caption
                nav: "space-x-1 flex items-center bg-white/5 rounded-full p-0.5", // Styled nav
                nav_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 text-white" // Smaller buttons
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1 block", // Use block for table to allow grid rows
                head_row: "grid grid-cols-7 mb-1 w-full",
                head_cell:
                    "text-muted-foreground rounded-md w-full font-normal text-[0.65rem] uppercase text-center", // TINY text for days
                row: "grid grid-cols-7 mt-1 w-full",
                cell: "h-8 w-full text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs mx-auto" // Fixed small size, centered
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white rounded-full",
                day_today: "bg-white/10 text-white font-bold",
                day_outside:
                    "day-outside text-white/20 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: (props) => {
                    if (props.orientation === 'left') return <ChevronLeft className="h-3 w-3" />;
                    return <ChevronRight className="h-3 w-3" />;
                }
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
