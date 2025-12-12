'use client';

import { HabitLog } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CalendarProps {
    logs: HabitLog[];
    habitType: 'MEASURABLE' | 'BOOLEAN';
}

export default function Calendar({ logs, habitType }: CalendarProps) {
    // Generate last 30 days
    const days: Date[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date);
    }

    const logMap = new Map(logs.map(log => [log.date, log]));

    const isCompleted = (log: HabitLog | undefined) => {
        if (!log) return false;
        if (habitType === 'BOOLEAN') {
            return log.booleanValue === true;
        }
        return (log.numericValue || 0) > 0;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-lg font-semibold mb-4">Last 30 Days</h3>
            <div className="grid grid-cols-10 gap-2">
                {days.map((day, index) => {
                    const dateStr = formatDate(day);
                    const log = logMap.get(dateStr);
                    const completed = isCompleted(log);

                    return (
                        <div
                            key={index}
                            className="aspect-square relative group"
                            title={`${day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${log
                                    ? habitType === 'BOOLEAN'
                                        ? ' - Completed'
                                        : ` - ${log.numericValue}`
                                    : ' - No data'
                                }`}
                        >
                            <div
                                className={`w-full h-full rounded-lg transition-all ${completed
                                        ? 'bg-primary hover:bg-primary-dark'
                                        : 'bg-muted hover:bg-gray-300'
                                    }`}
                            />
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded pointer-events-none z-10">
                                {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
