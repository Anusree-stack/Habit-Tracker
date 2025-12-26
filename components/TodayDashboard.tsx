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
    onSignOut?: () => void;
    currentUser?: { name: string; email: string };
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
    habits,
    onNavigate,
    onAddHabit,
    onLogHabit,
    onEditHabit,
    onArchiveHabit,
    onSignOut,
    currentUser
}) => {
    const weekDays = ['Wed', 'Thus', 'Fri', 'Sat', 'Sun'];
    const dates = [20, 21, 22, 23, 24]; // TODO: Dynamic dates
    const currentDate = 22; // TODO: Dynamic current date
    const [activeMenuHabitId, setActiveMenuHabitId] = React.useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-lime-100 text-lime-700 font-bold text-lg border-2 border-white shadow-sm">
                            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Good morning,</p>
                            <p className="font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSidebarOpen(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        >
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

            {/* Sidebar */}
            {sidebarOpen && (
                <>
                    {/* Overlay with glassmorphism to show the screen behind - removing the black bar strip */}
                    <div
                        className="fixed inset-0 bg-white/20 backdrop-blur-[2px] z-40 transition-all duration-300"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-50 flex flex-col animate-slide-in">
                        {/* Header with Lime Gradient to match Goal Achieved color */}
                        <div className="relative p-6 pb-12 bg-gradient-to-br from-lime-400 to-lime-500 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-all duration-200 z-10"
                            >
                                <X className="w-5 h-5 text-gray-800" />
                            </button>

                            <div className="relative z-10 mt-4">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Step Up</h2>
                                <p className="text-gray-800 text-sm mt-1 opacity-70 font-medium tracking-wide">Build your best self</p>
                            </div>
                        </div>

                        {/* User Info Card with Generic Avatar (removing creepy profile pic) */}
                        {currentUser && (
                            <div className="px-6 -mt-8 mb-8 relative z-20">
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-gray-100/80 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-lime-100 text-lime-700 font-bold text-2xl ring-4 ring-lime-50 border-2 border-white shadow-sm">
                                                {currentUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-lg truncate leading-tight">{currentUser.name}</p>
                                            <p className="text-[11px] text-gray-400 truncate mt-1.5 font-semibold uppercase tracking-wider">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Menu Items (Simplified: Only Dashboard and Analytics) */}
                        <div className="flex-1 px-4 space-y-2 overflow-y-auto pt-2">
                            <button
                                onClick={() => {
                                    onNavigate('today');
                                    setSidebarOpen(false);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-lime-50 transition-all duration-200 text-left group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center group-hover:bg-lime-400 transition-all duration-300">
                                    <Home className="w-5 h-5 text-lime-600 group-hover:text-gray-900 transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Dashboard</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Your daily overview</span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onNavigate('progress');
                                    setSidebarOpen(false);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-lime-50 transition-all duration-200 text-left group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center group-hover:bg-lime-400 transition-all duration-300">
                                    <TrendingUp className="w-5 h-5 text-lime-600 group-hover:text-gray-900 transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Analytics</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Track your progress</span>
                                </div>
                            </button>
                        </div>

                        {/* Sign Out Button - Modern Gradient */}
                        {onSignOut && (
                            <div className="p-6 bg-white border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        onSignOut();
                                    }}
                                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-black transition-all duration-300 shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <svg className="w-5 h-5 scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <style jsx>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        .animate-slide-in {
                            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                    `}</style>
                </>
            )}
        </div>
    );
};
