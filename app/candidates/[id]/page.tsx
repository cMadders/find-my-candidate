import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CandidatePage({
  params,
}: Props) {
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: {
      id,
    },
    include: {
      positions: {
        include: {
          issue: true,
        },
      },
    },
  });

  if (!candidate) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        {candidate.name}
      </h1>

      <p>{candidate.office}</p>

      <p className="mb-6">
        {candidate.party}
      </p>

      <h2 className="text-xl font-semibold mb-4">
        Positions
      </h2>

      <div className="space-y-2">
        {candidate.positions.map((position) => (
          <div
            key={position.id}
            className="border rounded p-3"
          >
            <strong>
              {position.issue.name}
            </strong>

            <div>
              Score: {position.score}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
