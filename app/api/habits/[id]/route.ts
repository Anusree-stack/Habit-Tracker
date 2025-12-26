import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-helpers';

// DELETE /api/habits/[id] - Soft delete a habit
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify habit belongs to user
        const habit = await prisma.habit.findFirst({
            where: { id, userId: user.id },
        });

        if (!habit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        // Soft delete: set archived to true
        await prisma.habit.update({
            where: { id },
            data: { archived: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error archiving habit:', error);
        return NextResponse.json({ error: 'Failed to archive habit' }, { status: 500 });
    }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify habit belongs to user
        const existingHabit = await prisma.habit.findFirst({
            where: { id, userId: user.id },
        });

        if (!existingHabit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        const body = await request.json();

        // Extract allowed fields
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

        const updatedHabit = await prisma.habit.update({
            where: { id },
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
            },
        });

        return NextResponse.json(updatedHabit);
    } catch (error) {
        console.error('Error updating habit:', error);
        return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
    }
}
