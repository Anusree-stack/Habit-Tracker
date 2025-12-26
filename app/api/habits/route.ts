import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-helpers';

// GET /api/habits - Get all habits for the authenticated user
export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const habits = await prisma.habit.findMany({
            where: {
                userId: user.id,
                archived: false
            },
            include: { logs: true },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
    }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            type,
            unit,
            description,
            target,
            frequency,
            daysPerWeek,
            icon,
            color
        } = body;

        if (!name || !type) {
            return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
        }

        if (type !== 'MEASURABLE' && type !== 'BOOLEAN') {
            return NextResponse.json({ error: 'Type must be MEASURABLE or BOOLEAN' }, { status: 400 });
        }

        const habit = await prisma.habit.create({
            data: {
                name,
                type,
                description,
                unit: type === 'MEASURABLE' ? unit : null,
                target: type === 'MEASURABLE' ? (typeof target === 'string' ? parseFloat(target) : target) : null,
                frequency,
                daysPerWeek: daysPerWeek ? parseInt(String(daysPerWeek)) : 7,
                icon,
                color,
                userId: user.id,
            },
        });

        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        console.error('Error creating habit:', error);
        return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
    }
}
