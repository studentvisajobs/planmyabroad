import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/recommendation-engine";

type RecommendSuccessResponse = {
  ok: true;
  data: {
    topCountry: any;
    rankings: any[];
    summary: string;
    premiumLocked: boolean;
    profileComplete: boolean;
    premiumBenefits: string[];
  };
};

type RecommendErrorResponse = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "RULES_NOT_FOUND"
      | "RECOMMEND_FAILED";
    message: string;
  };
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json<RecommendErrorResponse>(
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
      where: { id: session.user.id },
      select: {
        id: true,
        isPremium: true,
      },
    });

    const profile = await db.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!user || !profile) {
      return NextResponse.json<RecommendErrorResponse>(
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
      return NextResponse.json<RecommendErrorResponse>(
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

    return NextResponse.json<RecommendSuccessResponse>(
      {
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recommend route error:", error);

    return NextResponse.json<RecommendErrorResponse>(
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