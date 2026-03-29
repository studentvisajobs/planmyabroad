export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>

          <p className="mt-3 text-sm text-slate-500">
            We aim to respond within 24–48 hours.
          </p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              If you need help with your account, payments, premium access, or
              migration recommendations, feel free to reach out.
            </p>

            {/* Support Email */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">Support Email</p>
              <p className="mt-2">support@planmyabroad.com</p>
            </div>

            {/* Business Info */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">Business Location</p>
              <p className="mt-2">Manchester, United Kingdom</p>
            </div>

            {/* What users can contact for */}
            <div>
              <p className="font-medium text-slate-900">You can contact us for:</p>
              <ul className="mt-2 space-y-1">
                <li>• Account access issues</li>
                <li>• Payment or billing questions</li>
                <li>• Premium feature support</li>
                <li>• Technical issues or bugs</li>
                <li>• General enquiries</li>
              </ul>
            </div>

            <p>
              PlanMyAbroad is an independent migration planning platform and not
              affiliated with any government or immigration authority.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}