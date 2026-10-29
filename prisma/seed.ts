import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const countries = ["PHILIPPINES", "DOMINICAN_REPUBLIC", "SOUTH_AFRICA"];
  for (const country of countries) {
    await prisma.candidateSequence.upsert({
      where: { country },
      update: {},
      create: { country, lastNumber: 0 },
    });
  }

  await prisma.integrationSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const adminEmail = "admin@hiring4less.local";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("changeme123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log("\nSeeded default admin login:");
    console.log(`  email:    ${adminEmail}`);
    console.log(`  password: changeme123`);
    console.log("Please log in and change this password (Admin > Users) right away.\n");
  } else {
    console.log("Admin user already exists, skipping.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
