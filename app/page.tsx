'use client';

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { TodayDashboard } from '@/components/TodayDashboard';
import { ProgressScreen } from '@/components/ProgressScreen';
import { CreateHabitScreen } from '@/components/CreateHabitScreen';
import { HabitDetailScreen } from '@/components/HabitDetailScreen';
import type { UIHabit } from '@/types/ui';

import { LogProgressModal } from '@/components/LogProgressModal';

export default function Home() {
  const [screen, setScreen] = useState('welcome');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [habits, setHabits] = useState<UIHabit[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingHabit, setEditingHabit] = useState<UIHabit | null>(null);
  const [loggingHabit, setLoggingHabit] = useState<UIHabit | null>(null);

  // Fetch habits from API
  useEffect(() => {
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
              icon: h.icon || '✨',
              color: h.color || '#4fd1c5',
              todayValue,
              completions,
            };
          });
          setHabits(transformedHabits);
        }
      } catch (error) {
        console.error('Failed to fetch habits', error);
      } finally {
        setLoading(false);
      }
    };

    if (screen !== 'welcome') {
      fetchHabits();
    }
  }, [screen]);

  const navigate = (newScreen: string, habitId?: string) => {
    setScreen(newScreen);
    if (habitId) setSelectedHabitId(habitId);
    if (newScreen !== 'create') setEditingHabit(null); // Clear edit state on nav
  };

  const handleGetStarted = () => {
    setScreen('today');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateHabit = async (habitData: any) => {
    try {
      const url = habitData.id ? `/api/habits/${habitData.id}` : '/api/habits';
      const method = habitData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      if (res.ok) {
        setScreen('today'); // Will trigger refetch
        setEditingHabit(null);
      }
    } catch (error) {
      console.error('Failed to save habit', error);
    }
  };

  const handleLogHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (habit.measurable) {
      setLoggingHabit(habit);
      return;
    }

    // Boolean logic remains same
    const date = new Date().toISOString().split('T')[0];
    const currentValue = habit.todayValue;
    // Toggle
    await submitLog(habitId, date, !currentValue);
  };

  const handleConfirmLog = async (newValue: number) => {
    if (!loggingHabit) return;
    const date = new Date().toISOString().split('T')[0];
    await submitLog(loggingHabit.id, date, newValue);
    setLoggingHabit(null);
  };

  const submitLog = async (habitId: string, date: string, value: number | boolean) => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          date,
          ...(typeof value === 'number' ? { numericValue: value } : { booleanValue: value })
        }),
      });

      if (res.ok) {
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              todayValue: value,
              completions: {
                ...h.completions,
                [date]: value
              }
            };
          }
          return h;
        }));
      }
    } catch (error) {
      console.error('Failed to log habit', error);
    }
  };

  const handleArchiveHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to archive this habit?')) return;

    try {
      const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
      if (res.ok) {
        setHabits(prev => prev.filter(h => h.id !== habitId));
      }
    } catch (error) {
      console.error('Failed to archive habit', error);
    }
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
        {screen === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}

        {screen === 'today' && (
          <TodayDashboard
            habits={habits}
            onNavigate={navigate}
            onAddHabit={() => {
              setEditingHabit(null);
              navigate('create');
            }}
            onLogHabit={handleLogHabit}
            onEditHabit={(habit) => {
              setEditingHabit(habit);
              setScreen('create');
            }}
            onArchiveHabit={handleArchiveHabit}
          />
        )}

        {screen === 'progress' && (
          <ProgressScreen habits={habits} onNavigate={navigate} />
        )}

        {screen === 'create' && (
          <CreateHabitScreen
            onBack={() => setScreen('today')}
            onCreate={handleCreateHabit}
            initialData={editingHabit}
          />
        )}

        {screen === 'detail' && selectedHabit && (
          <HabitDetailScreen
            habit={selectedHabit}
            onBack={() => setScreen('today')}
            onLogHabit={handleLogHabit}
          />
        )}

        {loggingHabit && (
          <LogProgressModal
            habit={loggingHabit}
            onClose={() => setLoggingHabit(null)}
            onConfirm={handleConfirmLog}
          />
        )}
      </div>
    </div>
  );
}
