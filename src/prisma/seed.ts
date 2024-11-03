// FILE: prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Utilisez bcryptjs si vous avez des problèmes avec bcrypt

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'toto';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'admin',
      role: 'admin',
    },
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });