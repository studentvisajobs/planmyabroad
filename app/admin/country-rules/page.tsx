"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CountryRuleSummary = {
  id: string;
  country: string;
  studyAvailable: boolean;
  workAvailable: boolean;
  migrationAvailable: boolean;
  lastReviewedAt: string | null;
};

export default function AdminCountryRulesPage() {
  const [rules, setRules] = useState<CountryRuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRules() {
      try {
        const res = await fetch("/api/admin/country-rules");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load rules");
          return;
        }

        setRules(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadRules();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Country Rules Editor
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            View and manage the country rules powering your migration engine.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-slate-600">Loading country rules...</p>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Study
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Work
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Migration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Last Reviewed
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        {rule.country}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {rule.studyAvailable ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {rule.workAvailable ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {rule.migrationAvailable ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {rule.lastReviewedAt
                          ? new Date(rule.lastReviewedAt).toLocaleDateString()
                          : "Not reviewed"}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/country-rules/${rule.id}`}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}