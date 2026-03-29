import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import PremiumUpgradeClient from "./premium-upgrade-client";

function ActionCard({
  title,
  description,
  href,
  buttonLabel,
}: {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default async function PremiumPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Premium</h1>
            <p className="mt-3 text-sm text-slate-600">
              Please log in to view your premium access.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      isPremium: true,
    },
  });

  if (user?.isPremium) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              PlanMyAbroad Premium
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Your premium access is active
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Premium gives you the part that matters most: clearer decisions and a
              step-by-step action plan. You now have access to stronger country ranking,
              better route clarity, deeper AI Assistant responses, and full roadmap tools.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/recommend"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Open Recommendations
              </Link>

              <Link
                href="/pathways"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                Open Pathways
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-green-700">Status</p>
              <p className="mt-2 text-2xl font-bold text-green-900">
                Premium Active
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Main Value</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                Better Decisions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Main Output</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                Action Plan
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                What premium actually gives you
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Premium is not just more text. It is what turns insight into action.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <ValueCard
                title="Best country clarity"
                description="See which countries are strongest for your profile and understand why one option is better than another."
              />
              <ValueCard
                title="Best route matching"
                description="Know whether study, work, or migration is your strongest realistic route instead of guessing."
              />
              <ValueCard
                title="Full AI Assistant guidance"
                description="Ask migration questions and get deeper, more strategic answers instead of short limited responses."
              />
              <ValueCard
                title="Step-by-step roadmap"
                description="Unlock personalized action plans that show what to fix first, what documents matter, and what to do next."
              />
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Start here
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                These are the best places to use premium right now.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ActionCard
                title="Recommendations"
                description="See your strongest countries ranked from best to weakest, and understand why your top option wins."
                href="/recommend"
                buttonLabel="Open Recommendations"
              />

              <ActionCard
                title="Pathways + Roadmaps"
                description="Open your strongest pathways, then unlock the full roadmap for any country to see your step-by-step plan."
                href="/pathways"
                buttonLabel="Open Pathways"
              />

              <ActionCard
                title="Compare Countries"
                description="Compare countries side by side with stronger reasoning, clearer blockers, and premium roadmap access."
                href="/compare"
                buttonLabel="Open Compare"
              />

              <ActionCard
                title="AI Assistant"
                description="Ask practical migration questions and get premium-level answers with better route and action guidance."
                href="/assistant"
                buttonLabel="Open AI Assistant"
              />
            </div>
          </section>
        </div>
      </main>
    );
  }

  return <PremiumUpgradeClient />;
}