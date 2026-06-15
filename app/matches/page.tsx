import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getMatchPercent(
  userScores: Map<string, number>,
  candidatePositions: { issueId: string; score: number }[]
) {
  let totalDifference = 0;
  let matchedIssues = 0;

  for (const position of candidatePositions) {
    const userScore = userScores.get(position.issueId);

    if (userScore === undefined) {
      continue;
    }

    totalDifference += Math.abs(userScore - position.score);
    matchedIssues++;
  }

  if (matchedIssues === 0) {
    return null;
  }

  const maxDifference = matchedIssues * 4;

  return Math.round(100 - (totalDifference / maxDifference) * 100);
}

export default async function MatchesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.userProfile.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      preferences: true,
    },
  });

  if (!user || user.preferences.length === 0) {
    redirect("/survey");
  }

  const userScores = new Map(
    user.preferences.map((preference) => [
      preference.issueId,
      preference.score,
    ])
  );

  const candidates = await prisma.candidate.findMany({
    include: {
      party: true,
      office: true,
      positions: true,
    },
  });

  const matches = candidates
    .map((candidate) => {
      const matchPercent = getMatchPercent(userScores, candidate.positions);

      return {
        candidate,
        matchPercent,
      };
    })
    .filter((match) => match.matchPercent !== null)
    .sort((a, b) => {
      return (b.matchPercent ?? 0) - (a.matchPercent ?? 0);
    });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Your Matches</h1>

      <p className="mb-8 text-gray-600">
        Candidates ranked by how closely their issue positions match your survey
        answers.
      </p>

      <div className="space-y-4">
        {matches.map(({ candidate, matchPercent }) => (
          <div
            key={candidate.id}
            className="rounded-lg border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{candidate.name}</h2>

                <p className="text-gray-600">
                  {candidate.office?.name ?? "Office unavailable"}
                  {candidate.party?.name ? ` · ${candidate.party.name}` : ""}
                </p>
              </div>

              <div className="rounded-full bg-blue-100 px-4 py-2 text-lg font-bold text-blue-700">
                {matchPercent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}