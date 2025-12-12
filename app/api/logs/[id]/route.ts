import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canEditLog } from '@/lib/utils';

// PATCH /api/logs/[id] - Update a log
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { numericValue, booleanValue } = body;

        // Get the existing log
        const existingLog = await prisma.habitLog.findUnique({
            where: { id },
        });

        if (!existingLog) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        // Update the log
        const updatedLog = await prisma.habitLog.update({
            where: { id },
            data: {
                numericValue: numericValue !== undefined ? numericValue : existingLog.numericValue,
                booleanValue: booleanValue !== undefined ? booleanValue : existingLog.booleanValue,
            },
        });

        return NextResponse.json(updatedLog);
    } catch (error) {
        console.error('Error updating log:', error);
        return NextResponse.json({ error: 'Failed to update log' }, { status: 500 });
    }
}

// DELETE /api/logs/[id] - Delete a log
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const log = await prisma.habitLog.findUnique({
            where: { id },
        });

        if (!log) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        await prisma.habitLog.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Log deleted successfully' });
    } catch (error) {
        console.error('Error deleting log:', error);
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }
}
