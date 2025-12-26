
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const today = new Date().toISOString().split('T')[0];
    const userEmail = 'sarah@stepup.app'; // Default dev user

    console.log(`Clearing logs for date: ${today} for user: ${userEmail}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { habits: true },
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        const habitIds = user.habits.map((h) => h.id);

        const deleted = await prisma.habitLog.deleteMany({
            where: {
                habitId: { in: habitIds },
                date: today,
            },
        });

        console.log(`Deleted ${deleted.count} logs.`);
    } catch (error) {
        console.error('Error clearing logs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
