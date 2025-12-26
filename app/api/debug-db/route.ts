import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        const habitsCount = await prisma.habit.count();

        return NextResponse.json({
            status: 'ok',
            message: 'Connected to DB successfully',
            counts: {
                users: userCount,
                habits: habitsCount
            },
            env: {
                hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (error: any) {
        console.error('DB Debug Error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            env: {
                hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
            }
        }, { status: 500 });
    }
}
