import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAuth() {
    console.log('Setting up Sarah Anderson as default user...');

    // Find the existing user (should be "Demo User")
    const existingUser = await prisma.user.findFirst();

    if (!existingUser) {
        console.log('No existing user found. Creating Sarah Anderson...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        await prisma.user.create({
            data: {
                name: 'Sarah Anderson',
                email: 'sarah@stepup.app',
                password: hashedPassword,
            },
        });
        console.log('✓ Sarah Anderson created successfully');
    } else {
        console.log(`Found existing user: ${existingUser.name} (${existingUser.id})`);

        // Update to Sarah Anderson with credentials
        const hashedPassword = await bcrypt.hash('password123', 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                name: 'Sarah Anderson',
                email: 'sarah@stepup.app',
                password: hashedPassword,
            },
        });

        console.log('✓ Updated to Sarah Anderson with credentials');

        // Verify all habits are linked
        const habitCount = await prisma.habit.count({
            where: { userId: existingUser.id },
        });

        console.log(`✓ ${habitCount} habits linked to Sarah Anderson`);
    }

    console.log('\n=== Sarah Anderson Account ===');
    console.log('Email: sarah@stepup.app');
    console.log('Password: password123');
    console.log('==============================\n');
}

seedAuth()
    .catch((e) => {
        console.error('Error seeding auth:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
