'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface LandingScreenProps {
  onGetStarted: () => void;
}

interface SignInScreenProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp: () => void;
  error?: string;
}

interface SignUpScreenProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToSignIn: () => void;
  error?: string;
}

// Landing Screen (First screen with StepUp branding)
export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => (
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
        className="w-full bg-white text-gray-900 py-4 rounded-full font-semibold text-lg flex items-center justify-between px-6 shadow-lg hover:shadow-xl transition-all"
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

// Sign In Screen
export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn, onSwitchToSignUp, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      setLocalError('');
      try {
        await onSignIn(email, password);
      } catch (err) {
        setLocalError('Failed to sign in. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-lime-500 flex flex-col p-8">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          {/* Improved Isometric Logo */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Isometric StepUp Logo */}
                <path d="M30 70 L30 50 L50 40 L50 60 Z" fill="#84CC16" opacity="0.8" />
                <path d="M50 60 L50 40 L70 50 L70 70 Z" fill="#65A30D" opacity="0.9" />
                <path d="M30 50 L50 40 L70 50 L50 60 Z" fill="#A3E635" />
                {/* Checkmark */}
                <path d="M35 55 L45 65 L65 45" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-800">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {(error || localError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error || localError}
            </div>
          )}

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Sign Up Screen
export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToSignIn, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    if (name && email && password) {
      setLoading(true);
      try {
        await onSignUp(name, email, password);
      } catch (err) {
        setLocalError('Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-lime-500 flex flex-col p-8">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          {/* Improved Isometric Logo with Plus */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl transform -rotate-6"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Isometric StepUp Logo */}
                <path d="M30 70 L30 50 L50 40 L50 60 Z" fill="#84CC16" opacity="0.8" />
                <path d="M50 60 L50 40 L70 50 L70 70 Z" fill="#65A30D" opacity="0.9" />
                <path d="M30 50 L50 40 L70 50 L50 60 Z" fill="#A3E635" />
                {/* Plus icon for new account */}
                <circle cx="65" cy="35" r="12" fill="white" />
                <path d="M65 29 L65 41 M59 35 L71 35" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-800">Start building better habits today</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {(error || localError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error || localError}
            </div>
          )}

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sara Anderson"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none bg-white"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};