"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Pathway = {
  country: string;
  pathway: string;
  eligibilityScore: number;
  description: string;
  estimatedCost: string;
  timeline: string;
  settlementPotential: string;
  blockers: string[];
  roadmap: string[];
  scoreBreakdown: {
    education: number;
    workExperience: number;
    language: number;
    finances: number;
    documents: number;
    pathwayFit: number;
  };
};

type RoadmapStep = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  documents: string[];
};

type RoadmapData = {
  country: string;
  pathway: string;
  readinessScore: number;
  estimatedTimeline: string;
  blockers: string[];
  nextBestActions: string[];
  steps: RoadmapStep[];
  premiumLocked: boolean;
  profileComplete: boolean;
};

type RoadmapApiSuccess = {
  ok: true;
  data: RoadmapData;
};

type RoadmapApiError = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "COUNTRY_REQUIRED"
      | "COUNTRY_RULE_NOT_FOUND"
      | "PREMIUM_REQUIRED"
      | "ROADMAP_FAILED";
    message: string;
  };
};

type RoadmapApiResponse = RoadmapApiSuccess | RoadmapApiError;

function getScoreStyles(score: number) {
  if (score >= 75) {
    return "bg-green-100 text-green-800 border-green-200";
  }

  if (score >= 60) {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  return "bg-red-100 text-red-800 border-red-200";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Possible Match";
  return "Needs Improvement";
}

function getPriorityStyles(priority: "High" | "Medium" | "Low") {
  if (priority === "High") {
    return "bg-red-100 text-red-800 border-red-200";
  }

  if (priority === "Medium") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max = 20,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function RoadmapPanel({
  roadmapData,
  roadmapLoading,
  roadmapError,
}: {
  roadmapData: RoadmapData | null;
  roadmapLoading: boolean;
  roadmapError: string;
}) {
  if (roadmapLoading) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-600">Loading roadmap...</p>
      </div>
    );
  }

  if (roadmapError) {
    return (
      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-700">{roadmapError}</p>
      </div>
    );
  }

  if (!roadmapData) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            Full Roadmap for {roadmapData.country}
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            Pathway: <span className="font-semibold">{roadmapData.pathway}</span>
          </p>
        </div>

        <div className="grid gap-2 text-sm md:text-right">
          <p className="text-slate-600">
            Readiness Score:{" "}
            <span className="font-semibold text-slate-900">
              {roadmapData.readinessScore}%
            </span>
          </p>
          <p className="text-slate-600">
            Estimated Timeline:{" "}
            <span className="font-semibold text-slate-900">
              {roadmapData.estimatedTimeline}
            </span>
          </p>
        </div>
      </div>

      {roadmapData.nextBestActions.length > 0 && (
        <div className="mt-5">
          <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Next Best Actions
          </h5>
          <ul className="mt-3 space-y-2">
            {roadmapData.nextBestActions.map((action, index) => (
              <li
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Step-by-Step Plan
        </h5>

        <div className="mt-4 space-y-4">
          {roadmapData.steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <h6 className="text-base font-semibold text-slate-900">
                      {step.title}
                    </h6>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyles(
                    step.priority
                  )}`}
                >
                  {step.priority} Priority
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estimated Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {step.estimatedTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Documents
                  </p>
                  {step.documents.length === 0 ? (
                    <p className="mt-1 text-sm text-slate-600">
                      No specific documents listed.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.documents.map((doc, docIndex) => (
                        <span
                          key={docIndex}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PathwayCard({
  item,
  highlight = false,
  isPremium,
}: {
  item: Pathway;
  highlight?: boolean;
  isPremium: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  async function handleSavePathway() {
    try {
      setSaving(true);

      const res = await fetch("/api/save-pathway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: item.country,
          pathway: item.pathway,
          score: item.eligibilityScore,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save pathway.");
        return;
      }

      alert("Pathway saved!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving pathway.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLoadRoadmap(country: string) {
    try {
      setRoadmapLoading(true);
      setRoadmapError("");

      const res = await fetch(`/api/roadmap?country=${encodeURIComponent(country)}`);
      const text = await res.text();

      let data: RoadmapApiResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid roadmap response from server");
      }

      if (!data.ok) {
        if (data.error.code === "PREMIUM_REQUIRED") {
          window.location.href = "/premium";
          return;
        }

        throw new Error(data.error.message || "Failed to load roadmap");
      }

      setRoadmapData(data.data);
    } catch (error: any) {
      setRoadmapError(error.message || "Failed to load roadmap");
    } finally {
      setRoadmapLoading(false);
    }
  }

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm transition ${
        highlight
          ? "border-slate-900 bg-white shadow-md"
          : "border-slate-200 bg-white"
      }`}
    >
      {!isPremium && (
        <div className="mb-5 rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                Premium Roadmap
              </p>
              <p className="mt-1 text-sm text-purple-900">
                Get the full step-by-step plan for <strong>{item.country}</strong>.
              </p>
            </div>

            <button
              onClick={() => handleLoadRoadmap(item.country)}
              className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Full Roadmap
            </button>
          </div>
        </div>
      )}

      {isPremium && !roadmapData && !roadmapLoading && !roadmapError && (
        <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Premium Unlocked
              </p>
              <p className="mt-1 text-sm text-green-900">
                Your full roadmap for <strong>{item.country}</strong> is available.
              </p>
            </div>

            <button
              onClick={() => handleLoadRoadmap(item.country)}
              className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Open Full Roadmap
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {item.country}
            </h3>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              {item.pathway}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {item.description}
          </p>
        </div>

        <div
          className={`inline-flex min-w-[140px] items-center justify-center rounded-2xl border px-4 py-3 text-center ${getScoreStyles(
            item.eligibilityScore
          )}`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">
              {getScoreLabel(item.eligibilityScore)}
            </p>
            <p className="text-2xl font-bold">{item.eligibilityScore}%</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estimated Cost
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {item.estimatedCost}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Timeline
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {item.timeline}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Settlement Potential
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {item.settlementPotential}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Score Breakdown
            </h4>

            <div className="mt-4 space-y-3">
              <ScoreBar label="Education" value={item.scoreBreakdown.education} />
              <ScoreBar
                label="Work Experience"
                value={item.scoreBreakdown.workExperience}
              />
              <ScoreBar label="Language" value={item.scoreBreakdown.language} />
              <ScoreBar label="Finances" value={item.scoreBreakdown.finances} />
              <ScoreBar label="Documents" value={item.scoreBreakdown.documents} />
              <ScoreBar label="Pathway Fit" value={item.scoreBreakdown.pathwayFit} />
            </div>
          </div>

          <RoadmapPanel
            roadmapData={roadmapData}
            roadmapLoading={roadmapLoading}
            roadmapError={roadmapError}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Blockers
            </h4>

            {item.blockers.length === 0 ? (
              <p className="mt-3 text-sm text-green-700">
                No major blockers detected.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {item.blockers.map((blocker, blockerIndex) => (
                  <li
                    key={blockerIndex}
                    className="rounded-xl bg-red-50 px-3 py-2 text-red-800"
                  >
                    {blocker}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Roadmap Preview
            </h4>

            <ol className="mt-3 space-y-3">
              {item.roadmap.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>

            {!isPremium && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100 p-4 text-center">
                <p className="text-sm text-slate-700">
                  Want the full personalized roadmap?
                </p>
                <button
                  onClick={() => handleLoadRoadmap(item.country)}
                  className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View Full Roadmap
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Next Action
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Go back to your profile and improve the factors affecting this pathway.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/profile?focus=${encodeURIComponent(item.country)}`}
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Improve My Score
              </Link>

              <button
                onClick={handleSavePathway}
                disabled={saving}
                className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "⭐ Save Pathway"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPathways() {
    setLoading(true);
    setError("");
    setErrorCode("");

    try {
      const response = await fetch("/api/pathways");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load pathways");

        if (data.error === "Unauthorized") {
          setErrorCode("UNAUTHORIZED");
        } else if (data.error === "No profile found") {
          setErrorCode("PROFILE_MISSING");
        } else {
          setErrorCode("GENERAL");
        }

        setPathways([]);
        return;
      }

      setPathways(data.pathways ?? []);
      setIsPremium(!!data.isPremium);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setErrorCode("GENERAL");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPathways();
  }, []);

  const { topMatches, otherOptions, highestScore } = useMemo(() => {
    const topMatches = pathways.filter((p) => p.eligibilityScore >= 65);
    const otherOptions = pathways.filter((p) => p.eligibilityScore < 65);
    const highestScore =
      pathways.length > 0
        ? Math.max(...pathways.map((p) => p.eligibilityScore))
        : 0;

    return { topMatches, otherOptions, highestScore };
  }, [pathways]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                PlanMyAbroad
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Where Can I Go?
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Generate migration pathway recommendations across multiple countries
                with eligibility scores, blockers, and practical action steps.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Back to Profile
              </Link>

              <button
                onClick={loadPathways}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                {loading ? "Loading..." : "Refresh Pathways"}
              </button>
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Premium Roadmaps
                </p>
                <h2 className="mt-1 text-lg font-bold text-purple-950">
                  Every pathway card includes a full roadmap button
                </h2>
                <p className="mt-2 text-sm text-purple-900">
                  Open any country card below and click <strong>View Full Roadmap</strong>{" "}
                  to unlock the detailed step-by-step plan.
                </p>
              </div>

              <Link
                href="/premium"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Premium
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Loading pathway results...
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We’re evaluating your strongest migration options.
            </p>
          </div>
        ) : errorCode === "UNAUTHORIZED" ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Log in to view pathways
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              You need an account before PlanMyAbroad can generate your migration pathways.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Log In
            </Link>
          </div>
        ) : errorCode === "PROFILE_MISSING" ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No profile found yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your migration profile first so PlanMyAbroad can generate
              pathway recommendations.
            </p>
            <Link
              href="/profile"
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create Profile
            </Link>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-red-900">
              Unable to load pathways
            </h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={loadPathways}
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        ) : pathways.length > 0 ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SummaryStat label="Total Pathways" value={pathways.length} />
              <SummaryStat label="Top Matches" value={topMatches.length} />
              <SummaryStat label="Highest Score" value={`${highestScore}%`} />
            </div>

            <div className="mt-10 space-y-10">
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Top Matches
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    These are the strongest options based on your current profile.
                  </p>
                </div>

                {topMatches.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                    No strong matches yet. Improve the blockers below and try again.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {topMatches.map((item, index) => (
                      <PathwayCard
                        key={`${item.country}-${item.pathway}-top-${index}`}
                        item={item}
                        highlight
                        isPremium={isPremium}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Other Options
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    These may still be possible, but they need more improvement
                    before becoming strong options.
                  </p>
                </div>

                {otherOptions.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                    No other options to show.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {otherOptions.map((item, index) => (
                      <PathwayCard
                        key={`${item.country}-${item.pathway}-other-${index}`}
                        item={item}
                        isPremium={isPremium}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No pathway results yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Generate pathways to see your strongest study, work, and migration options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}