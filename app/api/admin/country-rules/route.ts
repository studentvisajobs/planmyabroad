import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  return !!email && adminEmails.includes(email);
}

export async function GET() {
  try {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rules = await db.countryRule.findMany({
      orderBy: { country: "asc" },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load country rules" },
      { status: 500 }
    );
  }
}