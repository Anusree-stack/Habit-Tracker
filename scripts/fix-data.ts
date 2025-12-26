
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const today = new Date().toISOString().split('T')[0];
    const userEmail = 'sarah@stepup.app';

    console.log(`Starting fix script for user: ${userEmail}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { habits: true },
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        // 1. Fix "Drink Water" habit
        const waterHabit = user.habits.find(h => h.name.toLowerCase().includes('water'));
        if (waterHabit) {
            console.log(`Found 'Drink Water' habit (ID: ${waterHabit.id}). Updating to Measurable...`);
            await prisma.habit.update({
                where: { id: waterHabit.id },
                data: {
                    type: 'MEASURABLE',
                    unit: 'glasses',
                    target: 8.0, // Default target
                },
            });
            console.log('Updated Drink Water habit.');
        } else {
            console.log("'Drink Water' habit not found.");
        }

        // 2. Clear today's logs for all habits
        const habitIds = user.habits.map((h) => h.id);
        const deleted = await prisma.habitLog.deleteMany({
            where: {
                habitId: { in: habitIds },
                date: today,
            },
        });

        console.log(`Cleared ${deleted.count} logs for date: ${today}`);

    } catch (error) {
        console.error('Error in script:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
