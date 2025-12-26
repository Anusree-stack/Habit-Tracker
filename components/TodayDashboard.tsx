'use client';

import React from 'react';
import { Plus, Bell, Menu, ChevronLeft, ChevronRight, Home, TrendingUp, X, MoreVertical } from 'lucide-react';

// Define types locally for now to match the reference UI's expectations
// These will be fed by transformed data from the backend
export interface UIHabit {
    id: string;
    name: string;
    description?: string;
    measurable: boolean;
    unit?: string;
    target?: number;
    todayValue: number | boolean;
    icon: string;
    color: string;
    frequency: string;
    daysPerWeek: number;
    completions: Record<string, number | boolean>;
}

interface TodayDashboardProps {
    habits: UIHabit[];
    onNavigate: (screen: string, habitId?: string) => void;
    onAddHabit: () => void;
    onLogHabit: (habitId: string) => void;
    onEditHabit: (habit: UIHabit) => void;
    onArchiveHabit: (habitId: string) => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
    habits,
    onNavigate,
    onAddHabit,
    onLogHabit,
    onEditHabit,
    onArchiveHabit
}) => {
    const weekDays = ['Wed', 'Thus', 'Fri', 'Sat', 'Sun'];
    const dates = [20, 21, 22, 23, 24]; // TODO: Dynamic dates
    const currentDate = 22; // TODO: Dynamic current date
    const [activeMenuHabitId, setActiveMenuHabitId] = React.useState<string | null>(null);

    // Format large numbers (e.g., 1000 -> 1k, 1500 -> 1.5k)
    const formatNumber = (num: number | boolean) => {
        if (typeof num === 'boolean') return num ? '1' : '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 max-w-lg mx-auto shadow-2xl overflow-x-hidden relative" onClick={() => setActiveMenuHabitId(null)}>
            <div className="bg-white px-6 pt-12 pb-6">
                {/* ... header content ... */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm text-gray-500">Good morning,</p>
                            <p className="font-semibold text-gray-900">Sara Anderson</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Aug 2025</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex justify-between gap-2">
                    {weekDays.map((day, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 text-center py-3 rounded-2xl transition-all ${dates[idx] === currentDate
                                ? 'bg-lime-400 text-gray-900'
                                : 'bg-gray-50 text-gray-600'
                                }`}
                        >
                            <div className="text-xs mb-1">{day}</div>
                            <div className="font-semibold">{dates[idx]}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Daily habits</h2>
                    <button className="text-sm text-gray-600 cursor-pointer">See more</button>
                </div>

                <div className="space-y-4">
                    {habits.map(habit => {
                        const progress = habit.measurable
                            ? ((habit.todayValue as number) / (habit.target || 1)) * 100
                            : (habit.todayValue ? 100 : 0);

                        const isCompleted = progress >= 100;

                        return (
                            <div
                                key={habit.id}
                                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                onClick={() => onNavigate('detail', habit.id)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{habit.name}</h3>
                                        <p className="text-sm text-gray-500">{habit.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {habit.frequency === 'daily'
                                                ? 'Every day'
                                                : `${habit.daysPerWeek} days a week`}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuHabitId(activeMenuHabitId === habit.id ? null : habit.id);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5 text-gray-400" />
                                        </button>

                                        {activeMenuHabitId === habit.id && (
                                            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 min-w-[120px]">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditHabit(habit);
                                                        setActiveMenuHabitId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onArchiveHabit(habit.id);
                                                        setActiveMenuHabitId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Archive
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    {isCompleted ? (
                                        <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-default">
                                            <span>Goal Achieved! 🎉</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLogHabit(habit.id);
                                            }}
                                            className="bg-lime-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-lime-500 transition-colors shadow-sm cursor-pointer z-10"
                                        >
                                            <Plus className="w-4 h-4" />
                                            {habit.measurable ? `Add ${habit.unit?.slice(0, -1) || 'unit'}` : 'Mark Done'}
                                        </button>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{habit.icon}</span>
                                        <div className="relative w-14 h-14">
                                            <svg className="w-14 h-14 transform -rotate-90">
                                                <circle
                                                    cx="28"
                                                    cy="28"
                                                    r="24"
                                                    stroke="#F3F4F6"
                                                    strokeWidth="5"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="28"
                                                    cy="28"
                                                    r="24"
                                                    stroke={habit.color}
                                                    strokeWidth="5"
                                                    fill="none"
                                                    strokeDasharray={`${2 * Math.PI * 24}`}
                                                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-300"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="text-xs font-bold text-gray-900">
                                                    {habit.measurable
                                                        ? `${formatNumber(habit.todayValue)}/${formatNumber(habit.target || 0)}`
                                                        : (habit.todayValue ? '✓' : '○')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="fixed bottom-0 w-full max-w-lg left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-100 px-6 pt-2 pb-6 safe-area-bottom z-50">
                <div className="flex items-center justify-around relative">
                    <button
                        onClick={() => onNavigate('today')}
                        className="flex flex-col items-center gap-1 py-2 text-lime-500 cursor-pointer"
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Home</span>
                    </button>

                    <button
                        onClick={onAddHabit}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                        <Plus className="w-7 h-7 text-white" />
                    </button>

                    <button
                        onClick={() => onNavigate('progress')}
                        className="flex flex-col items-center gap-1 py-2 text-gray-400 cursor-pointer"
                    >
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-xs font-medium">Progress</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
