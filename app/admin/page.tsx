import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  if (!adminEmails.includes(session.user.email)) {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      isPremium: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Users and Premium Access
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            View registered users and premium status.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Premium
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.isPremium ? (
                      <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}