import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        await prisma.$connect();

        // User Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL DEFAULT 'User',
                "email" TEXT,
                "password" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "User_pkey" PRIMARY KEY ("id")
            );
        `);

        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email");`);
        } catch (e) { /* Index might exist */ }

        // Habit Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Habit" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "type" TEXT NOT NULL,
                "unit" TEXT,
                "target" DOUBLE PRECISION,
                "frequency" TEXT NOT NULL DEFAULT 'daily',
                "daysPerWeek" INTEGER NOT NULL DEFAULT 7,
                "icon" TEXT,
                "color" TEXT NOT NULL DEFAULT '#4fd1c5',
                "userId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "archived" BOOLEAN NOT NULL DEFAULT false,
                CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
            );
        `);

        // Habit Constraints (Foreign Key)
        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" 
                FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            `);
        } catch (e) { /* Constraint might exist */ }

        // HabitLog Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "HabitLog" (
                "id" TEXT NOT NULL,
                "habitId" TEXT NOT NULL,
                "date" TEXT NOT NULL,
                "numericValue" DOUBLE PRECISION,
                "booleanValue" BOOLEAN,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
            );
        `);

        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");`);
            await prisma.$executeRawUnsafe(`CREATE INDEX "HabitLog_habitId_date_idx" ON "HabitLog"("habitId", "date");`);
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" 
                FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            `);
        } catch (e) { /* Indices/Constraints might exist */ }

        return NextResponse.json({
            status: 'success',
            message: 'Database tables created successfully!'
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
