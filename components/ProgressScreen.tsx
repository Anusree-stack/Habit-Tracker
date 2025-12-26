'use client';

import React, { useState } from 'react';
import { Menu, ChevronLeft, Calendar, ChevronRight, Home, Plus, TrendingUp } from 'lucide-react';
import type { UIHabit } from '../types/ui';

interface ProgressScreenProps {
    habits: UIHabit[];
    onNavigate: (screen: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ habits, onNavigate }) => {
    const [timeRange, setTimeRange] = useState('Month');
    const [selectedHabit, setSelectedHabit] = useState(habits[0]?.id);
    const [currentInsight, setCurrentInsight] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const timeRanges = ['Month', 'Half-year', 'Year'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentHabit = habits.find(h => h.id === selectedHabit);

    // Generate insights
    const generateInsights = (habit?: UIHabit) => {
        if (!habit) return [{ icon: '👋', message: 'Select a habit to see insights!' }];

        const insights = [];
        const completionValues = Object.values(habit.completions || {});

        if (habit.measurable) {
            const total = completionValues.reduce((sum, val) => (sum as number) + (typeof val === 'number' ? val : 0), 0) as number;
            const avg = total / (completionValues.length || 1);
            insights.push({
                icon: '📊',
                message: `Averaging ${avg.toFixed(1)} ${habit.unit} per day`
            });

            insights.push({
                icon: '🔥',
                message: 'Strong consistency! Keep it up!'
            });

            insights.push({
                icon: '📈',
                message: 'Improving trend detected'
            });
        } else {
            const completedDays = completionValues.filter(v => v === true).length;
            const totalDays = completionValues.length || 1;
            const rate = Math.round((completedDays / totalDays) * 100);

            insights.push({
                icon: '✅',
                message: `${rate}% completion rate`
            });

            insights.push({
                icon: '🎯',
                message: 'Great consistency!'
            });

            insights.push({
                icon: '⭐',
                message: 'You are on track!'
            });
        }

        return insights;
    };

    const insights = generateInsights(currentHabit);

    // Calculate weekly data based on time range
    const calculateWeeklyData = () => {
        if (!currentHabit) return [];

        const weeklyData = [];
        let startDate, endDate;

        // Determine date range based on timeRange
        if (timeRange === 'Month') {
            startDate = new Date(selectedYear, selectedMonth, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        } else if (timeRange === 'Half-year') {
            // 6 months back from selected month
            startDate = new Date(selectedYear, selectedMonth - 5, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        } else {
            // Year - 12 months back from selected month
            startDate = new Date(selectedYear, selectedMonth - 11, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        }

        // Calculate weeks in range
        let currentWeekStart = new Date(startDate);
        let weekNum = 1;

        while (currentWeekStart <= endDate) {
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            // Don't go beyond end date
            const actualWeekEnd = weekEnd > endDate ? endDate : weekEnd;

            let weekTotal = 0;
            let weekTarget = 0;
            let daysCompleted = 0;
            let daysCommitted = 0; // For non-measurable activities

            // Iterate through days in this week
            let currentDay = new Date(currentWeekStart);
            while (currentDay <= actualWeekEnd) {
                const dateKey = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
                const value = currentHabit.completions[dateKey];

                if (currentHabit.measurable) {
                    weekTotal += (value as number) || 0;
                    weekTarget += currentHabit.target || 0;
                } else {
                    // Determine success for the week
                    // Daily (7 days) or Custom (daysPerWeek)
                    const requiredDays = (currentHabit.frequency === 'daily' || currentHabit.daysPerWeek === 7)
                        ? 7
                        : currentHabit.daysPerWeek;

                    // Success condition: met target days
                    // For measurable: we might also want to check if they hit the semantic target?
                    // "drank the total glasses of water I supposed to drink that week"
                    if (value === true) {
                        daysCompleted++;
                    }
                    // For non-measurable, daysCommitted is the number of days in the week the habit was active
                    // This logic might need refinement based on habit frequency (e.g., only count days it was scheduled)
                    // For simplicity, assuming all days in the week are 'committed' if habit is active.
                    daysCommitted++;
                }
                currentDay.setDate(currentDay.getDate() + 1);
            }

            // Determine success for the week
            // Daily (7 days) or Custom (daysPerWeek)
            const requiredDays = (currentHabit.frequency === 'daily' || currentHabit.daysPerWeek === 7)
                ? 7
                : currentHabit.daysPerWeek;

            // Success condition: met target days
            // For measurable: we might also want to check if they hit the semantic target?
            // "drank the total glasses of water I supposed to drink that week"
            // Interpretation: For measurable, "daysCompleted" isn't enough, we need Total >= (Target * Days)?
            // Or just check daily targets?
            // "drank the total glasses ... for that week" implies Cumulative Total >= Weekly Target

            const isWeekSuccessful = currentHabit.measurable
                ? weekTotal >= (currentHabit.target || 0) * requiredDays
                : daysCompleted >= requiredDays;

            const percentage = currentHabit.measurable
                ? (weekTarget > 0 ? Math.min(Math.round((weekTotal / weekTarget) * 100), 100) : 0)
                : (daysCommitted > 0 ? Math.min(Math.round((daysCompleted / daysCommitted) * 100), 100) : 0);

            weeklyData.push({
                week: `W${weekNum}`,
                achieved: weekTotal,
                target: (currentHabit.target || 0) * requiredDays,
                days: daysCompleted,
                targetDays: requiredDays,
                percentage: percentage || 0,
                isSuccess: isWeekSuccessful
            });

            currentWeekStart = new Date(actualWeekEnd);
            currentWeekStart.setDate(currentWeekStart.getDate() + 1);
            weekNum++;
        }

        return weeklyData;
    };

    const weeklyData = calculateWeeklyData();

    // Calculate weeks completed and success rate based on "isSuccess"
    const calculateWeeksStats = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedWeeks = weeklyData.filter((w: any) => w.isSuccess).length;
        const totalWeeks = weeklyData.length;
        const successRate = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

        return { completedWeeks, totalWeeks, successRate };
    };

    const weeksStats = calculateWeeksStats();

    // Calculate total for month/period
    const calculateMonthTotal = () => {
        if (!currentHabit) return { totalValue: 0, totalDays: 0, totalSessions: 0 };

        let startDate, endDate;

        if (timeRange === 'Month') {
            startDate = new Date(selectedYear, selectedMonth, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        } else if (timeRange === 'Half-year') {
            startDate = new Date(selectedYear, selectedMonth - 5, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        } else {
            startDate = new Date(selectedYear, selectedMonth - 11, 1);
            endDate = new Date(selectedYear, selectedMonth + 1, 0);
        }

        let totalValue = 0;
        let totalDays = 0;
        let totalSessions = 0;

        let currentDay = new Date(startDate);
        while (currentDay <= endDate) {
            const dateKey = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
            const value = currentHabit.completions[dateKey];

            if (currentHabit.measurable) {
                totalValue += (value as number) || 0;
                if ((value as number) > 0) totalDays++;
            } else {
                if (value === true) {
                    totalSessions++;
                    totalDays++;
                }
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }

        return { totalValue, totalDays, totalSessions };
    };

    const monthStats = calculateMonthTotal();

    const changeMonth = (direction: number) => {
        let newMonth = selectedMonth + direction;
        let newYear = selectedYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 max-w-lg mx-auto shadow-2xl overflow-x-hidden relative">
            <div className="bg-white px-5 pt-8 pb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">Progress</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex gap-2 mb-3">
                    {timeRanges.map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${timeRange === range
                                ? 'bg-lime-400 text-gray-900 shadow-sm'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-xl p-2">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                            {monthNames[selectedMonth]} {selectedYear}
                        </span>
                    </button>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {showMonthPicker && (
                    <div className="absolute z-20 bg-white rounded-2xl shadow-lg p-4 mt-2 left-5 right-5">
                        <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((month, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedMonth(idx);
                                        setShowMonthPicker(false);
                                    }}
                                    className={`py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${idx === selectedMonth
                                        ? 'bg-lime-400 text-gray-900'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <select
                    value={selectedHabit}
                    onChange={(e) => setSelectedHabit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none text-sm text-gray-900 bg-white"
                >
                    {habits.map(habit => (
                        <option key={habit.id} value={habit.id}>
                            {habit.icon} {habit.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="px-5 pt-4 space-y-3">
                <div className="bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-4 shadow-md relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <span className="text-3xl">{insights[currentInsight]?.icon}</span>
                        <p className="text-sm font-medium text-gray-900 flex-1 leading-relaxed">
                            {insights[currentInsight]?.message}
                        </p>
                    </div>

                    {insights.length > 1 && (
                        <div className="flex gap-1.5 justify-center mt-3">
                            {insights.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentInsight(idx)}
                                    className={`h-1.5 rounded-full transition-all cursor-pointer ${currentInsight === idx ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-700/30'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                        {monthNames[selectedMonth]} {selectedYear} Summary
                    </h3>

                    {currentHabit?.measurable ? (
                        <div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-lime-500">{monthStats.totalValue}</span>
                                <span className="text-lg text-gray-500">{currentHabit.unit}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Total {currentHabit.unit} • {monthStats.totalDays} active days
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-lime-500">{monthStats.totalSessions}</span>
                                <span className="text-lg text-gray-500">sessions</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Total sessions completed
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs text-gray-500 mb-1">Weeks Done</p>
                        <p className="text-2xl font-bold text-lime-500">{weeksStats.completedWeeks}</p>
                        <p className="text-xs text-gray-400">of {weeksStats.totalWeeks}</p>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                            <div
                                className="h-full bg-lime-400 rounded-full"
                                style={{ width: `${weeksStats.successRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                        <p className="text-2xl font-bold text-lime-500">{weeksStats.successRate}%</p>
                        <p className="text-xs text-gray-400">{weeksStats.completedWeeks} of {weeksStats.totalWeeks} weeks</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Weekly Breakdown</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {weeklyData.length} weeks
                        </span>
                    </div>

                    <div className="relative h-40 mb-4">
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
                            <span>100%</span>
                            <span>50%</span>
                            <span>0%</span>
                        </div>

                        <div className="ml-10 h-full flex items-end justify-between gap-0.5 border-b border-l border-gray-200">
                            {weeklyData.map((week, idx) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const height = (week as any).percentage;
                                const isAboveTarget = height >= 100;

                                return (
                                    <div key={idx} className="flex-1 relative h-full flex flex-col justify-end items-center group">
                                        <div className="absolute -top-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <p className="font-semibold">{(week as any).week}</p>
                                            {currentHabit?.measurable ? (
                                                <>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p>Achieved: {(week as any).achieved}</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p>Target: {(week as any).target}</p>
                                                </>
                                            ) : (
                                                <>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p>Days: {(week as any).days}</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p>Target: {(week as any).targetDays}</p>
                                                </>
                                            )}
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <p>{(week as any).percentage}%</p>
                                        </div>

                                        <div
                                            className={`w-full ${weeklyData.length <= 10 ? 'rounded-t-lg' : 'rounded-t'} transition-all ${isAboveTarget ? 'bg-lime-400' :
                                                height >= 75 ? 'bg-lime-300' :
                                                    height >= 50 ? 'bg-yellow-300' :
                                                        height >= 25 ? 'bg-orange-300' : 'bg-red-300'
                                                }`}
                                            style={{ height: `${height}%`, minHeight: '3px' }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {weeklyData.length <= 10 && (
                        <div className="ml-10 flex justify-between text-xs text-gray-500 mt-6">
                            {weeklyData.map((week, idx) => (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                <span key={idx} className="flex-1 text-center">{(week as any).week}</span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-lime-400"></div>
                            <span className="text-xs text-gray-600">100%+</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-yellow-300"></div>
                            <span className="text-xs text-gray-600">50-74%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-orange-300"></div>
                            <span className="text-xs text-gray-600">&lt;50%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 w-full max-w-lg left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-100 px-6 pt-2 pb-6 z-50">
                <div className="flex items-center justify-around relative">
                    <button
                        onClick={() => onNavigate('today')}
                        className="flex flex-col items-center gap-1 py-2 text-gray-400 cursor-pointer"
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Home</span>
                    </button>

                    <button className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                        <Plus className="w-7 h-7 text-white" />
                    </button>

                    <button className="flex flex-col items-center gap-1 py-2 text-lime-500 cursor-pointer">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-xs font-medium">Progress</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
