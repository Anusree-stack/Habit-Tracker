'use client';

import React, { useState, useEffect } from 'react';
import { LandingScreen, SignInScreen, SignUpScreen } from './auth_components';
import { TodayDashboard } from '@/components/TodayDashboard';
import { ProgressScreen } from '@/components/ProgressScreen';
import { CreateHabitScreen } from '@/components/CreateHabitScreen';
import { HabitDetailScreen } from '@/components/HabitDetailScreen';
import type { UIHabit } from '@/types/ui';
import { LogProgressModal } from '@/components/LogProgressModal';

type AuthState = 'landing' | 'signin' | 'signup' | 'authenticated';
type AppScreen = 'today' | 'progress' | 'create' | 'detail';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState('');

  const [screen, setScreen] = useState<AppScreen>('today');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [habits, setHabits] = useState<UIHabit[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingHabit, setEditingHabit] = useState<UIHabit | null>(null);
  const [loggingHabit, setLoggingHabit] = useState<UIHabit | null>(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (data.user) {
        setCurrentUser(data.user);
        setAuthState('authenticated');
      } else {
        // Development mode: auto-signin as Sarah Anderson
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_AUTO_SIGNIN !== 'true') {
          await handleSignIn('sarah@stepup.app', 'password123');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  // Auth handlers
  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      setAuthError('');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setAuthState('authenticated');
      } else {
        setAuthError(data.error || 'Failed to create account');
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setAuthError('');
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setAuthState('authenticated');
      } else {
        setAuthError(data.error || 'Failed to sign in');
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setCurrentUser(null);
      setAuthState('landing');
      setHabits([]);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  // Fetch habits from API (only when authenticated)
  useEffect(() => {
    if (authState === 'authenticated') {
      fetchHabits();
    }
  }, [authState]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/habits');
      if (res.ok) {
        const data = await res.json();
        // Transform DB data to UI data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedHabits: UIHabit[] = data.map((h: any) => {
          const completions: Record<string, number | boolean> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          h.logs?.forEach((log: any) => {
            completions[log.date] = h.type === 'MEASURABLE' ? log.numericValue : log.booleanValue;
          });

          // Get today's value (simple logic, timezone naive for MVP)
          const today = new Date().toISOString().split('T')[0];
          const todayValue = completions[today] ?? (h.type === 'MEASURABLE' ? 0 : false);

          return {
            id: h.id,
            name: h.name,
            description: h.description,
            measurable: h.type === 'MEASURABLE',
            unit: h.unit,
            target: h.target,
            frequency: h.frequency,
            daysPerWeek: h.daysPerWeek,
            icon: h.icon,
            color: h.color,
            todayValue,
            completions,
          };
        });
        setHabits(transformedHabits);
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (habitData: Partial<UIHabit>) => {
    try {
      const payload = {
        name: habitData.name,
        description: habitData.description,
        type: habitData.measurable ? 'MEASURABLE' : 'BOOLEAN',
        unit: habitData.unit,
        target: habitData.target,
        frequency: habitData.frequency,
        daysPerWeek: habitData.daysPerWeek,
        icon: habitData.icon,
        color: habitData.color,
      };

      const url = editingHabit ? `/api/habits/${editingHabit.id}` : '/api/habits';
      const method = editingHabit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchHabits();
        setScreen('today');
        setEditingHabit(null);
      }
    } catch (error) {
      console.error('Failed to create/update habit:', error);
    }
  };

  const handleLogHabit = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    if (habit.measurable) {
      setLoggingHabit(habit);
    } else {
      await logHabitValue(habitId, true);
    }
  };

  const handleConfirmLog = async (value: number) => {
    if (loggingHabit) {
      await logHabitValue(loggingHabit.id, value);
      setLoggingHabit(null);
    }
  };

  const logHabitValue = async (habitId: string, value: number | boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const payload: any = {
        habitId,
        date: today,
      };

      // Send the correct field based on value type
      if (typeof value === 'number') {
        payload.numericValue = value;
      } else {
        payload.booleanValue = value;
      }

      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchHabits();
      } else {
        const error = await res.json();
        console.error('Failed to log habit:', error);
      }
    } catch (error) {
      console.error('Failed to log habit:', error);
    }
  };

  const handleEditHabit = (habit: UIHabit) => {
    setEditingHabit(habit);
    setScreen('create');
  };

  const handleArchiveHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchHabits();
      }
    } catch (error) {
      console.error('Failed to archive habit:', error);
    }
  };

  const handleNavigate = (newScreen: string, habitId?: string) => {
    if (newScreen === 'detail' && habitId) {
      setSelectedHabitId(habitId);
      setScreen('detail');
    } else if (newScreen === 'create') {
      setEditingHabit(null);
      setScreen('create');
    } else {
      setScreen(newScreen as AppScreen);
    }
  };

  // Render auth screens
  if (authState === 'landing') {
    return <LandingScreen onGetStarted={() => setAuthState('signin')} />;
  }

  if (authState === 'signin') {
    return (
      <SignInScreen
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setAuthState('signup')}
        error={authError}
      />
    );
  }

  if (authState === 'signup') {
    return (
      <SignUpScreen
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setAuthState('signin')}
        error={authError}
      />
    );
  }

  // Render main app (authenticated)
  if (loading && habits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {screen === 'today' && (
        <TodayDashboard
          habits={habits}
          onNavigate={handleNavigate}
          onAddHabit={() => setScreen('create')}
          onLogHabit={handleLogHabit}
          onEditHabit={handleEditHabit}
          onArchiveHabit={handleArchiveHabit}
          onSignOut={handleSignOut}
          currentUser={currentUser || undefined}
        />
      )}

      {screen === 'progress' && (
        <ProgressScreen
          habits={habits}
          onNavigate={handleNavigate}
          currentUser={currentUser || undefined}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'create' && (
        <CreateHabitScreen
          onCreate={handleCreateHabit}
          onBack={() => {
            setScreen('today');
            setEditingHabit(null);
          }}
          initialData={editingHabit || undefined}
        />
      )}

      {screen === 'detail' && selectedHabitId && (
        <HabitDetailScreen
          habit={habits.find((h) => h.id === selectedHabitId)!}
          onBack={() => setScreen('today')}
          onLogHabit={handleLogHabit}
        />
      )}

      {loggingHabit && (
        <LogProgressModal
          habit={loggingHabit}
          onConfirm={handleConfirmLog}
          onCancel={() => setLoggingHabit(null)}
        />
      )}
    </>
  );
}
