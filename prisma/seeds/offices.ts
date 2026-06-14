import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.office.createMany({
    data: [
      { name: "Governor", level: "STATE" },
      { name: "Mayor", level: "COUNTY" },
      { name: "President", level: "FEDERAL" },
      { name: "Senator", level: "FEDERAL" },
    ],
    skipDuplicates: true,
  });
  await prisma.party.createMany({
    data: [
      { name: "Republican"},
      { name: "Democrat"},
      { name: "Work"},
      { name: "Green"},
      { name: "Nonpartisan"},
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });