import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Signed out successfully',
        });

        // Clear auth cookie
        response.cookies.delete(COOKIE_NAME);

        return response;
    } catch (error) {
        console.error('Signout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
