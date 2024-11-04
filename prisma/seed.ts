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


  const ErikEmail = 'erik@beauvalot.com';
  const ErikPassword = 'toto';
  const ErikhashedPassword = await bcrypt.hash(ErikPassword, 10);

  const ErikUser = await prisma.user.upsert({
    where: { email: ErikEmail },
    update: {},
    create: {
      email: ErikEmail,
      password: ErikhashedPassword,
      name: 'erik',
      role: 'admin',
    },
  });

  console.log('erik user created:', ErikUser);

  const SimpleEmail = 'test@beauvalot.com';
  const SimplePassword = 'toto';
  const SimplehashedPassword = await bcrypt.hash(SimplePassword, 10);

  const SimpleUser = await prisma.user.upsert({
    where: { email: SimpleEmail },
    update: {},
    create: {
      email: SimpleEmail,
      password: SimplehashedPassword,
      name: 'test',
      role: 'utilisateur',
    },
  });

  console.log('user created:', SimpleUser);


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });