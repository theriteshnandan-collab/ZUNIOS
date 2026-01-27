
import { Dream } from "@/types/dream";
import { format } from "date-fns";

export type GroupedDreams = {
    [key: string]: Dream[];
};

export const groupDreamsByDate = (dreams: Dream[]): GroupedDreams => {
    const grouped: GroupedDreams = {};

    dreams.forEach((dream) => {
        const date = new Date(dream.created_at);
        // Key format: "September 2025"
        const key = format(date, "MMMM yyyy");

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(dream);
    });

    // Sort keys chronologically descending (newest month first)
    // We can't rely on object key order, so we might need to handle this in iteration
    // But for the structure, this is enough. The consumer will sort keys.

    return grouped;
};

export const getSortedDreamKeys = (grouped: GroupedDreams): string[] => {
    return Object.keys(grouped).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
    });
};
