"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CompareResult = {
  country: string;
  score: number;
  eligible: boolean;
  route: string | null;
  secondRoute: string | null;
  reasonsPreview: string[];
  fullReasons: string[] | null;
  roadmap: string[] | null;
  premiumLocked: boolean;
  profileComplete: boolean;
};

type CompareApiSuccess = {
  ok: true;
  data: CompareResult;
};

type CompareApiError = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "COUNTRY_REQUIRED"
      | "COUNTRY_RULE_NOT_FOUND"
      | "COMPARE_FAILED";
    message: string;
  };
};

type CompareApiResponse = CompareApiSuccess | CompareApiError;

const countries = [
  "Canada",
  "Germany",
  "UK",
  "Australia",
  "Ireland",
  "Netherlands",
  "Sweden",
  "New Zealand",
  "Finland",
  "USA",
];

function ScoreCard({ result }: { result: CompareResult }) {
  const reasons = result.fullReasons || result.reasonsPreview || [];

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{result.country}</h2>

      <p className="mt-2 text-sm text-gray-600">
        Score: <strong>{result.score}%</strong>
      </p>

      <p className="mt-1 text-sm">
        Status:{" "}
        <strong className={result.eligible ? "text-green-600" : "text-amber-600"}>
          {result.eligible ? "Strong" : "Needs improvement"}
        </strong>
      </p>

      <div className="mt-3 text-sm">
        <p>
          Best route: <strong>{result.route || "—"}</strong>
        </p>
        <p>
          Backup route: <strong>{result.secondRoute || "—"}</strong>
        </p>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-sm">Key issues:</p>
        {reasons.length === 0 ? (
          <p className="mt-1 text-sm text-green-600">No major issues</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {reasons.map((r, i) => (
              <li key={i} className="text-red-600">
                • {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {result.premiumLocked ? (
        <div className="mt-4 rounded border bg-yellow-50 p-3 text-sm">
          🔒 Upgrade to Premium to see full roadmap
        </div>
      ) : result.roadmap ? (
        <div className="mt-4">
          <p className="font-semibold text-sm">Roadmap:</p>
          <ol className="mt-2 space-y-1 text-sm">
            {result.roadmap.map((step, i) => (
              <li key={i}>
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {!result.premiumLocked && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Premium compare insights are active for this country.
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [left, setLeft] = useState("Canada");
  const [right, setRight] = useState("Australia");

  const [leftData, setLeftData] = useState<CompareResult | null>(null);
  const [rightData, setRightData] = useState<CompareResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");

  async function fetchCountry(country: string): Promise<CompareResult | null> {
    const res = await fetch(`/api/compare?country=${encodeURIComponent(country)}`);
    const text = await res.text();

    let data: CompareApiResponse;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid response from server");
    }

    if (!data.ok) {
      setErrorCode(data.error.code);
      setError(data.error.message || "Failed request");
      return null;
    }

    return data.data;
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        setErrorCode("");
        setLeftData(null);
        setRightData(null);

        const [l, r] = await Promise.all([fetchCountry(left), fetchCountry(right)]);

        if (l) setLeftData(l);
        if (r) setRightData(r);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [left, right]);

  const premiumUnlocked =
    (leftData && !leftData.premiumLocked) || (rightData && !rightData.premiumLocked);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Compare Countries</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="rounded border p-3"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="rounded border p-3"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="mt-6">Loading...</p>}

        {!loading && errorCode === "UNAUTHORIZED" && (
          <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Log in to compare countries</h2>
            <p className="mt-3 text-sm text-slate-600">
              You need an account before comparing countries side by side.
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
          <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Complete your profile first</h2>
            <p className="mt-3 text-sm text-slate-600">
              We need your profile details before we can compare countries properly.
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
          <p className="mt-6 text-red-600">Error: {error}</p>
        )}

        {!loading && !error && premiumUnlocked && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            Premium compare insights are active. You can see full reasoning and roadmaps.
          </div>
        )}

        {!loading && !error && !premiumUnlocked && leftData && rightData && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            Free compare mode is active. Upgrade to Premium for full reasoning and roadmaps.
          </div>
        )}

        {!loading && !error && (leftData || rightData) && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {leftData && <ScoreCard result={leftData} />}
            {rightData && <ScoreCard result={rightData} />}
          </div>
        )}
      </div>
    </main>
  );
}