import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { assessRoutes } from "@/lib/assessment";
import { generateRoadmap } from "@/lib/roadmap-generator";

type RoadmapErrorResponse = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "PROFILE_MISSING"
      | "COUNTRY_REQUIRED"
      | "COUNTRY_RULE_NOT_FOUND"
      | "PREMIUM_REQUIRED"
      | "ROADMAP_FAILED";
    message: string;
  };
};

type RoadmapSuccessResponse = {
  ok: true;
  data: {
    country: string;
    pathway: string;
    readinessScore: number;
    estimatedTimeline: string;
    blockers: string[];
    nextBestActions: string[];
    steps: {
      title: string;
      description: string;
      priority: "High" | "Medium" | "Low";
      estimatedTime: string;
      documents: string[];
    }[];
    premiumLocked: boolean;
    profileComplete: boolean;
  };
};

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<RoadmapErrorResponse>(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to view a roadmap.",
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country")?.trim();

    if (!country) {
      return NextResponse.json<RoadmapErrorResponse>(
        {
          ok: false,
          error: {
            code: "COUNTRY_REQUIRED",
            message: "A country is required to generate a roadmap.",
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
      return NextResponse.json<RoadmapErrorResponse>(
        {
          ok: false,
          error: {
            code: "PROFILE_MISSING",
            message: "Please complete your profile before generating a roadmap.",
          },
        },
        { status: 400 }
      );
    }

    if (!user.isPremium) {
      return NextResponse.json<RoadmapErrorResponse>(
        {
          ok: false,
          error: {
            code: "PREMIUM_REQUIRED",
            message: "Premium is required to unlock a full roadmap.",
          },
        },
        { status: 403 }
      );
    }

    const rule = await db.countryRule.findUnique({
      where: { country },
    });

    if (!rule) {
      return NextResponse.json<RoadmapErrorResponse>(
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
    const roadmap = generateRoadmap(user.profile, rule, assessment);

    return NextResponse.json<RoadmapSuccessResponse>({
      ok: true,
      data: {
        ...roadmap,
        premiumLocked: false,
        profileComplete: true,
      },
    });
  } catch (error) {
    console.error("Roadmap route error:", error);

    return NextResponse.json<RoadmapErrorResponse>(
      {
        ok: false,
        error: {
          code: "ROADMAP_FAILED",
          message: "Failed to generate roadmap.",
        },
      },
      { status: 500 }
    );
  }
}