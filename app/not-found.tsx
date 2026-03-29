import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            404
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Page not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The page you’re looking for does not exist or may have been moved.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Go home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}