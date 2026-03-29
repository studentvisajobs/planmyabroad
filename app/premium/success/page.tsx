import Link from "next/link";

export default function PremiumSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-green-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Premium Activated
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Your upgrade was successful
          </h1>
          <p className="mt-4 text-slate-600">
            Your account is now being upgraded to Premium. If the premium page
            still says locked, wait a few seconds and refresh.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/premium"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Go to Premium
            </Link>
            <Link
              href="/pathways"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Back to Pathways
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}