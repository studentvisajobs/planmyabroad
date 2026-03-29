import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: "Premium required" },
        { status: 403 }
      );
    }

    if (!user.profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const country = String(body.country || "").trim();
    const blockersInput = String(body.blockers || "").trim();

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    const rule = await db.countryRule.findUnique({
      where: { country },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Country rule not found" },
        { status: 404 }
      );
    }

    const profile = user.profile;

    const estimatedFundsNeeded =
      country === "Canada"
        ? 15000
        : country === "Australia"
        ? 18000
        : country === "Germany"
        ? 12000
        : country === "UK"
        ? 16000
        : country === "Ireland"
        ? 14000
        : 13000;

    const currentFunds = profile.savingsAmount ?? profile.budget ?? 0;
    const fundingGap = Math.max(0, estimatedFundsNeeded - currentFunds);

    const prompt = `
You are PlanMyAbroad AI, a premium migration strategist.

Your task is to produce a HIGH-VALUE personalized relocation plan for the user.
This must feel worth paying for.

Rules:
- Be specific and practical
- Do NOT tell the user to "check the website"
- Do NOT say "consult an agent"
- Give direct, useful guidance from the data provided
- Use the user's real weaknesses and strengths
- Use timelines and prioritization
- Keep the tone confident, practical, and helpful
- Avoid fluff
- Output valid JSON only

USER PROFILE:
${JSON.stringify(profile, null, 2)}

TARGET COUNTRY:
${country}

COUNTRY RULE:
${JSON.stringify(rule, null, 2)}

USER'S WRITTEN CIRCUMSTANCES:
${blockersInput}

CALCULATED FUNDING GAP:
${fundingGap}

Return JSON in exactly this shape:
{
  "country": "${country}",
  "recommendedRoute": "short string",
  "summary": "2-4 sentence personalized explanation",
  "fundingGap": ${fundingGap},
  "documentsChecklist": ["item 1", "item 2", "item 3"],
  "days30Plan": ["step 1", "step 2", "step 3"],
  "days60Plan": ["step 1", "step 2", "step 3"],
  "days90Plan": ["step 1", "step 2", "step 3"],
  "topRisks": ["risk 1", "risk 2", "risk 3"],
  "finalAdvice": "short practical closing advice"
}
`;

    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: prompt,
    });

    const text = response.output_text;

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "AI returned an invalid roadmap format" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate premium roadmap" },
      { status: 500 }
    );
  }
}