"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type SavedPathway = {
  id: string;
  country: string;
  pathway: string;
  score: number;
  createdAt: string;
};

type ProfileSummary = {
  nationality?: string;
  currentCountry?: string;
  educationLevel?: string;
  workExperience?: number;
  preferredCountries?: string[];
  updatedAt?: string;
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";

  const [saved, setSaved] = useState<SavedPathway[]>([]);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorSaved, setErrorSaved] = useState("");
  const [errorProfile, setErrorProfile] = useState("");

  useEffect(() => {
    async function loadSavedPathways() {
      try {
        const res = await fetch("/api/saved");
        const data = await res.json();

        if (!res.ok) {
          setErrorSaved(data.error || "Failed to load saved pathways");
          setSaved([]);
          return;
        }

        setSaved(data);
      } catch (err) {
        console.error(err);
        setErrorSaved("Something went wrong");
      } finally {
        setLoadingSaved(false);
      }
    }

    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!res.ok) {
          setErrorProfile(data.error || "Failed to load profile");
          return;
        }

        setProfile(data.profile || null);
      } catch (err) {
        console.error(err);
        setErrorProfile("Something went wrong");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadSavedPathways();
    loadProfile();
  }, []);

  const isPremium = Boolean((session?.user as any)?.isPremium);
  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {status === "loading" ? "..." : displayName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Track your premium access, saved pathways, and your latest migration
            planning activity in one place.
          </p>
        </div>

        {upgraded ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-900 shadow-sm">
            <p className="font-semibold">Premium activated successfully</p>
            <p className="mt-1 text-sm text-green-800">
              Your payment was successful and your premium roadmap access is now active.
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Account Overview
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Signed in as</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {status === "loading"
                    ? "Loading..."
                    : session?.user?.email || "Not signed in"}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isPremium
                    ? "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isPremium ? "text-green-700" : "text-amber-700"
                  }`}
                >
                  Premium Status
                </p>
                <p
                  className={`mt-2 text-base font-semibold ${
                    isPremium ? "text-green-900" : "text-amber-900"
                  }`}
                >
                  {isPremium ? "Premium Active" : "Free Plan"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Premium Access
            </h2>

            {isPremium ? (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="font-semibold text-green-900">
                  Your premium plan is active
                </p>
                <p className="mt-2 text-sm leading-6 text-green-800">
                  You can generate your full personalized migration roadmap anytime.
                </p>

                <Link
                  href="/premium"
                  className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Open Premium
                </Link>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-semibold text-amber-900">
                  Unlock your personalized plan
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Upgrade once to get your step-by-step relocation roadmap.
                </p>

                <Link
                  href="/premium"
                  className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Latest Profile Summary
              </h2>
              <Link
                href="/profile"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Update profile
              </Link>
            </div>

            <div className="mt-6">
              {loadingProfile ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                  Loading profile...
                </div>
              ) : errorProfile ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                  {errorProfile}
                </div>
              ) : !profile ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No profile found yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Create your profile so we can personalize your pathways.
                  </p>
                  <Link
                    href="/profile"
                    className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Create Profile
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Nationality</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {profile.nationality || "Not set"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Current Country</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {profile.currentCountry || "Not set"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Education Level</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {profile.educationLevel || "Not set"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Work Experience</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {typeof profile.workExperience === "number"
                        ? `${profile.workExperience} years`
                        : "Not set"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                    <p className="text-sm font-medium text-slate-500">
                      Preferred Countries
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {profile.preferredCountries?.length
                        ? profile.preferredCountries.join(", ")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Activity
              </h2>
              <Link
                href="/pathways"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Explore more
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Profile</p>
                <p className="mt-2 font-semibold text-slate-900">
                  Keep your profile updated for more accurate pathway scoring.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Pathways</p>
                <p className="mt-2 font-semibold text-slate-900">
                  Compare top countries and save your strongest options.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Premium</p>
                <p className="mt-2 font-semibold text-slate-900">
                  Use your premium roadmap to move from guessing to a clear plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Saved Pathways
            </h2>
            <Link
              href="/pathways"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              View pathways
            </Link>
          </div>

          <div className="mt-6">
            {loadingSaved ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                Loading saved pathways...
              </div>
            ) : errorSaved ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {errorSaved}
              </div>
            ) : saved.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  No saved pathways yet
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Save pathways from your recommendations page to review them later.
                </p>
                <Link
                  href="/pathways"
                  className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Explore Pathways
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {saved.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {item.country}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.pathway}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                        Score: {item.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}