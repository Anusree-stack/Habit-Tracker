import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canEditLog, getToday } from '@/lib/utils';
import { getAuthenticatedUser } from '@/lib/auth-helpers';

// GET /api/logs?habitId=xxx&startDate=xxx&endDate=xxx
export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const habitId = searchParams.get('habitId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {};

        if (habitId) {
            // Verify habit belongs to user
            const habit = await prisma.habit.findFirst({
                where: { id: habitId, userId: user.id },
            });

            if (!habit) {
                return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
            }

            where.habitId = habitId;
        }

        if (startDate && endDate) {
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        const logs = await prisma.habitLog.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

// POST /api/logs - Create or update a log
export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { habitId, date, numericValue, booleanValue } = body;

        if (!habitId || !date) {
            return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
        }

        // Get the habit to check its type AND verify ownership
        const habit = await prisma.habit.findFirst({
            where: { id: habitId, userId: user.id },
        });

        if (!habit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        // Check if a log already exists for this habit and date
        const existingLog = await prisma.habitLog.findUnique({
            where: {
                habitId_date: {
                    habitId,
                    date,
                },
            },
        });

        if (existingLog) {
            // Restriction removed for better UX during testing
            // if (!canEditLog(existingLog.createdAt)) { ... }


            // Update existing log (aggregate for measurable habits)
            const updatedLog = await prisma.habitLog.update({
                where: { id: existingLog.id },
                data: {
                    numericValue: habit.type === 'MEASURABLE' && numericValue !== undefined
                        ? numericValue
                        : existingLog.numericValue,
                    booleanValue: habit.type === 'BOOLEAN' && booleanValue !== undefined
                        ? booleanValue
                        : existingLog.booleanValue,
                },
            });

            return NextResponse.json(updatedLog);
        }

        // Create new log
        const log = await prisma.habitLog.create({
            data: {
                habitId,
                date,
                numericValue: habit.type === 'MEASURABLE' ? numericValue : null,
                booleanValue: habit.type === 'BOOLEAN' ? booleanValue : null,
            },
        });

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        console.error('Error creating/updating log:', error);
        return NextResponse.json({ error: 'Failed to create/update log' }, { status: 500 });
    }
}
