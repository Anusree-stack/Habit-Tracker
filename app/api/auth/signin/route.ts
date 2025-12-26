import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, generateToken, getCookieOptions, COOKIE_NAME } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findFirst({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email!,
        });

        // Create response with cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        // Set auth cookie
        response.cookies.set(COOKIE_NAME, token, getCookieOptions());

        return response;
    } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
