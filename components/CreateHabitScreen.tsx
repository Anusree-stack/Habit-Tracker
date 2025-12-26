'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CreateHabitScreenProps {
    onBack: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCreate: (habitData: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
}

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({ onBack, onCreate, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [measurable, setMeasurable] = useState(initialData?.measurable ?? false);
    const [unit, setUnit] = useState(initialData?.unit || 'minutes');
    const [customUnit, setCustomUnit] = useState('');
    const [target, setTarget] = useState(initialData?.target?.toString() || '');
    const [frequency, setFrequency] = useState(initialData?.frequency || 'daily');
    const [daysPerWeek, setDaysPerWeek] = useState(initialData?.daysPerWeek?.toString() || '7');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Set custom unit if needed
    React.useEffect(() => {
        if (initialData?.unit && !['minutes', 'hours', 'glasses', 'pages', 'km'].includes(initialData.unit)) {
            setUnit('custom');
            setCustomUnit(initialData.unit);
        }
    }, [initialData]);

    const commonHabits = [
        { name: 'Running', icon: '🏃', measurable: true, unit: 'km', target: '5' },
        { name: 'Swimming', icon: '🏊', measurable: true, unit: 'minutes', target: '30' },
        { name: 'Rowing', icon: '🚣', measurable: true, unit: 'minutes', target: '20' },
        { name: 'Meditation', icon: '🧘', measurable: true, unit: 'minutes', target: '10' },
        { name: 'Reading', icon: '📚', measurable: true, unit: 'pages', target: '20' },
        { name: 'Drink Water', icon: '💧', measurable: true, unit: 'glasses', target: '8' },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectSuggestion = (habit: any) => {
        setName(habit.name);
        setMeasurable(habit.measurable);
        if (habit.measurable) {
            setUnit(habit.unit);
            setTarget(habit.target);
        }
        setShowSuggestions(false);
    };

    const handleSubmit = () => {
        const newHabit = {
            id: initialData?.id, // Include ID for updates
            name,
            description,
            type: measurable ? 'MEASURABLE' : 'BOOLEAN',
            unit: measurable ? (unit === 'custom' ? customUnit : unit) : null,
            target: measurable ? parseFloat(target) : null,
            frequency,
            daysPerWeek: frequency === 'daily' ? 7 : parseInt(daysPerWeek),
            icon: commonHabits.find(h => h.name === name)?.icon || '✨', // Default icon if not found
            color: '#4fd1c5', // Default color
        };
        onCreate(newHabit);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 max-w-lg mx-auto shadow-2xl overflow-x-hidden relative">
            <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Create New Habit</h1>
                </div>
            </div>

            <div className="px-6 pt-6 space-y-4">
                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Habit Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }}
                        placeholder="e.g., Morning Meditation"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                    />

                    {showSuggestions && (
                        <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-gray-500 mb-2">SUGGESTIONS</p>
                            <div className="grid grid-cols-2 gap-2">
                                {commonHabits
                                    .filter(h => h.name.toLowerCase().includes(name.toLowerCase()))
                                    .slice(0, 6)
                                    .map((habit, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectSuggestion(habit)}
                                            className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-lime-50 transition-colors text-left cursor-pointer"
                                        >
                                            <span className="text-xl">{habit.icon}</span>
                                            <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a motivating description..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900 resize-none"
                    />
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input
                            type="checkbox"
                            checked={measurable}
                            onChange={(e) => setMeasurable(e.target.checked)}
                            className="w-5 h-5 text-lime-500 rounded focus:ring-lime-400"
                        />
                        <div>
                            <span className="text-gray-900 font-medium block">Make this measurable</span>
                            <span className="text-xs text-gray-500">Track specific values</span>
                        </div>
                    </label>

                    {measurable && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                                >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="glasses">Glasses</option>
                                    <option value="pages">Pages</option>
                                    <option value="km">Kilometers</option>
                                    <option value="custom">Custom / Other</option>
                                </select>
                            </div>

                            {unit === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Custom Unit</label>
                                    <input
                                        type="text"
                                        value={customUnit}
                                        onChange={(e) => setCustomUnit(e.target.value)}
                                        placeholder="e.g., steps, liters"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Daily Target</label>
                                <input
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="10"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
                            <input
                                type="radio"
                                name="frequency"
                                value="daily"
                                checked={frequency === 'daily'}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-4 h-4 text-lime-500"
                            />
                            <span className="text-gray-900 font-medium">Every day</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
                            <input
                                type="radio"
                                name="frequency"
                                value="custom"
                                checked={frequency === 'custom'}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-4 h-4 text-lime-500"
                            />
                            <span className="text-gray-900 font-medium">Custom days per week</span>
                        </label>

                        {frequency === 'custom' && (
                            <div className="ml-10">
                                <input
                                    type="number"
                                    min="1"
                                    max="7"
                                    value={daysPerWeek}
                                    onChange={(e) => setDaysPerWeek(e.target.value)}
                                    className="w-20 px-4 py-2 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-lime-400 text-gray-900 py-4 rounded-full font-semibold text-lg hover:bg-lime-500 transition-colors shadow-sm cursor-pointer"
                >
                    {initialData ? 'Update Habit' : 'Create Habit'}
                </button>
            </div>
        </div>
    );
};
