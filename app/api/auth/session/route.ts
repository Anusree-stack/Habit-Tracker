import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        // Verify token
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ user: null });
        }

        // Fetch full user data from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json({ user: null });
    }
}
