"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SeedRulesPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");

  async function handleSeed() {
    setMessage("Seeding country rules...");

    try {
      const res = await fetch("/api/admin/seed-country-rules", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to seed");
        return;
      }

      setMessage(`Done. Seeded ${data.count} country rules.`);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while seeding.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Seed Country Rules
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Add or refresh the built-in country rules database.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Session status:</span>{" "}
              {status}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Logged in as:</span>{" "}
              {session?.user?.email || "Not logged in"}
            </p>
          </div>

          <button
            onClick={handleSeed}
            className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Seed Rules
          </button>

          {message ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}