import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveSurvey } from "./actions";

const options = [
  { label: "Strongly disagree", value: -2 },
  { label: "Disagree", value: -1 },
  { label: "Neutral", value: 0 },
  { label: "Agree", value: 1 },
  { label: "Strongly agree", value: 2 },
];

export default async function SurveyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const issues = await prisma.issue.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Issue Survey</h1>

      <p className="mb-8 text-gray-600">
        Tell us where you stand on each issue. We’ll use this to calculate your
        candidate match score.
      </p>

      <form action={saveSurvey} className="space-y-8">
        {issues.map((issue) => (
          <fieldset key={issue.id} className="rounded-lg border p-5">
            <legend className="px-2 text-lg font-semibold">
              {issue.name}
            </legend>

            <div className="mt-4 space-y-3">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name={issue.id}
                    value={option.value}
                    required
                  />

                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
        >
          Save Survey
        </button>
      </form>
    </main>
  );
}