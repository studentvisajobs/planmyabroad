"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type FormState = {
  country: string;
  studyAvailable: boolean;
  workAvailable: boolean;
  migrationAvailable: boolean;

  minAge: string;
  maxAge: string;

  requiresDegree: boolean;
  requiresWorkExperience: boolean;
  requiresJobOffer: boolean;
  requiresEnglishTest: boolean;
  requiresFundsProof: boolean;

  acceptedEnglishTests: string;
  minEnglishScore: string;

  estimatedStudyCost: string;
  estimatedWorkVisaCost: string;
  estimatedMigrationCost: string;

  fundsProofAmount: string;
  processingTimeStudy: string;
  processingTimeWork: string;
  processingTimeMigration: string;

  keyDocuments: string;
  commonRefusalReasons: string[];
  notes: string;
  officialSourceUrl: string;
};

export default function EditCountryRulePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormState>({
    country: "",
    studyAvailable: false,
    workAvailable: false,
    migrationAvailable: false,

    minAge: "",
    maxAge: "",

    requiresDegree: false,
    requiresWorkExperience: false,
    requiresJobOffer: false,
    requiresEnglishTest: false,
    requiresFundsProof: false,

    acceptedEnglishTests: "",
    minEnglishScore: "",

    estimatedStudyCost: "",
    estimatedWorkVisaCost: "",
    estimatedMigrationCost: "",

    fundsProofAmount: "",
    processingTimeStudy: "",
    processingTimeWork: "",
    processingTimeMigration: "",

    keyDocuments: "",
    commonRefusalReasons: [],
    notes: "",
    officialSourceUrl: "",
  });

  useEffect(() => {
    async function loadRule() {
      try {
        const res = await fetch(`/api/admin/country-rules/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Failed to load rule");
          return;
        }

        setForm({
          country: data.country || "",
          studyAvailable: data.studyAvailable,
          workAvailable: data.workAvailable,
          migrationAvailable: data.migrationAvailable,

          minAge: data.minAge?.toString() || "",
          maxAge: data.maxAge?.toString() || "",

          requiresDegree: data.requiresDegree,
          requiresWorkExperience: data.requiresWorkExperience,
          requiresJobOffer: data.requiresJobOffer,
          requiresEnglishTest: data.requiresEnglishTest,
          requiresFundsProof: data.requiresFundsProof,

          acceptedEnglishTests: data.acceptedEnglishTests?.join(", ") || "",
          minEnglishScore: data.minEnglishScore?.toString() || "",

          estimatedStudyCost: data.estimatedStudyCost || "",
          estimatedWorkVisaCost: data.estimatedWorkVisaCost || "",
          estimatedMigrationCost: data.estimatedMigrationCost || "",

          fundsProofAmount: data.fundsProofAmount || "",
          processingTimeStudy: data.processingTimeStudy || "",
          processingTimeWork: data.processingTimeWork || "",
          processingTimeMigration: data.processingTimeMigration || "",

          keyDocuments: data.keyDocuments?.join("\n") || "",
          commonRefusalReasons: data.commonRefusalReasons?.join("\n") || "",
          notes: data.notes || "",
          officialSourceUrl: data.officialSourceUrl || "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadRule();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/country-rules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: form.country,
          studyAvailable: form.studyAvailable,
          workAvailable: form.workAvailable,
          migrationAvailable: form.migrationAvailable,

          minAge: form.minAge === "" ? "" : Number(form.minAge),
          maxAge: form.maxAge === "" ? "" : Number(form.maxAge),

          requiresDegree: form.requiresDegree,
          requiresWorkExperience: form.requiresWorkExperience,
          requiresJobOffer: form.requiresJobOffer,
          requiresEnglishTest: form.requiresEnglishTest,
          requiresFundsProof: form.requiresFundsProof,

          acceptedEnglishTests: form.acceptedEnglishTests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          minEnglishScore:
            form.minEnglishScore === "" ? "" : Number(form.minEnglishScore),

          estimatedStudyCost: form.estimatedStudyCost,
          estimatedWorkVisaCost: form.estimatedWorkVisaCost,
          estimatedMigrationCost: form.estimatedMigrationCost,

          fundsProofAmount: form.fundsProofAmount,
          processingTimeStudy: form.processingTimeStudy,
          processingTimeWork: form.processingTimeWork,
          processingTimeMigration: form.processingTimeMigration,

          keyDocuments: form.keyDocuments
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

          commonRefusalReasons: form.commonRefusalReasons
            .map((item) => item.trim())
            .filter(Boolean),

          notes: form.notes,
          officialSourceUrl: form.officialSourceUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to update rule");
        return;
      }

      setMessage("Country rule updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12 text-sm text-slate-600">
          Loading country rule...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Edit Country Rule
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Update the structured rule data used by the compare, pathways, and premium engine.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Country"
              value={form.country}
              onChange={(value) => setForm({ ...form, country: value })}
            />

            <Field
              label="Minimum English Score"
              value={form.minEnglishScore}
              onChange={(value) => setForm({ ...form, minEnglishScore: value })}
            />

            <Field
              label="Minimum Age"
              value={form.minAge}
              onChange={(value) => setForm({ ...form, minAge: value })}
            />

            <Field
              label="Maximum Age"
              value={form.maxAge}
              onChange={(value) => setForm({ ...form, maxAge: value })}
            />

            <Field
              label="Accepted English Tests (comma separated)"
              value={form.acceptedEnglishTests}
              onChange={(value) =>
                setForm({ ...form, acceptedEnglishTests: value })
              }
            />

            <Field
              label="Official Source URL"
              value={form.officialSourceUrl}
              onChange={(value) =>
                setForm({ ...form, officialSourceUrl: value })
              }
            />

            <Field
              label="Estimated Study Cost"
              value={form.estimatedStudyCost}
              onChange={(value) =>
                setForm({ ...form, estimatedStudyCost: value })
              }
            />

            <Field
              label="Estimated Work Visa Cost"
              value={form.estimatedWorkVisaCost}
              onChange={(value) =>
                setForm({ ...form, estimatedWorkVisaCost: value })
              }
            />

            <Field
              label="Estimated Migration Cost"
              value={form.estimatedMigrationCost}
              onChange={(value) =>
                setForm({ ...form, estimatedMigrationCost: value })
              }
            />

            <Field
              label="Funds Proof Amount"
              value={form.fundsProofAmount}
              onChange={(value) =>
                setForm({ ...form, fundsProofAmount: value })
              }
            />

            <Field
              label="Study Processing Time"
              value={form.processingTimeStudy}
              onChange={(value) =>
                setForm({ ...form, processingTimeStudy: value })
              }
            />

            <Field
              label="Work Processing Time"
              value={form.processingTimeWork}
              onChange={(value) =>
                setForm({ ...form, processingTimeWork: value })
              }
            />

            <Field
              label="Migration Processing Time"
              value={form.processingTimeMigration}
              onChange={(value) =>
                setForm({ ...form, processingTimeMigration: value })
              }
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Checkbox
              label="Study Available"
              checked={form.studyAvailable}
              onChange={(checked) =>
                setForm({ ...form, studyAvailable: checked })
              }
            />
            <Checkbox
              label="Work Available"
              checked={form.workAvailable}
              onChange={(checked) =>
                setForm({ ...form, workAvailable: checked })
              }
            />
            <Checkbox
              label="Migration Available"
              checked={form.migrationAvailable}
              onChange={(checked) =>
                setForm({ ...form, migrationAvailable: checked })
              }
            />

            <Checkbox
              label="Requires Degree"
              checked={form.requiresDegree}
              onChange={(checked) =>
                setForm({ ...form, requiresDegree: checked })
              }
            />
            <Checkbox
              label="Requires Work Experience"
              checked={form.requiresWorkExperience}
              onChange={(checked) =>
                setForm({ ...form, requiresWorkExperience: checked })
              }
            />
            <Checkbox
              label="Requires Job Offer"
              checked={form.requiresJobOffer}
              onChange={(checked) =>
                setForm({ ...form, requiresJobOffer: checked })
              }
            />
            <Checkbox
              label="Requires English Test"
              checked={form.requiresEnglishTest}
              onChange={(checked) =>
                setForm({ ...form, requiresEnglishTest: checked })
              }
            />
            <Checkbox
              label="Requires Funds Proof"
              checked={form.requiresFundsProof}
              onChange={(checked) =>
                setForm({ ...form, requiresFundsProof: checked })
              }
            />
          </div>

          <div className="mt-6 grid gap-5">
            <TextareaField
              label="Key Documents (one per line)"
              value={form.keyDocuments}
              onChange={(value) => setForm({ ...form, keyDocuments: value })}
            />

            <TextareaField
              label="Common Refusal Reasons (one per line)"
              value={form.commonRefusalReasons}
              onChange={(value) =>
                setForm({ ...form, commonRefusalReasons: value })
              }
            />

            <TextareaField
              label="Notes"
              value={form.notes}
              onChange={(value) => setForm({ ...form, notes: value })}
            />
          </div>

          {message ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/country-rules")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[140px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300"
      />
      <span>{label}</span>
    </label>
  );
}