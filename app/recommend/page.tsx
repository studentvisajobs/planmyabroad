"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RouteType = "study" | "work" | "migration" | null;

type RecommendationItem = {
  country: string;
  score: number;
  eligible: boolean;
  bestRoute: RouteType;
  secondRoute: RouteType;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
};

type RecommendApiSuccess = {
  ok: true;
  data: {
    topCountry: RecommendationItem | null;
    rankings: RecommendationItem[];
    summary: string;
    premiumLocked: boolean;
    profileComplete: boolean;
    premiumBenefits: string[];
  };
};

type RecommendApiError = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "RULES_NOT_FOUND"
      | "RECOMMEND_FAILED";
    message: string;
  };
};

type RecommendApiResponse = RecommendApiSuccess | RecommendApiError;

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

function CountryCard({
  item,
  showBadge = false,
}: {
  item: RecommendationItem;
  showBadge?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{item.country}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Score: <strong>{item.score}%</strong>
          </p>
        </div>

        {showBadge && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Best Match
          </span>
        )}
      </div>

      <p className="mt-3 text-sm">
        Status:{" "}
        <strong className={item.eligible ? "text-green-600" : "text-amber-600"}>
          {item.eligible ? "Strong" : "Needs improvement"}
        </strong>
      </p>

      <div className="mt-3 text-sm space-y-1">
        <p>
          Best route: <strong>{item.bestRoute || "—"}</strong>
        </p>
        <p>
          Backup route: <strong>{item.secondRoute || "—"}</strong>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Strengths</p>
        {item.strengths.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">No major strengths identified yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {item.strengths.map((strength, index) => (
              <li key={index} className="text-green-700">
                • {strength}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Weaknesses</p>
        {item.weaknesses.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">No major weaknesses identified.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {item.weaknesses.map((weakness, index) => (
              <li key={index} className="text-red-600">
                • {weakness}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/pathways"
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open Pathways
        </Link>

        <Link
          href="/compare"
          className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}

function DecisionBox({
  topCountry,
  secondCountry,
}: {
  topCountry: RecommendationItem;
  secondCountry: RecommendationItem | null;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Decision guidance</h2>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        <strong>{topCountry.country}</strong> is currently your strongest option,
        mainly through the <strong>{topCountry.bestRoute || "best available"}</strong> route.
      </p>

      {topCountry.strengths.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">Why it fits best</p>
          <ul className="mt-2 space-y-1 text-sm">
            {topCountry.strengths.slice(0, 3).map((item, index) => (
              <li key={index} className="text-green-700">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {topCountry.weaknesses.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">What to fix first</p>
          <ul className="mt-2 space-y-1 text-sm">
            {topCountry.weaknesses.slice(0, 2).map((item, index) => (
              <li key={index} className="text-red-600">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {secondCountry && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Why {topCountry.country} beats {secondCountry.country}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>
              • Higher score: <strong>{topCountry.score}%</strong> vs{" "}
              <strong>{secondCountry.score}%</strong>
            </li>
            <li>
              • Stronger route fit through <strong>{topCountry.bestRoute || "its current best route"}</strong>
            </li>
            <li>• Better overall profile readiness right now</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function RoadmapBox({
  roadmap,
  loading,
  error,
  onOpen,
  premiumLocked,
}: {
  roadmap: RoadmapData | null;
  loading: boolean;
  error: string;
  onOpen: () => Promise<void>;
  premiumLocked: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Action plan</h2>
        <p className="mt-3 text-sm text-slate-600">
          {premiumLocked
            ? "Premium unlocks the full step-by-step roadmap for your top country."
            : "Open the roadmap for your top country to see what to do next."}
        </p>

        <button
          onClick={onOpen}
          className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {premiumLocked ? "Unlock Roadmap" : "Open Roadmap"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Action plan for {roadmap.country}</h2>
      <p className="mt-2 text-sm text-slate-600">
        Pathway: <strong>{roadmap.pathway}</strong>
      </p>

      {roadmap.nextBestActions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">Next best actions</p>
          <ul className="mt-2 space-y-1 text-sm">
            {roadmap.nextBestActions.slice(0, 3).map((item, index) => (
              <li key={index} className="text-slate-700">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-900">First roadmap steps</p>
        <div className="mt-3 space-y-3">
          {roadmap.steps.slice(0, 3).map((step, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {index + 1}. {step.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/pathways"
        className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Open Full Pathways View
      </Link>
    </div>
  );
}

export default function RecommendPage() {
  const [topCountry, setTopCountry] = useState<RecommendationItem | null>(null);
  const [rankings, setRankings] = useState<RecommendationItem[]>([]);
  const [summary, setSummary] = useState("");
  const [premiumLocked, setPremiumLocked] = useState(false);
  const [premiumBenefits, setPremiumBenefits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string>("");

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  async function loadRecommendations() {
    try {
      setLoading(true);
      setError("");
      setErrorCode("");

      const res = await fetch("/api/recommend");
      const text = await res.text();

      let data: RecommendApiResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!data.ok) {
        setErrorCode(data.error.code);
        setError(data.error.message || "Failed to load recommendations");
        return;
      }

      setTopCountry(data.data.topCountry);
      setRankings(data.data.rankings);
      setSummary(data.data.summary);
      setPremiumLocked(data.data.premiumLocked);
      setPremiumBenefits(data.data.premiumBenefits || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function loadTopRoadmap() {
    if (!topCountry?.country) return;

    try {
      setRoadmapLoading(true);
      setRoadmapError("");

      const res = await fetch(`/api/roadmap?country=${encodeURIComponent(topCountry.country)}`);
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

        setRoadmapError(data.error.message || "Failed to load roadmap");
        return;
      }

      setRoadmap(data.data);
    } catch (err: any) {
      setRoadmapError(err.message || "Failed to load roadmap");
    } finally {
      setRoadmapLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

  const secondCountry = useMemo(() => {
    if (rankings.length < 2) return null;
    return rankings[1];
  }, [rankings]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Main decision page
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Your best country recommendations
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Use this page to decide where you should focus first, which route is strongest,
            and what action to take next.
          </p>
        </section>

        {loading && <p className="mt-8">Loading recommendations...</p>}

        {!loading && errorCode === "UNAUTHORIZED" && (
          <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Log in to see recommendations</h2>
            <p className="mt-3 text-sm text-slate-600">
              Your recommendation page uses your saved profile and account data.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Log in
            </Link>
          </div>
        )}

        {!loading && errorCode === "PROFILE_MISSING" && (
          <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Complete your profile first</h2>
            <p className="mt-3 text-sm text-slate-600">
              We need your profile details before we can recommend the best country and route.
            </p>
            <Link
              href="/profile"
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {!loading && error && !errorCode && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {premiumLocked ? (
              <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                <p className="text-sm font-semibold text-yellow-900">Free Plan Active</p>
                <p className="mt-2 text-sm text-yellow-800">
                  Free shows what looks best. Premium gives you the action plan.
                </p>

                {premiumBenefits.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-yellow-900">
                    {premiumBenefits.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-4">
                  <Link
                    href="/premium"
                    className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
                <p className="text-sm font-semibold text-green-900">
                  Premium Recommendations Active
                </p>
                <p className="mt-2 text-sm text-green-800">
                  You’re seeing full rankings, route clarity, and roadmap access.
                </p>
              </div>
            )}

            {summary && (
              <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Summary</p>
                <p className="mt-2 text-base text-slate-800">{summary}</p>
              </div>
            )}

            {topCountry && (
              <>
                <section className="mt-10">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">Top recommendation</h2>

                    <Link
                      href="/pathways"
                      className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Explore Pathways
                    </Link>
                  </div>

                  <CountryCard item={topCountry} showBadge />
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-2">
                  <DecisionBox
                    topCountry={topCountry}
                    secondCountry={secondCountry}
                  />

                  <RoadmapBox
                    roadmap={roadmap}
                    loading={roadmapLoading}
                    error={roadmapError}
                    onOpen={loadTopRoadmap}
                    premiumLocked={premiumLocked}
                  />
                </section>
              </>
            )}

            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Ranked countries</h2>

                {premiumLocked ? (
                  <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
                    🔒 Free plan: top 3 only
                  </div>
                ) : (
                  <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                    ✅ Premium: full rankings unlocked
                  </div>
                )}
              </div>

              {rankings.length === 0 ? (
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-slate-600">No recommendations available yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rankings.map((item, index) => (
                    <CountryCard
                      key={`${item.country}-${index}`}
                      item={item}
                      showBadge={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}