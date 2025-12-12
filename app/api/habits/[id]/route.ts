import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/habits/[id] - Soft delete a habit
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
