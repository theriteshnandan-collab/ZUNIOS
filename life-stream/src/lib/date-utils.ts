import { format, parseISO, startOfDay } from 'date-fns';

/**
 * Normalizes a date input to a strict YYYY-MM-DD string key.
 * This effectively ignores time and timezone components for the purpose of "calendar day" grouping.
 * 
 * @param input Date object, ISO string, or undefined
 * @returns YYYY-MM-DD string or null if invalid
 */
export function normalizeDateKey(input: Date | string | undefined | null): string | null {
    if (!input) return null;

    try {
        let dateObj: Date;

        if (typeof input === 'string') {
            dateObj = parseISO(input);
        } else {
            dateObj = input;
        }

        // We use the local calendar date for display
        return format(dateObj, 'yyyy-MM-dd');
    } catch (e) {
        return null;
    }
}

/**
 * Strict equality check for two dates based *only* on their calendar day.
 */
export function isSameCalendarDay(dateA: Date | string | undefined, dateB: Date | string | undefined): boolean {
    const keyA = normalizeDateKey(dateA);
    const keyB = normalizeDateKey(dateB);

    if (!keyA || !keyB) return false;
    return keyA === keyB;
}

/**
 * Formats a date for display in the UI (e.g. "January 29th")
 */
export function formatCalendarDate(input: Date | string | undefined): string {
    if (!input) return '';
    const key = normalizeDateKey(input);
    if (!key) return '';
    return format(parseISO(key), "MMMM do"); // Parse back solely from the date string to avoid timezone shifts
}
