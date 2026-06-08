import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const healthcare = await prisma.issue.create({
    data: {
      name: "Healthcare",
    },
  });

  const taxes = await prisma.issue.create({
    data: {
      name: "Taxes",
    },
  });

  const education = await prisma.issue.create({
    data: {
      name: "Education",
    },
  });

  const jane = await prisma.candidate.create({
    data: {
      name: "Jane Smith",
      office: "Governor",
      party: "Independent",
    },
  });

  await prisma.position.createMany({
    data: [
      {
        candidateId: jane.id,
        issueId: healthcare.id,
        score: 2,
      },
      {
        candidateId: jane.id,
        issueId: taxes.id,
        score: -1,
      },
      {
        candidateId: jane.id,
        issueId: education.id,
        score: 1,
      },
    ],
  });

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
