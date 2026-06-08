import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    include: {
      office: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Candidates</h1>

      <div className="space-y-4">
        {candidates.map((candidate) => (
        <div key={candidate.id} className="rounded-lg border p-4">
          <Link
            href={`/candidates/${candidate.id}`}
            className="block"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              {candidate.name}
            </h2>
          </Link>

          <p>
            {candidate.office?.name} ({candidate.office?.level})
          </p>
          <p className="text-gray-600">
            {candidate.party}
          </p>
          {candidate.incumbent ? <p>Incumbent</p>: <p>Running</p>}
        </div>
        ))}
      </div>
    </main>
  );
}
