// @ts-nocheck

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    const habits = await prisma.habit.findMany();
    console.log('All Habits:', habits.map(h => ({
        id: h.id,
        name: h.name,
        archived: h.archived,
        userId: h.userId
    })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
