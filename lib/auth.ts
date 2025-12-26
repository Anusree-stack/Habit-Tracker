import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const COOKIE_NAME = 'auth-token';

export interface TokenPayload {
    userId: string;
    email: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// JWT token generation and verification
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // 7 days
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

// Cookie options
export function getCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    };
}
