'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '@/lib/types';

export default function Analytics() {
    const router = useRouter();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<7 | 30>(7);
    const [habitAnalytics, setHabitAnalytics] = useState<any[]>([]);
    const [globalStats, setGlobalStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedPeriod]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const habitsRes = await fetch('/api/habits');
            const habitsData = await habitsRes.json();
            setHabits(habitsData);

            const globalRes = await fetch(`/api/analytics?days=${selectedPeriod}`);
            const globalData = await globalRes.json();
            setGlobalStats(globalData);

            const analyticsPromises = habitsData.map((habit: Habit) =>
                fetch(`/api/analytics?habitId=${habit.id}&days=${selectedPeriod}`).then(r => r.json())
            );
            const analyticsData = await Promise.all(analyticsPromises);
            setHabitAnalytics(analyticsData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-8">
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

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
                        <p className="text-gray-600">Track your progress and celebrate your wins.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedPeriod(7)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === 7
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 border border-border hover:bg-gray-50'
                                }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setSelectedPeriod(30)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === 30
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 border border-border hover:bg-gray-50'
                                }`}
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>

                {habits.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-border p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">No Data Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start tracking habits to see your analytics here.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Global Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                                <div className="text-3xl font-bold text-primary mb-1">{globalStats?.totalHabits || 0}</div>
                                <div className="text-sm text-gray-600">Total habits</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                                <div className="text-3xl font-bold text-secondary mb-1">{globalStats?.globalStreak || 0}</div>
                                <div className="text-sm text-gray-600">Current streak</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                                <div className="text-3xl font-bold text-success mb-1">{globalStats?.daysWithProgress || 0}</div>
                                <div className="text-sm text-gray-600">Active days</div>
                            </div>
                        </div>

                        {/* Per-Habit Analytics */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">Habit Breakdown</h2>

                            {habitAnalytics.map((analytics, index) => {
                                const habit = habits.find(h => h.id === analytics.habitId);
                                if (!habit) return null;

                                return (
                                    <div
                                        key={analytics.habitId}
                                        className="bg-white rounded-xl shadow-sm border border-border p-6 cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => router.push(`/habit/${habit.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground mb-1">{analytics.habitName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {habit.type === 'MEASURABLE' ? `Tracked in ${habit.unit}` : 'Yes/No habit'}
                                                </p>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">{analytics.streak}</div>
                                                <div className="text-xs text-gray-600">Current Streak</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-secondary">
                                                    {analytics.completionRate?.toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-gray-600">Completion Rate</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-success">{analytics.completedDays}</div>
                                                <div className="text-xs text-gray-600">Days Completed</div>
                                            </div>
                                            {habit.type === 'MEASURABLE' && (
                                                <div>
                                                    <div className="text-2xl font-bold text-foreground">
                                                        {analytics.averageValue?.toFixed(1) || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Avg {habit.unit}/day</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(analytics.completionRate || 0, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Encouraging Message */}
                        {globalStats?.globalStreak > 0 && (
                            <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-sm p-6 text-white text-center">
                                <div className="text-4xl mb-2">🔥</div>
                                <h3 className="text-xl font-semibold mb-1">
                                    {globalStats.globalStreak} day streak!
                                </h3>
                                <p>Keep it up! Consistency is the key to building lasting habits.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
