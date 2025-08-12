import { prisma, Role } from "./client";
import bcrypt from "bcryptjs";

async function seed() {
  const email = process.env.ADMIN_EMAIL || "yll.gashi29@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "test123";
  const name = process.env.ADMIN_NAME || "Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email,
      name,
      role: Role.ADMIN,
      passwordHash,
    },
  });
}

(async () => {
  try {
    await seed();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
