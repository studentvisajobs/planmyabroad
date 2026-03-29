export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              PlanMyAbroad collects information you provide to create your
              migration profile, generate recommendations, personalize your
              experience, and manage premium access.
            </p>

            <p>
              This may include account details, profile information, saved
              pathways, and activity related to your use of the platform.
            </p>

            <p>
              We use this information to provide migration planning tools,
              improve our services, support users, and deliver personalized
              recommendations and roadmap features.
            </p>

            <p>
              Payment processing is handled by Stripe. We do not store your full
              card details on our servers.
            </p>

            <p>
              We do not claim to be an official embassy, immigration authority,
              or government service. Our tools are for planning and guidance
              only, and final decisions should be verified with official sources.
            </p>

            <p>
              We take reasonable steps to protect your information, but no
              system can guarantee complete security.
            </p>

            <p>
              You may request correction or deletion of your personal data by
              contacting us through the contact page.
            </p>

            <p>
              We may update this Privacy Policy from time to time. Continued use
              of the platform means you accept the latest version.
            </p>

            <p>
              For privacy questions or support, please contact us through the
              contact page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}