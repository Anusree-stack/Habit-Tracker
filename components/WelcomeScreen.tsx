'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-lime-500 flex flex-col justify-between p-8">
        <div className="flex-1 flex items-center justify-center">
            <div className="text-white opacity-20 text-9xl font-black transform -rotate-12">
                <div className="mb-4">STEP</div>
                <div className="ml-12">UP</div>
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome to StepUp</h1>
                <p className="text-lg text-gray-800 opacity-80">Build better habits — every day</p>
            </div>

            <button
                onClick={onGetStarted}
                className="w-full bg-white text-gray-900 py-4 rounded-full font-semibold text-lg flex items-center justify-between px-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
                <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-gray-900" />
                </div>
                <span>Get started</span>
                <div className="w-10"></div>
            </button>
        </div>
    </div>
);
