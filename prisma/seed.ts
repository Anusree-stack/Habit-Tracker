import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Clean up existing data
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create User
    const user = await prisma.user.create({
        data: {
            name: 'Demo User',
        },
    });

    console.log(`Created user with id: ${user.id}`);

    // 3. Create Habits
    const water = await prisma.habit.create({
        data: {
            userId: user.id,
            name: 'Drink Water',
            description: 'Stay hydrated for better focus',
            type: 'MEASURABLE',
            unit: 'glasses',
            target: 8,
            frequency: 'daily',
            daysPerWeek: 7,
            icon: '💧',
            color: '#60A5FA', // Blue
        },
    });

    const meditation = await prisma.habit.create({
        data: {
            userId: user.id,
            name: 'Meditation',
            description: '10 minutes of mindfulness',
            type: 'BOOLEAN',
            frequency: 'daily',
            daysPerWeek: 7,
            icon: '🧘',
            color: '#EC4899', // Pink
        },
    });

    const run = await prisma.habit.create({
        data: {
            userId: user.id,
            name: 'Morning Run',
            description: '5k run in the park',
            type: 'MEASURABLE',
            unit: 'km',
            target: 5,
            frequency: 'custom',
            daysPerWeek: 3,
            icon: '🏃',
            color: '#FBBF24', // Amber
        },
    });

    console.log('Created habits:', water.name, meditation.name, run.name);

    // 4. Generate Logs for the last 90 days
    const today = new Date();
    const logs = [];

    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Simulate real-looking data patterns

        // Water: Generally good, some bad days
        const waterIntake = Math.floor(Math.random() * 4) + 5; // 5-8 glasses
        logs.push({
            habitId: water.id,
            date: dateStr,
            numericValue: waterIntake > 8 ? 8 : waterIntake,
        });

        // Meditation: missed weekends sometimes
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (!isWeekend || Math.random() > 0.5) {
            logs.push({
                habitId: meditation.id,
                date: dateStr,
                booleanValue: true,
            });
        }

        // Run: Mon, Wed, Fri
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
            // 80% chance to run on scheduled days
            if (Math.random() > 0.2) {
                logs.push({
                    habitId: run.id,
                    date: dateStr,
                    numericValue: Math.random() * 2 + 4, // 4-6km
                });
            }
        }
    }

    for (const log of logs) {
        await prisma.habitLog.create({ data: log });
    }

    console.log(`Seeding finished. Generated ${logs.length} logs.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
