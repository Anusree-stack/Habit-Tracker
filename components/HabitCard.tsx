'use client';

import { Habit, HabitLog } from '@/lib/types';
import { useState } from 'react';

interface HabitCardProps {
    habit: Habit;
    todayLog?: HabitLog;
    onLog: (habitId: string, value: number | boolean) => Promise<void>;
    onDelete: (habitId: string) => Promise<void>;
    onClick: () => void;
}

export default function HabitCard({ habit, todayLog, onLog, onDelete, onClick }: HabitCardProps) {
    const [value, setValue] = useState<string>('');
    const [isLogging, setIsLogging] = useState(false);

    const handleLog = async () => {
        if (isLogging) return;

        try {
            setIsLogging(true);
            if (habit.type === 'MEASURABLE') {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue <= 0) {
                    alert('Please enter a valid positive number');
                    return;
                }
                await onLog(habit.id, numValue);
                setValue('');
            } else {
                await onLog(habit.id, true);
            }
        } finally {
            setIsLogging(false);
        }
    };

    const isCompleted = todayLog
        ? habit.type === 'BOOLEAN'
            ? todayLog.booleanValue === true
            : (todayLog.numericValue || 0) > 0
        : false;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 cursor-pointer" onClick={onClick}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{habit.name}</h3>
                    <p className="text-sm text-gray-500">
                        {habit.type === 'MEASURABLE' ? `Track in ${habit.unit}` : 'Yes/No'}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${habit.name}"?`)) {
                            onDelete(habit.id);
                        }
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {isCompleted && (
                <div className="mb-3 flex items-center gap-2 text-success">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                        {habit.type === 'MEASURABLE'
                            ? `${todayLog?.numericValue} ${habit.unit} today`
                            : 'Completed today'}
                    </span>
                </div>
            )}

            <div className="flex gap-2">
                {habit.type === 'MEASURABLE' ? (
                    <>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Add ${habit.unit}`}
                            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleLog()}
                        />
                        <button
                            onClick={handleLog}
                            disabled={isLogging}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium"
                        >
                            {isLogging ? 'Adding...' : 'Add'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLog}
                        disabled={isLogging || isCompleted}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${isCompleted
                                ? 'bg-success text-white cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                    >
                        {isCompleted ? '✓ Done' : isLogging ? 'Marking...' : 'Mark as Done'}
                    </button>
                )}
            </div>
        </div>
    );
}
