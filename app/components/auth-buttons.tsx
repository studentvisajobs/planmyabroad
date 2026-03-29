"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm text-slate-500">Loading...</span>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const displayName =
    session.user?.name?.trim() ||
    session.user?.email?.split("@")[0] ||
    "Account";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right md:block">
        <p className="text-sm font-medium text-slate-900">{displayName}</p>
        <p className="text-xs text-slate-500">{session.user?.email}</p>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
      >
        Log out
      </button>
    </div>
  );
}