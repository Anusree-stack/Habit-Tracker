'use client';

import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { UIHabit } from '../types/ui';

interface HabitDetailScreenProps {
    habit: UIHabit;
    onBack: () => void;
    onLogHabit: (habitId: string) => void;
}

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({ habit, onBack, onLogHabit }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Format large numbers
    const formatNumber = (num: number | boolean) => {
        if (typeof num === 'boolean') return num ? '1' : '0';
        return num.toString();
    };

    const today = new Date();

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
                {/* ... header ... */}
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">{habit.name}</h1>
                        <p className="text-xs text-gray-500">{habit.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Target: <span className="text-lime-600 font-medium">{habit.measurable ? `${habit.target} ${habit.unit}` : 'Complete daily'}</span>
                        </p>
                    </div>
                    <span className="text-2xl">{habit.icon}</span>
                </div>
            </div>

            <div className="px-6 pt-6 space-y-6">
                {/* ... progress circle ... */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today Progress</h3>

                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#F3F4F6" strokeWidth="12" fill="none" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={habit.color}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (habit.measurable ? ((habit.todayValue as number) / (habit.target || 1)) : (habit.todayValue ? 1 : 0)))}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {habit.measurable ? formatNumber(habit.todayValue) : (habit.todayValue ? '✓' : '○')}
                                </div>
                                {habit.measurable && <div className="text-sm text-gray-500">of {habit.target}</div>}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onLogHabit(habit.id)}
                        className="w-full bg-lime-400 text-gray-900 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-lime-500 transition-colors cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {habit.measurable ? `Add ${habit.unit?.slice(0, -1) || 'unit'}` : 'Mark Complete'}
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">{monthNames[month]} {year}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-3">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, idx) => {
                            if (!day) {
                                return <div key={idx} className="aspect-square"></div>;
                            }

                            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayValue = habit.completions[dateKey];
                            const isComplete = habit.measurable
                                ? (typeof dayValue === 'number' && dayValue >= (habit.target || 0))
                                : dayValue === true;
                            const isPartial = habit.measurable && dayValue !== undefined && (dayValue as number) > 0 && (dayValue as number) < (habit.target || 0);

                            // Check if this specific calendar day is today
                            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                            // Check if date is in the future
                            const cellDate = new Date(year, month, day);
                            const isFuture = cellDate > today;

                            return (
                                <div
                                    key={idx}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                    ${isComplete ? 'bg-lime-400 text-gray-900' : ''}
                    ${isPartial ? 'bg-orange-200 text-gray-700' : ''}
                    ${!dayValue && !isFuture ? 'bg-gray-100 text-gray-400' : ''}
                    ${isFuture ? 'bg-gray-50 text-gray-300' : ''}
                    ${isToday ? 'ring-2 ring-lime-500 ring-offset-2' : ''}
                  `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-lime-400"></div>
                            <span className="text-xs text-gray-600">Completed</span>
                        </div>
                        {habit.measurable && (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-orange-200"></div>
                                <span className="text-xs text-gray-600">Partial</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-100"></div>
                            <span className="text-xs text-gray-600">Missed</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
                        <p className="text-3xl font-bold text-lime-500 mb-1">100%</p>
                        <p className="text-sm text-gray-600">7-Day Rate</p>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
                        <p className="text-3xl font-bold" style={{ color: habit.color }}>85%</p>
                        <p className="text-sm text-gray-600">30-Day Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
