"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function DashboardContent() {
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        {upgraded && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
            Premium upgrade successful. Your premium features are now active.
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/recommend"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-lg font-bold text-slate-900">Recommendations</h2>
            <p className="mt-2 text-sm text-slate-600">
              See your best country and strongest migration route.
            </p>
          </Link>

          <Link
            href="/pathways"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-lg font-bold text-slate-900">Pathways</h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore detailed route breakdowns and roadmap access.
            </p>
          </Link>

          <Link
            href="/compare"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-lg font-bold text-slate-900">Compare</h2>
            <p className="mt-2 text-sm text-slate-600">
              Compare countries side by side.
            </p>
          </Link>

          <Link
            href="/assistant"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-lg font-bold text-slate-900">AI Assistant</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ask migration questions based on your profile.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}