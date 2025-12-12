'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { UIHabit } from '../types/ui';

interface LogProgressModalProps {
    habit: UIHabit;
    onClose: () => void;
    onConfirm: (value: number) => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({ habit, onClose, onConfirm }) => {
    const [value, setValue] = useState<string>('');

    const currentTotal = typeof habit.todayValue === 'number' ? habit.todayValue : 0;
    const target = habit.target || 0;
    const remaining = Math.max(0, target - currentTotal);

    useEffect(() => {
        // Pre-fill with remaining or empty? Empty might be better for "logging what I did now"
        // User complaint: "adding progress 1 at a time will take hours". 
        // This implies they want to add a specific amount they just did.
        // However, the backend logic I changed earlier replaces the total.
        // Wait, the user said "If I am adding 5.xxxx". 
        // And "The added progress should never be more than the commited values".
        // Does this mean total for the day, or single entry?
        // "not be able to add 15-20, or even if added the max should be 8."
        // This strongly implies the TOTAL for the day should not exceed target.
        // My previous backend change SETS the value.
        // If I want to support "Adding" chunks, I should calculate the new total here.

        // Let's assume the user enters the amount they JUST did (e.g., drank 1 glass).
        // Or they enter the new total?
        // "adding custom values, instead of adding" sounds like "Add 5000 steps" to the existing count.
        // Let's support "Add to existing" flow in UI, but calculate final total to send.
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let numVal = parseFloat(value);

        if (isNaN(numVal)) return;

        // Rounding requirement: "5.xxxx -> 5.x"
        numVal = Math.round(numVal * 10) / 10;

        // Validation requirement: "added progress should never be more than the committed values"
        // Interpretation: The resulting TOTAL should not exceed target.
        // "even if added the max should be 8"

        let newTotal = currentTotal + numVal;

        // Check constraint
        if (newTotal > target) {
            newTotal = target;
        }

        onConfirm(newTotal);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-scale-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Log Progress</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
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
