"use client";

import { useState } from "react";
import Link from "next/link";

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function ComparisonRow({
  label,
  free,
  premium,
}: {
  label: string;
  free: string;
  premium: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-slate-200 py-4 text-sm">
      <div className="font-medium text-slate-900">{label}</div>
      <div className="text-slate-600">{free}</div>
      <div className="font-medium text-slate-900">{premium}</div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
    </div>
  );
}

export default function PremiumUpgradeClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to start checkout");
        return;
      }

      if (!data?.url) {
        setError("No checkout URL returned.");
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-lg">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                PlanMyAbroad Premium
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Get real migration guidance, not generic advice
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Premium turns PlanMyAbroad into a real migration decision tool.
                Instead of basic summaries, you get stronger country rankings,
                route-specific insights, deeper AI guidance, and personalized
                action plans based on your profile.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Redirecting..." : "Upgrade to Premium"}
                </button>

                <Link
                  href="/compare"
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Compare Countries First
                </Link>
              </div>

              {error && (
                <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Premium Plan
              </p>

              <div className="mt-4">
                <p className="text-5xl font-bold">$7.99</p>
                <p className="mt-2 text-sm text-slate-500">
                  One-time upgrade for deeper migration guidance
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-700">
                <p>✅ Full country rankings</p>
                <p>✅ Better route matching</p>
                <p>✅ Premium AI Assistant responses</p>
                <p>✅ Personalized roadmap generation</p>
                <p>✅ Stronger decision confidence</p>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Redirecting..." : "Get Premium Now"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              What Premium actually gives you
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Premium is built to help you decide faster, fix the right blockers,
              and move with more confidence.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              title="Full recommendation rankings"
              description="See more than the top few options. Understand which countries fit you best and why they rank where they do."
            />
            <FeatureCard
              title="Better route matching"
              description="Get a stronger match between your real profile and the pathway that actually makes sense for you."
            />
            <FeatureCard
              title="Premium AI Assistant"
              description="Ask migration questions and get deeper, more strategic answers instead of short free-tier guidance."
            />
            <FeatureCard
              title="Step-by-step roadmaps"
              description="Unlock personalized action plans that show what to do next, what documents matter, and what to fix first."
            />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Free vs Premium
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Free helps you explore. Premium helps you decide and act.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-300 pb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <div>Feature</div>
            <div>Free</div>
            <div>Premium</div>
          </div>

          <ComparisonRow
            label="Country recommendations"
            free="Top results only"
            premium="Full rankings with more depth"
          />
          <ComparisonRow
            label="Compare insights"
            free="Basic reasons"
            premium="Full reasoning and better clarity"
          />
          <ComparisonRow
            label="AI Assistant"
            free="Short answer"
            premium="Strategic decision guidance"
          />
          <ComparisonRow
            label="Roadmaps"
            free="Locked"
            premium="Full personalized action plan"
          />
          <ComparisonRow
            label="Profile weaknesses"
            free="Basic blockers"
            premium="Clearer risk and improvement guidance"
          />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Who Premium is for
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Premium is best for people who do not just want to browse
                countries, but actually want to know:
              </p>
              <p>• what their strongest route is</p>
              <p>• what is stopping them right now</p>
              <p>• what to fix first</p>
              <p>• what actions to take next</p>
              <p>• which country is worth prioritizing</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              What makes it worth paying for
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                The goal is not to give you more text. The goal is to give you
                better decisions.
              </p>
              <p>
                Premium helps you avoid spending time on weak routes, understand
                your real blockers, and focus on the option that gives you the
                strongest realistic path forward.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FaqItem
              question="Is Premium a subscription?"
              answer="Right now this page is built as a one-time premium upgrade flow based on your current Stripe checkout setup."
            />
            <FaqItem
              question="Will Premium guarantee visa approval?"
              answer="No. Premium is designed to improve decision quality, route clarity, and preparation. It does not guarantee approval."
            />
            <FaqItem
              question="What changes after I upgrade?"
              answer="You unlock stronger compare insights, full recommendation detail, deeper AI Assistant responses, and roadmap generation."
            />
            <FaqItem
              question="Can I still use the app for free?"
              answer="Yes. Free remains useful for exploration, while Premium is for deeper guidance and action planning."
            />
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to unlock your full migration plan?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Upgrade now to get deeper analysis, better recommendations, and
                premium step-by-step guidance.
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Redirecting..." : "Upgrade to Premium"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}