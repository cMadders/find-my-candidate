"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function saveSurvey(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.userProfile.upsert({
    where: {
      clerkId: userId,
    },
    update: {},
    create: {
      clerkId: userId,
    },
  });

  const issues = await prisma.issue.findMany();

  for (const issue of issues) {
    const rawScore = formData.get(issue.id);

    if (rawScore === null) {
      continue;
    }

    const score = Number(rawScore);

    await prisma.userIssuePreference.upsert({
      where: {
        userId_issueId: {
          userId: user.id,
          issueId: issue.id,
        },
      },
      update: {
        score,
      },
      create: {
        userId: user.id,
        issueId: issue.id,
        score,
      },
    });
  }

  redirect("/matches");
}