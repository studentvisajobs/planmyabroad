import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    if (country) {
      const rule = await db.countryRule.findUnique({
        where: { country },
      });

      if (!rule) {
        return NextResponse.json(
          { error: `Country rule not found for ${country}` },
          { status: 404 }
        );
      }

      return NextResponse.json(rule);
    }

    const rules = await db.countryRule.findMany({
      orderBy: { country: "asc" },
    });

    return NextResponse.json(rules);
  } catch (error: any) {
    console.error("Country rules API error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to load country rules",
      },
      { status: 500 }
    );
  }
}