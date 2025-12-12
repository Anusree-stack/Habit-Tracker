/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
    return formatDate(new Date());
}

/**
 * Check if a log can be edited (within 24 hours of creation)
 */
export function canEditLog(createdAt: Date): boolean {
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation < 24;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00');
}

/**
 * Get date range for analytics
 */
export function getDateRange(days: number): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);

    return {
        start: formatDate(start),
        end: formatDate(end),
    };
}

/**
 * Calculate streak from logs
 */
export function calculateStreak(logs: Array<{ date: string }>): number {
    if (logs.length === 0) return 0;

    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

    const today = getToday();
    let streak = 0;
    let currentDate = new Date(today);

    for (const log of sortedLogs) {
        const logDate = formatDate(currentDate);

        if (log.date === logDate) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // Check if we should start from yesterday (if today is not logged yet)
            if (streak === 0 && log.date === formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 2);
            } else {
                break;
            }
        }
    }

    return streak;
}
