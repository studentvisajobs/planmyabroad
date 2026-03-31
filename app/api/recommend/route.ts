import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/recommendation-engine";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to view recommendations.",
          },
        },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isPremium: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "User not found.",
          },
        },
        { status: 401 }
      );
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "PROFILE_MISSING",
            message: "Please complete your profile before getting recommendations.",
          },
        },
        { status: 400 }
      );
    }

    const countryRules = await db.countryRule.findMany({
      orderBy: { country: "asc" },
    });

    if (!countryRules.length) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "RULES_NOT_FOUND",
            message: "No country rules are available yet.",
          },
        },
        { status: 404 }
      );
    }

    const recommendations = generateRecommendations(profile, countryRules);

    return NextResponse.json({
      ok: true,
      data: {
        topCountry: recommendations.topCountry,
        rankings: user.isPremium
          ? recommendations.rankings
          : recommendations.rankings.slice(0, 3).map((item) => ({
              ...item,
              reasons: item.reasons.slice(0, 2),
              strengths: item.strengths.slice(0, 2),
              weaknesses: item.weaknesses.slice(0, 2),
            })),
        summary: recommendations.summary,
        premiumLocked: !user.isPremium,
        profileComplete: true,
        premiumBenefits: [
          "Full country rankings",
          "Deeper route reasoning",
          "Personalized roadmap access",
          "Better migration decision support",
        ],
      },
    });
  } catch (error) {
    console.error("Recommend route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "RECOMMEND_FAILED",
          message: "Failed to generate recommendations.",
        },
      },
      { status: 500 }
    );
  }
}