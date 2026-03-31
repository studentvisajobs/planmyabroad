import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { buildPathwayResult } from "@/lib/pathway-engine";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isPremium: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    const allRules = await db.countryRule.findMany({
      orderBy: { country: "asc" },
    });

    if (!allRules.length) {
      return NextResponse.json(
        { error: "No country rules found. Seed country rules first." },
        { status: 500 }
      );
    }

    const filteredRules =
      profile.preferredCountries.length > 0
        ? allRules.filter((rule) => profile.preferredCountries.includes(rule.country))
        : allRules;

    const pathways = filteredRules
      .map((rule) => buildPathwayResult(profile, rule))
      .sort((a, b) => b.eligibilityScore - a.eligibilityScore);

    return NextResponse.json({
      pathways,
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("Pathways route error:", error);
    return NextResponse.json(
      { error: "Failed to generate pathways" },
      { status: 500 }
    );
  }
}