'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Habit, HabitLog } from '@/lib/types';
import { getToday, canEditLog } from '@/lib/utils';
import Calendar from '@/components/Calendar';

export default function HabitDetail() {
    const router = useRouter();
    const params = useParams();
    const habitId = params.id as string;

    const [habit, setHabit] = useState<Habit | null>(null);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [todayLog, setTodayLog] = useState<HabitLog | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [value, setValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (habitId) {
            loadData();
        }
    }, [habitId]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [habitRes, logsRes, analyticsRes] = await Promise.all([
                fetch(`/api/habits`),
                fetch(`/api/logs?habitId=${habitId}`),
                fetch(`/api/analytics?habitId=${habitId}&days=30`),
            ]);

            const habitsData = await habitRes.json();
            const habitData = habitsData.find((h: Habit) => h.id === habitId);
            const logsData = await logsRes.json();
            const analyticsData = await analyticsRes.json();

            setHabit(habitData || null);
            setLogs(logsData);
            setAnalytics(analyticsData);

            const today = getToday();
            const todayLogData = logsData.find((log: HabitLog) => log.date === today);
            setTodayLog(todayLogData || null);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLog = async () => {
        if (!habit || isUpdating) return;

        try {
            setIsUpdating(true);
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue <= 0) {
                alert('Please enter a valid positive number');
                return;
            }

            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    habitId: habit.id,
                    date: getToday(),
                    numericValue: numValue,
                }),
            });

            if (res.ok) {
                setValue('');
                await loadData();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to log habit');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkDone = async () => {
        if (!habit || isUpdating) return;

        try {
            setIsUpdating(true);
            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    habitId: habit.id,
                    date: getToday(),
                    booleanValue: true,
                }),
            });

            if (res.ok) {
                await loadData();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to log habit');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateLog = async () => {
        if (!todayLog || !canEditLog(new Date(todayLog.createdAt)) || isUpdating) return;

        try {
            setIsUpdating(true);
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                alert('Please enter a valid number');
                return;
            }

            const res = await fetch(`/api/logs/${todayLog.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numericValue: numValue,
                }),
            });

            if (res.ok) {
                setValue('');
                await loadData();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to update log');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading habit details...</p>
                </div>
            </div>
        );
    }

    if (!habit) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Habit not found</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const isCompleted = todayLog
        ? habit.type === 'BOOLEAN'
            ? todayLog.booleanValue === true
            : (todayLog.numericValue || 0) > 0
        : false;

    const canEdit = todayLog ? canEditLog(new Date(todayLog.createdAt)) : true;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-foreground mb-6 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">{habit.name}</h1>
                    <p className="text-gray-600">
                        {habit.type === 'MEASURABLE' ? `Tracked in ${habit.unit}` : 'Yes/No habit'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                        <div className="text-3xl font-bold text-primary mb-1">{analytics?.streak || 0}</div>
                        <div className="text-sm text-gray-600">Day streak</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                        <div className="text-3xl font-bold text-secondary mb-1">
                            {analytics?.completionRate?.toFixed(0) || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Completion rate (30 days)</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                        <div className="text-3xl font-bold text-success mb-1">
                            {habit.type === 'MEASURABLE'
                                ? `${analytics?.totalValue?.toFixed(1) || 0}`
                                : analytics?.completedDays || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            {habit.type === 'MEASURABLE' ? `Total ${habit.unit} (30 days)` : 'Days completed (30 days)'}
                        </div>
                    </div>
                </div>

                {/* Today's Log */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>

                    {isCompleted && (
                        <div className="mb-4 flex items-center gap-2 text-success">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">
                                {habit.type === 'MEASURABLE'
                                    ? `${todayLog?.numericValue} ${habit.unit} logged today`
                                    : 'Completed today'}
                            </span>
                        </div>
                    )}

                    {!canEdit && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                            This log is older than 24 hours and cannot be edited.
                        </div>
                    )}

                    {canEdit && (
                        <div className="flex gap-2">
                            {habit.type === 'MEASURABLE' ? (
                                <>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder={`Add ${habit.unit}`}
                                        className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        onKeyPress={(e) => e.key === 'Enter' && (todayLog ? handleUpdateLog() : handleLog())}
                                    />
                                    <button
                                        onClick={todayLog ? handleUpdateLog : handleLog}
                                        disabled={isUpdating}
                                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium"
                                    >
                                        {isUpdating ? 'Saving...' : todayLog ? 'Update' : 'Add'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleMarkDone}
                                    disabled={isUpdating || isCompleted}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${isCompleted
                                            ? 'bg-success text-white cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                        }`}
                                >
                                    {isCompleted ? '✓ Done' : isUpdating ? 'Marking...' : 'Mark as Done'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Calendar */}
                <Calendar logs={logs} habitType={habit.type} />
            </div>
        </div>
    );
}
