export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              PlanMyAbroad provides migration planning tools, pathway scoring,
              comparison features, AI-powered guidance, and premium relocation
              planning support.
            </p>

            <p>
              The platform does not provide legal advice, visa decisions, or
              official embassy approvals. Users must verify final requirements
              with official immigration and embassy sources before acting on any
              recommendation.
            </p>

            <p>
              You are responsible for ensuring that the information you provide
              is accurate and up to date.
            </p>

            <p>
              Premium purchases unlock additional features and deeper planning
              tools. Access terms and features may evolve as the platform grows.
            </p>

            <p>
              Unless required by law, payments are non-refundable once premium
              access has been granted.
            </p>

            <p>
              Abuse, fraudulent use, misuse of the platform, or attempts to
              interfere with the service may result in account restrictions or
              termination.
            </p>

            <p>
              PlanMyAbroad is not liable for losses, delays, refusals, or other
              outcomes arising from reliance on platform recommendations.
            </p>

            <p>
              We may update these Terms of Use at any time. Continued use of the
              platform means you accept the latest version.
            </p>

            <p>
              These terms are governed by the laws of England and Wales.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}