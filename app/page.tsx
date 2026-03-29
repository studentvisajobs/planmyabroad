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
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function BenefitCard({
  title,
  free,
  premium,
}: {
  title: string;
  free: string;
  premium: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="font-medium text-slate-500">Free</p>
          <p className="mt-1 text-slate-700">{free}</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="font-medium text-amber-700">Premium</p>
          <p className="mt-1 text-slate-800">{premium}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            AI-powered migration planning
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Discover your best path to study, work, or relocate abroad
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            PlanMyAbroad helps you understand which country fits your profile best,
            which migration route is strongest, and what actions to take next.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/profile"
              className="inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Complete Profile
            </Link>

            <Link
              href="/recommend"
              className="inline-flex rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              See Recommendations
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Best Country</p>
              <p className="mt-2 text-sm text-slate-600">
                See which country is strongest for your profile.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Best Route</p>
              <p className="mt-2 text-sm text-slate-600">
                Know whether study, work, or migration fits best.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Action Plan</p>
              <p className="mt-2 text-sm text-slate-600">
                Unlock roadmap steps that show what to do next.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Example output
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Australia — Skilled Migration</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Strong overall fit based on work experience, academic background,
                  and financial readiness.
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide">Score</p>
                <p className="text-3xl font-bold">73%</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-white">Why it fits</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>• Your work experience is competitive</li>
                <li>• Your academic background supports this route</li>
                <li>• Your savings improve readiness for this option</li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-amber-300/30 bg-amber-400/10 p-4">
              <p className="text-sm font-semibold text-amber-200">
                Premium unlocks the full roadmap
              </p>
              <p className="mt-2 text-sm text-slate-200">
                See what to fix first, what documents matter, and the next steps to take.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Why PlanMyAbroad
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Stop guessing. Start planning with clarity.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Most users do not need more immigration content. They need better decisions.
              PlanMyAbroad helps you choose the best country, identify the strongest
              route, and focus on the next actions that matter most.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              title="Profile-based country ranking"
              description="Rank countries based on your actual profile instead of browsing general advice."
            />
            <FeatureCard
              title="Route-specific recommendations"
              description="See whether study, work, or migration is your strongest path for each country."
            />
            <FeatureCard
              title="AI Assistant guidance"
              description="Ask practical migration questions and get personalized answers based on your data."
            />
            <FeatureCard
              title="Roadmap-driven planning"
              description="Unlock step-by-step plans showing what to fix first and what to do next."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Go from profile to decision in 3 steps
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <StepCard
            number="1"
            title="Complete your profile"
            description="Add your education, work experience, finances, and migration preferences."
          />
          <StepCard
            number="2"
            title="See your recommendations"
            description="Discover which countries and routes are strongest for your profile right now."
          />
          <StepCard
            number="3"
            title="Follow your roadmap"
            description="Unlock the action plan that shows what to improve and what to do next."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Free vs Premium
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Free shows what looks best. Premium gives you the action plan.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <BenefitCard
            title="Recommendations"
            free="See top options and basic ranking insight."
            premium="Unlock full rankings, deeper reasoning, and stronger decision confidence."
          />
          <BenefitCard
            title="Best route clarity"
            free="See your likely strongest route."
            premium="Understand why that route wins and what weakens your fit."
          />
          <BenefitCard
            title="AI Assistant"
            free="Get shorter guidance and simple next steps."
            premium="Get deeper strategic answers, risks, and better migration planning support."
          />
          <BenefitCard
            title="Roadmaps"
            free="Preview limited guidance."
            premium="Unlock step-by-step action plans, priorities, and next best actions."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                Start now
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Find your best country and strongest route
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Create your profile, open recommendations, and start making better migration decisions today.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Complete Profile
              </Link>

              <Link
                href="/premium"
                className="inline-flex rounded-2xl border border-amber-300 bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
              >
                View Premium
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}