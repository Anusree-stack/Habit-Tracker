import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateStreak } from '@/lib/utils';

// GET /api/analytics?habitId=xxx&days=7
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const habitId = searchParams.get('habitId');
        const days = parseInt(searchParams.get('days') || '7');

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        if (habitId) {
            // Analytics for a specific habit
            const habit = await prisma.habit.findUnique({
                where: { id: habitId },
            });

            if (!habit) {
                return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
            }

            const logs = await prisma.habitLog.findMany({
                where: {
                    habitId,
                    date: {
                        gte: startDateStr,
                        lte: endDateStr,
                    },
                },
                orderBy: { date: 'asc' },
            });

            // Calculate all logs for streak
            const allLogs = await prisma.habitLog.findMany({
                where: { habitId },
                orderBy: { date: 'desc' },
            });

            const completedDays = logs.filter((log: { booleanValue?: boolean | null; numericValue?: number | null }) => {
                if (habit.type === 'BOOLEAN') {
                    return log.booleanValue === true;
                } else {
                    return (log.numericValue || 0) > 0;
                }
            }).length;

            const completionRate = days > 0 ? (completedDays / days) * 100 : 0;

            const totalValue = habit.type === 'MEASURABLE'
                ? logs.reduce((sum: number, log: { numericValue?: number | null }) => sum + (log.numericValue || 0), 0)
                : null;

            const averageValue = habit.type === 'MEASURABLE' && completedDays > 0
                ? totalValue! / completedDays
                : null;

            const streak = calculateStreak(allLogs.filter((log: { booleanValue?: boolean | null; numericValue?: number | null }) => {
                if (habit.type === 'BOOLEAN') {
                    return log.booleanValue === true;
                } else {
                    return (log.numericValue || 0) > 0;
                }
            }));

            return NextResponse.json({
                habitId,
                habitName: habit.name,
                habitType: habit.type,
                unit: habit.unit,
                days,
                completedDays,
                completionRate,
                totalValue,
                averageValue,
                streak,
            });
        } else {
            // Global analytics
            const user = await prisma.user.findFirst();
            if (!user) {
                return NextResponse.json({
                    totalHabits: 0,
                    daysWithProgress: 0,
                    globalStreak: 0,
                });
            }

            const habits = await prisma.habit.findMany({
                where: { userId: user.id },
            });

            const logs = await prisma.habitLog.findMany({
                where: {
                    habitId: { in: habits.map((h: { id: string }) => h.id) },
                    date: {
                        gte: startDateStr,
                        lte: endDateStr,
                    },
                },
            });

            // Count unique days with at least one log
            const daysWithProgress = new Set(logs.map((log: { date: string }) => log.date)).size;

            // Calculate global streak (days with at least one habit completed)
            const allLogs = await prisma.habitLog.findMany({
                where: {
                    habitId: { in: habits.map((h: { id: string }) => h.id) },
                },
                orderBy: { date: 'desc' },
            });

            const uniqueDates = Array.from(new Set(allLogs.map((log: { date: string }) => log.date))).map((date: string) => ({ date }));
            const globalStreak = calculateStreak(uniqueDates);

            return NextResponse.json({
                totalHabits: habits.length,
                daysWithProgress,
                globalStreak,
                days,
            });
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
