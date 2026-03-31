import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { assessRoutes } from "@/lib/assessment";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
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
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "PROFILE_MISSING",
            message: "Please complete your profile before comparing countries.",
          },
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    if (!country) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "COUNTRY_REQUIRED",
            message: "Country required",
          },
        },
        { status: 400 }
      );
    }

    const rule = await db.countryRule.findUnique({
      where: { country },
    });

    if (!rule) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "COUNTRY_RULE_NOT_FOUND",
            message: "Country rule not found",
          },
        },
        { status: 404 }
      );
    }

    const assessment = assessRoutes(profile, rule);
    const best = assessment.best;
    const second = assessment.second;

    if (!best) {
      return NextResponse.json({
        ok: true,
        data: {
          country,
          score: 0,
          eligible: false,
          route: null,
          secondRoute: null,
          reasonsPreview: ["No strong route is currently available for this country."],
          fullReasons: user.isPremium
            ? ["No strong route is currently available for this country."]
            : null,
          roadmap: user.isPremium
            ? [
                "This country does not currently look like a strong fit based on your profile.",
                "Focus on improving your English, funds, documents, and work experience.",
                "Consider comparing with countries that better match your current strengths.",
              ]
            : null,
          premiumLocked: !user.isPremium,
          profileComplete: true,
        },
      });
    }

    const roadmap: string[] = [
      `Your strongest route for ${country} is ${best.route}.`,
      second
        ? `Your backup option is ${second.route}.`
        : "There is no strong backup route yet.",
      ...best.reasons.map((reason) => `Fix: ${reason}`),
      `Focus on the ${best.route} route first because it currently gives you the highest realistic score.`,
    ];

    const reasonsPreview = best.reasons.slice(0, 2);

    return NextResponse.json({
      ok: true,
      data: {
        country,
        score: best.score,
        eligible: best.eligible,
        route: best.route,
        secondRoute: second?.route || null,
        reasonsPreview,
        fullReasons: user.isPremium ? best.reasons : null,
        roadmap: user.isPremium ? roadmap : null,
        premiumLocked: !user.isPremium,
        profileComplete: true,
      },
    });
  } catch (error) {
    console.error("Compare route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "COMPARE_FAILED",
          message: "Failed to compare country",
        },
      },
      { status: 500 }
    );
  }
}