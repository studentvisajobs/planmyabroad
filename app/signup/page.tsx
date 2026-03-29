"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Create your account
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Start planning your migration with more clarity
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Build your profile, compare countries, save pathways, and unlock
              a premium relocation roadmap when you are ready.
            </p>

            <div className="mt-8 rounded-2xl bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">
                With your account, you can
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>✔ Save pathways for later review</li>
                <li>✔ Track your premium access</li>
                <li>✔ Continue your migration planning anytime</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Sign up</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your account to get started.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}