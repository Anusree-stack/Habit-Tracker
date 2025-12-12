'use client';

import { PRESET_HABITS, PresetHabit } from '@/lib/types';
import { useState } from 'react';

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, type: 'MEASURABLE' | 'BOOLEAN', unit?: string) => Promise<void>;
}

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
    const [mode, setMode] = useState<'select' | 'custom'>('select');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [customName, setCustomName] = useState('');
    const [customType, setCustomType] = useState<'MEASURABLE' | 'BOOLEAN'>('MEASURABLE');
    const [customUnit, setCustomUnit] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const categories = ['All', ...Array.from(new Set(PRESET_HABITS.map(h => h.category)))];
    const filteredHabits = selectedCategory === 'All'
        ? PRESET_HABITS
        : PRESET_HABITS.filter(h => h.category === selectedCategory);

    const handleAddPreset = async (preset: PresetHabit) => {
        if (isAdding) return;
        setIsAdding(true);
        try {
            await onAdd(preset.name, preset.type, preset.unit);
            onClose();
            resetForm();
        } finally {
            setIsAdding(false);
        }
    };

    const handleAddCustom = async () => {
        if (isAdding || !customName.trim()) return;
        if (customType === 'MEASURABLE' && !customUnit.trim()) {
            alert('Please enter a unit for measurable habits');
            return;
        }

        setIsAdding(true);
        try {
            await onAdd(customName.trim(), customType, customType === 'MEASURABLE' ? customUnit.trim() : undefined);
            onClose();
            resetForm();
        } finally {
            setIsAdding(false);
        }
    };

    const resetForm = () => {
        setMode('select');
        setSelectedCategory('All');
        setCustomName('');
        setCustomType('MEASURABLE');
        setCustomUnit('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Add New Habit</h2>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-border">
                    <button
                        onClick={() => setMode('select')}
                        className={`flex-1 py-3 font-medium transition-colors ${mode === 'select'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Choose from Presets
                    </button>
                    <button
                        onClick={() => setMode('custom')}
                        className={`flex-1 py-3 font-medium transition-colors ${mode === 'custom'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Create Custom
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {mode === 'select' ? (
                        <>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                                ? 'bg-primary text-white'
                                                : 'bg-muted text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredHabits.map((habit, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAddPreset(habit)}
                                        disabled={isAdding}
                                        className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all disabled:opacity-50"
                                    >
                                        <div className="font-medium text-foreground">{habit.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {habit.type === 'MEASURABLE' ? `Track in ${habit.unit}` : 'Yes/No'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="e.g., Morning meditation"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setCustomType('MEASURABLE')}
                                        className={`p-4 rounded-lg border-2 transition-all ${customType === 'MEASURABLE'
                                                ? 'border-primary bg-primary bg-opacity-5'
                                                : 'border-border hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="font-medium">Measurable</div>
                                        <div className="text-sm text-gray-500 mt-1">Track quantity or time</div>
                                    </button>
                                    <button
                                        onClick={() => setCustomType('BOOLEAN')}
                                        className={`p-4 rounded-lg border-2 transition-all ${customType === 'BOOLEAN'
                                                ? 'border-primary bg-primary bg-opacity-5'
                                                : 'border-border hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="font-medium">Yes/No</div>
                                        <div className="text-sm text-gray-500 mt-1">Did it or didn't</div>
                                    </button>
                                </div>
                            </div>

                            {customType === 'MEASURABLE' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        value={customUnit}
                                        onChange={(e) => setCustomUnit(e.target.value)}
                                        placeholder="e.g., minutes, km, glasses"
                                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleAddCustom}
                                disabled={isAdding || !customName.trim()}
                                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium"
                            >
                                {isAdding ? 'Adding...' : 'Add Habit'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
