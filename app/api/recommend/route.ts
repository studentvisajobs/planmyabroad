import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/recommendation-engine";

type RecommendItem = {
  country: string;
  score: number;
  eligible: boolean;
  bestRoute: "study" | "work" | "migration" | null;
  secondRoute: "study" | "work" | "migration" | null;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
};

type RecommendSuccessResponse = {
  ok: true;
  data: {
    topCountry: RecommendItem | null;
    rankings: RecommendItem[];
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

    if (!session?.user?.email) {
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
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile) {
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

    const recommendations = generateRecommendations(user.profile, countryRules);
    const isPremium = user.isPremium;

    if (!isPremium) {
      return NextResponse.json<RecommendSuccessResponse>({
        ok: true,
        data: {
          topCountry: recommendations.topCountry
            ? {
                ...recommendations.topCountry,
                reasons: recommendations.topCountry.reasons.slice(0, 2),
                strengths: recommendations.topCountry.strengths.slice(0, 2),
                weaknesses: recommendations.topCountry.weaknesses.slice(0, 2),
              }
            : null,
          rankings: recommendations.rankings.slice(0, 3).map((item) => ({
            ...item,
            reasons: item.reasons.slice(0, 2),
            strengths: item.strengths.slice(0, 2),
            weaknesses: item.weaknesses.slice(0, 2),
          })),
          summary: recommendations.summary,
          premiumLocked: true,
          profileComplete: true,
          premiumBenefits: [
            "Full country ranking",
            "Deeper reasons and weaknesses",
            "Clearer decision confidence",
            "Roadmap access for your top option",
          ],
        },
      });
    }

    return NextResponse.json<RecommendSuccessResponse>({
      ok: true,
      data: {
        topCountry: recommendations.topCountry,
        rankings: recommendations.rankings,
        summary: recommendations.summary,
        premiumLocked: false,
        profileComplete: true,
        premiumBenefits: [
          "Full ranked country list",
          "Best route clarity",
          "Step-by-step roadmap access",
          "Deeper migration decision guidance",
        ],
      },
    });
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