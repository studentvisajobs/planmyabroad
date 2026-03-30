"use client";

import { useEffect, useState } from "react";

type ProfileForm = {
  nationality: string;
  currentCountry: string;
  age: string;
  educationLevel: string;
  fieldOfStudy: string;
  gpa: string;
  workExperience: string;
  occupation: string;
  englishTestType: string;
  englishScore: string;
  budget: string;
  preferredCountries: string;
  maritalStatus: string;
  hasPassport: boolean;
  hasDegreeCertificate: boolean;
  hasTranscript: boolean;
  hasCv: boolean;
  hasSop: boolean;
  hasRecommendationLetter: boolean;
  hasEnglishTestResult: boolean;
  studyIntent: string;
  preferredIntake: string;
  savingsAmount: string;
  hasScholarshipInterest: boolean;
  hasJobOffer: boolean;
  jobOfferCountry: string;
  annualSalary: string;
  spouseHasEnglish: boolean;
  spouseEnglishScore: string;
  previousVisaRefusal: boolean;
  criminalRecord: boolean;
  relocationTimelineMonths: string;
};

const initialForm: ProfileForm = {
  nationality: "",
  currentCountry: "",
  age: "",
  educationLevel: "BACHELORS",
  fieldOfStudy: "",
  gpa: "",
  workExperience: "0",
  occupation: "",
  englishTestType: "NONE",
  englishScore: "",
  budget: "",
  preferredCountries: "",
  maritalStatus: "SINGLE",
  hasPassport: false,
  hasDegreeCertificate: false,
  hasTranscript: false,
  hasCv: false,
  hasSop: false,
  hasRecommendationLetter: false,
  hasEnglishTestResult: false,
  studyIntent: "NONE",
  preferredIntake: "",
  savingsAmount: "",
  hasScholarshipInterest: false,
  hasJobOffer: false,
  jobOfferCountry: "",
  annualSalary: "",
  spouseHasEnglish: false,
  spouseEnglishScore: "",
  previousVisaRefusal: false,
  criminalRecord: false,
  relocationTimelineMonths: "",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      <span>{label}</span>
    </label>
  );
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!res.ok) {
          setLoadingProfile(false);
          return;
        }

        const p = data;

        setForm({
          nationality: p.nationality || "",
          currentCountry: p.currentCountry || "",
          age: p.age?.toString() || "",
          educationLevel: p.educationLevel || "BACHELORS",
          fieldOfStudy: p.fieldOfStudy || "",
          gpa: p.gpa?.toString() || "",
          workExperience: p.workExperience?.toString() || "0",
          occupation: p.occupation || "",
          englishTestType: p.englishTestType || "NONE",
          englishScore: p.englishScore?.toString() || "",
          budget: p.budget?.toString() || "",
          preferredCountries: (p.preferredCountries || []).join(", "),
          maritalStatus: p.maritalStatus || "SINGLE",
          hasPassport: !!p.hasPassport,
          hasDegreeCertificate: !!p.hasDegreeCertificate,
          hasTranscript: !!p.hasTranscript,
          hasCv: !!p.hasCv,
          hasSop: !!p.hasSop,
          hasRecommendationLetter: !!p.hasRecommendationLetter,
          hasEnglishTestResult: !!p.hasEnglishTestResult,
          studyIntent: p.studyIntent || "NONE",
          preferredIntake: p.preferredIntake || "",
          savingsAmount: p.savingsAmount?.toString() || "",
          hasScholarshipInterest: !!p.hasScholarshipInterest,
          hasJobOffer: !!p.hasJobOffer,
          jobOfferCountry: p.jobOfferCountry || "",
          annualSalary: p.annualSalary?.toString() || "",
          spouseHasEnglish: !!p.spouseHasEnglish,
          spouseEnglishScore: p.spouseEnglishScore?.toString() || "",
          previousVisaRefusal: !!p.previousVisaRefusal,
          criminalRecord: !!p.criminalRecord,
          relocationTimelineMonths: p.relocationTimelineMonths?.toString() || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        nationality: form.nationality,
        currentCountry: form.currentCountry,
        age: form.age ? Number(form.age) : null,
        educationLevel: form.educationLevel,
        fieldOfStudy: form.fieldOfStudy || null,
        gpa: form.gpa ? Number(form.gpa) : null,
        workExperience: Number(form.workExperience || 0),
        occupation: form.occupation || null,
        englishTestType: form.englishTestType,
        englishScore: form.englishScore ? Number(form.englishScore) : null,
        budget: form.budget ? Number(form.budget) : null,
        preferredCountries: form.preferredCountries
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        maritalStatus: form.maritalStatus,
        hasPassport: form.hasPassport,
        hasDegreeCertificate: form.hasDegreeCertificate,
        hasTranscript: form.hasTranscript,
        hasCv: form.hasCv,
        hasSop: form.hasSop,
        hasRecommendationLetter: form.hasRecommendationLetter,
        hasEnglishTestResult: form.hasEnglishTestResult,
        studyIntent: form.studyIntent,
        preferredIntake: form.preferredIntake || null,
        savingsAmount: form.savingsAmount ? Number(form.savingsAmount) : null,
        hasScholarshipInterest: form.hasScholarshipInterest,
        hasJobOffer: form.hasJobOffer,
        jobOfferCountry: form.jobOfferCountry || null,
        annualSalary: form.annualSalary ? Number(form.annualSalary) : null,
        spouseHasEnglish: form.spouseHasEnglish,
        spouseEnglishScore: form.spouseEnglishScore
          ? Number(form.spouseEnglishScore)
          : null,
        previousVisaRefusal: form.previousVisaRefusal,
        criminalRecord: form.criminalRecord,
        relocationTimelineMonths: form.relocationTimelineMonths
          ? Number(form.relocationTimelineMonths)
          : null,
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save profile");
        return;
      }

      setMessage("Profile saved successfully.");
      window.location.href = "/recommend";
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving profile.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Build your migration profile
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Tell PlanMyAbroad about your background so we can assess your strongest pathways.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nationality"
              value={form.nationality}
              onChange={(value) => setForm({ ...form, nationality: value })}
            />
            <Field
              label="Current Country"
              value={form.currentCountry}
              onChange={(value) => setForm({ ...form, currentCountry: value })}
            />
            <Field
              label="Age"
              type="number"
              value={form.age}
              onChange={(value) => setForm({ ...form, age: value })}
            />

            <SelectField
              label="Education Level"
              value={form.educationLevel}
              onChange={(value) => setForm({ ...form, educationLevel: value })}
              options={[
                { label: "High School", value: "HIGH_SCHOOL" },
                { label: "Diploma", value: "DIPLOMA" },
                { label: "Bachelors", value: "BACHELORS" },
                { label: "Masters", value: "MASTERS" },
                { label: "PhD", value: "PHD" },
              ]}
            />

            <Field
              label="Field of Study"
              value={form.fieldOfStudy}
              onChange={(value) => setForm({ ...form, fieldOfStudy: value })}
            />
            <Field
              label="GPA"
              value={form.gpa}
              onChange={(value) => setForm({ ...form, gpa: value })}
            />
            <Field
              label="Work Experience (years)"
              type="number"
              value={form.workExperience}
              onChange={(value) => setForm({ ...form, workExperience: value })}
            />
            <Field
              label="Occupation"
              value={form.occupation}
              onChange={(value) => setForm({ ...form, occupation: value })}
            />

            <SelectField
              label="English Test Type"
              value={form.englishTestType}
              onChange={(value) => setForm({ ...form, englishTestType: value })}
              options={[
                { label: "None", value: "NONE" },
                { label: "IELTS", value: "IELTS" },
                { label: "TOEFL", value: "TOEFL" },
                { label: "PTE", value: "PTE" },
              ]}
            />

            <Field
              label="English Score"
              value={form.englishScore}
              onChange={(value) => setForm({ ...form, englishScore: value })}
            />
            <Field
              label="Budget"
              value={form.budget}
              onChange={(value) => setForm({ ...form, budget: value })}
            />
            <Field
              label="Savings Amount"
              value={form.savingsAmount}
              onChange={(value) => setForm({ ...form, savingsAmount: value })}
            />
            <Field
              label="Preferred Countries (comma separated)"
              value={form.preferredCountries}
              onChange={(value) => setForm({ ...form, preferredCountries: value })}
            />

            <SelectField
              label="Marital Status"
              value={form.maritalStatus}
              onChange={(value) => setForm({ ...form, maritalStatus: value })}
              options={[
                { label: "Single", value: "SINGLE" },
                { label: "Married", value: "MARRIED" },
              ]}
            />

            <SelectField
              label="Study Intent"
              value={form.studyIntent}
              onChange={(value) => setForm({ ...form, studyIntent: value })}
              options={[
                { label: "None", value: "NONE" },
                { label: "Undergraduate", value: "UNDERGRADUATE" },
                { label: "Postgraduate", value: "POSTGRADUATE" },
              ]}
            />

            <Field
              label="Preferred Intake"
              value={form.preferredIntake}
              onChange={(value) => setForm({ ...form, preferredIntake: value })}
            />
            <Field
              label="Job Offer Country"
              value={form.jobOfferCountry}
              onChange={(value) => setForm({ ...form, jobOfferCountry: value })}
            />
            <Field
              label="Annual Salary"
              value={form.annualSalary}
              onChange={(value) => setForm({ ...form, annualSalary: value })}
            />
            <Field
              label="Spouse English Score"
              value={form.spouseEnglishScore}
              onChange={(value) => setForm({ ...form, spouseEnglishScore: value })}
            />
            <Field
              label="Relocation Timeline (months)"
              type="number"
              value={form.relocationTimelineMonths}
              onChange={(value) =>
                setForm({ ...form, relocationTimelineMonths: value })
              }
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <CheckboxField
              label="I have a passport"
              checked={form.hasPassport}
              onChange={(checked) => setForm({ ...form, hasPassport: checked })}
            />
            <CheckboxField
              label="I have my degree certificate"
              checked={form.hasDegreeCertificate}
              onChange={(checked) =>
                setForm({ ...form, hasDegreeCertificate: checked })
              }
            />
            <CheckboxField
              label="I have my transcript"
              checked={form.hasTranscript}
              onChange={(checked) => setForm({ ...form, hasTranscript: checked })}
            />
            <CheckboxField
              label="I have a CV"
              checked={form.hasCv}
              onChange={(checked) => setForm({ ...form, hasCv: checked })}
            />
            <CheckboxField
              label="I have an SOP"
              checked={form.hasSop}
              onChange={(checked) => setForm({ ...form, hasSop: checked })}
            />
            <CheckboxField
              label="I have recommendation letters"
              checked={form.hasRecommendationLetter}
              onChange={(checked) =>
                setForm({ ...form, hasRecommendationLetter: checked })
              }
            />
            <CheckboxField
              label="I have English test results"
              checked={form.hasEnglishTestResult}
              onChange={(checked) =>
                setForm({ ...form, hasEnglishTestResult: checked })
              }
            />
            <CheckboxField
              label="I am interested in scholarships"
              checked={form.hasScholarshipInterest}
              onChange={(checked) =>
                setForm({ ...form, hasScholarshipInterest: checked })
              }
            />
            <CheckboxField
              label="I have a job offer"
              checked={form.hasJobOffer}
              onChange={(checked) => setForm({ ...form, hasJobOffer: checked })}
            />
            <CheckboxField
              label="My spouse has English ability"
              checked={form.spouseHasEnglish}
              onChange={(checked) =>
                setForm({ ...form, spouseHasEnglish: checked })
              }
            />
            <CheckboxField
              label="I have had a previous visa refusal"
              checked={form.previousVisaRefusal}
              onChange={(checked) =>
                setForm({ ...form, previousVisaRefusal: checked })
              }
            />
            <CheckboxField
              label="I have a criminal record"
              checked={form.criminalRecord}
              onChange={(checked) =>
                setForm({ ...form, criminalRecord: checked })
              }
            />
          </div>

          {message ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}