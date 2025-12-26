import { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from './auth';
import { prisma } from './prisma';

export async function getAuthenticatedUser(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
            return null;
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true },
        });

        return user;
    } catch (error) {
        console.error('Error getting authenticated user:', error);
        return null;
    }
}
