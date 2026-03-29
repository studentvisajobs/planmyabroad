import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { assessRoutes } from "@/lib/assessment";

type CompareSuccessResponse = {
  ok: true;
  data: {
    country: string;
    score: number;
    eligible: boolean;
    route: string | null;
    secondRoute: string | null;
    reasonsPreview: string[];
    fullReasons: string[] | null;
    roadmap: string[] | null;
    premiumLocked: boolean;
    profileComplete: boolean;
  };
};

type CompareErrorResponse = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "COUNTRY_REQUIRED"
      | "COUNTRY_RULE_NOT_FOUND"
      | "COMPARE_FAILED";
    message: string;
  };
};

function buildRoadmap(params: {
  country: string;
  bestRoute: string;
  backupRoute: string | null;
  reasons: string[];
}) {
  const { country, bestRoute, backupRoute, reasons } = params;

  const blockers =
    reasons.length > 0
      ? reasons.map((reason) => `Resolve this blocker: ${reason}`)
      : ["You have no major blockers detected for this route right now."];

  return [
    `Best route for ${country}: ${bestRoute}.`,
    backupRoute
      ? `Backup route: ${backupRoute}.`
      : `No strong backup route is available yet.`,
    `Step 1: Focus on qualifying for the ${bestRoute} route first.`,
    `Step 2: Gather your core documents such as passport, academic records, CV, and language results if required.`,
    `Step 3: Review the route-specific eligibility gaps below and fix them before applying.`,
    ...blockers,
    `Step 4: Prepare proof of funds, work evidence, and supporting documents relevant to ${bestRoute}.`,
    `Step 5: Once your weakest gaps are fixed, proceed with this route before considering alternatives.`,
  ];
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<CompareErrorResponse>(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to compare countries.",
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country")?.trim();

    if (!country) {
      return NextResponse.json<CompareErrorResponse>(
        {
          ok: false,
          error: {
            code: "COUNTRY_REQUIRED",
            message: "A country is required for comparison.",
          },
        },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json<CompareErrorResponse>(
        {
          ok: false,
          error: {
            code: "PROFILE_MISSING",
            message: "Please complete your profile before comparing countries.",
          },
        },
        { status: 400 }
      );
    }

    const rule = await db.countryRule.findUnique({
      where: { country },
    });

    if (!rule) {
      return NextResponse.json<CompareErrorResponse>(
        {
          ok: false,
          error: {
            code: "COUNTRY_RULE_NOT_FOUND",
            message: `No country rule was found for ${country}.`,
          },
        },
        { status: 404 }
      );
    }

    const assessment = assessRoutes(user.profile, rule);
    const best = assessment?.best ?? null;
    const second = assessment?.second ?? null;

    if (!best) {
      return NextResponse.json<CompareSuccessResponse>(
        {
          ok: true,
          data: {
            country,
            score: 0,
            eligible: false,
            route: null,
            secondRoute: null,
            reasonsPreview: [
              "No strong migration route is currently available for this country.",
            ],
            fullReasons: user.isPremium
              ? ["No strong migration route is currently available for this country."]
              : null,
            roadmap: user.isPremium
              ? [
                  `You are not currently a strong fit for ${country}.`,
                  "Improve your language score, financial readiness, and supporting documents.",
                  "Compare with countries that better match your current strengths.",
                ]
              : null,
            premiumLocked: !user.isPremium,
            profileComplete: true,
          },
        },
        { status: 200 }
      );
    }

    const reasonsPreview = best.reasons.slice(0, 2);
    const roadmap = buildRoadmap({
      country,
      bestRoute: best.route,
      backupRoute: second?.route ?? null,
      reasons: best.reasons,
    });

    return NextResponse.json<CompareSuccessResponse>(
      {
        ok: true,
        data: {
          country,
          score: best.score,
          eligible: best.eligible,
          route: best.route,
          secondRoute: second?.route ?? null,
          reasonsPreview,
          fullReasons: user.isPremium ? best.reasons : null,
          roadmap: user.isPremium ? roadmap : null,
          premiumLocked: !user.isPremium,
          profileComplete: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Compare route error:", error);

    return NextResponse.json<CompareErrorResponse>(
      {
        ok: false,
        error: {
          code: "COMPARE_FAILED",
          message: "Failed to compare this country.",
        },
      },
      { status: 500 }
    );
  }
}