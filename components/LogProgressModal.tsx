'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { UIHabit } from '../types/ui';

interface LogProgressModalProps {
    habit: UIHabit;
    onCancel: () => void;
    onConfirm: (value: number) => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({ habit, onCancel, onConfirm }) => {
    const [value, setValue] = useState<string>('');

    const currentTotal = typeof habit.todayValue === 'number' ? habit.todayValue : 0;
    const target = habit.target || 0;
    const remaining = Math.max(0, target - currentTotal);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let numVal = parseFloat(value);

        if (isNaN(numVal)) return;

        // Rounding requirement: "5.xxxx -> 5.x"
        numVal = Math.round(numVal * 10) / 10;

        // Validation requirement: "added progress should never be more than the committed values"
        // Interpretation: The resulting TOTAL should not exceed target.

        let newTotal = currentTotal + numVal;

        // Check constraint
        if (newTotal > target) {
            newTotal = target;
        }

        onConfirm(newTotal);
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-scale-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Log Progress</h3>
                    <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <span className="font-semibold text-gray-700">{habit.name}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Current: {currentTotal}</span>
                        <span>Target: {target} {habit.unit}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div
                            className="bg-lime-400 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (currentTotal / (target || 1)) * 100)}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        How much did you do just now?
                    </label>
                    <div className="relative mb-6">
                        <input
                            type="number"
                            step="0.1"
                            autoFocus
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Amount in ${habit.unit}`}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900 text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!value}
                        className="w-full bg-lime-400 text-gray-900 py-3 rounded-full font-semibold hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Update Progress
                    </button>
                </form>
            </div>
        </div>
    );
};
