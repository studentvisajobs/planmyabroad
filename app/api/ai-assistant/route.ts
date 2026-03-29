import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { assessRoutes } from "@/lib/assessment";

type AiAssistantSuccessResponse = {
  ok: true;
  data: {
    answer: string;
    premium: boolean;
    profileComplete: boolean;
  };
};

type AiAssistantErrorResponse = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "QUESTION_REQUIRED"
      | "PROFILE_MISSING"
      | "OPENAI_KEY_MISSING"
      | "AI_ASSISTANT_FAILED";
    message: string;
  };
};

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json<AiAssistantErrorResponse>(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to use the AI assistant.",
          },
        },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<AiAssistantErrorResponse>(
        {
          ok: false,
          error: {
            code: "OPENAI_KEY_MISSING",
            message: "OPENAI_API_KEY is missing.",
          },
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const question = String(body?.question || "").trim();

    if (!question) {
      return NextResponse.json<AiAssistantErrorResponse>(
        {
          ok: false,
          error: {
            code: "QUESTION_REQUIRED",
            message: "A question is required.",
          },
        },
        { status: 400 }
      );
    }

    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!dbUser?.profile) {
      return NextResponse.json<AiAssistantErrorResponse>(
        {
          ok: false,
          error: {
            code: "PROFILE_MISSING",
            message: "Please complete your profile before using the AI assistant.",
          },
        },
        { status: 400 }
      );
    }

    const preferredCountries = dbUser.profile.preferredCountries || [];

    const relevantRules =
      preferredCountries.length > 0
        ? await db.countryRule.findMany({
            where: {
              country: {
                in: preferredCountries,
              },
            },
            orderBy: { country: "asc" },
          })
        : await db.countryRule.findMany({
            orderBy: { country: "asc" },
            take: 10,
          });

    const profileSummary = {
      nationality: dbUser.profile.nationality,
      currentCountry: dbUser.profile.currentCountry,
      age: dbUser.profile.age,
      educationLevel: dbUser.profile.educationLevel,
      fieldOfStudy: dbUser.profile.fieldOfStudy,
      gpa: dbUser.profile.gpa,
      workExperience: dbUser.profile.workExperience,
      occupation: dbUser.profile.occupation,
      englishTestType: dbUser.profile.englishTestType,
      englishScore: dbUser.profile.englishScore,
      budget: dbUser.profile.budget,
      savingsAmount: dbUser.profile.savingsAmount,
      preferredCountries: dbUser.profile.preferredCountries,
      maritalStatus: dbUser.profile.maritalStatus,
      hasPassport: dbUser.profile.hasPassport,
      hasDegreeCertificate: dbUser.profile.hasDegreeCertificate,
      hasTranscript: dbUser.profile.hasTranscript,
      hasCv: dbUser.profile.hasCv,
      hasSop: dbUser.profile.hasSop,
      hasRecommendationLetter: dbUser.profile.hasRecommendationLetter,
      hasEnglishTestResult: dbUser.profile.hasEnglishTestResult,
      studyIntent: dbUser.profile.studyIntent,
      preferredIntake: dbUser.profile.preferredIntake,
      hasScholarshipInterest: dbUser.profile.hasScholarshipInterest,
      hasJobOffer: dbUser.profile.hasJobOffer,
      jobOfferCountry: dbUser.profile.jobOfferCountry,
      annualSalary: dbUser.profile.annualSalary,
      spouseHasEnglish: dbUser.profile.spouseHasEnglish,
      spouseEnglishScore: dbUser.profile.spouseEnglishScore,
      previousVisaRefusal: dbUser.profile.previousVisaRefusal,
      criminalRecord: dbUser.profile.criminalRecord,
      relocationTimelineMonths: dbUser.profile.relocationTimelineMonths,
    };

    const rulesSummary = relevantRules.map((rule) => {
      const assessment = assessRoutes(dbUser.profile, rule);

      return {
        country: rule.country,
        studyAvailable: rule.studyAvailable,
        workAvailable: rule.workAvailable,
        migrationAvailable: rule.migrationAvailable,
        minAge: rule.minAge,
        maxAge: rule.maxAge,
        requiresDegree: rule.requiresDegree,
        requiresWorkExperience: rule.requiresWorkExperience,
        requiresJobOffer: rule.requiresJobOffer,
        requiresEnglishTest: rule.requiresEnglishTest,
        requiresFundsProof: rule.requiresFundsProof,
        acceptedEnglishTests: rule.acceptedEnglishTests,
        minEnglishScore: rule.minEnglishScore,
        estimatedStudyCost: rule.estimatedStudyCost,
        estimatedWorkVisaCost: rule.estimatedWorkVisaCost,
        estimatedMigrationCost: rule.estimatedMigrationCost,
        fundsProofAmount: rule.fundsProofAmount,
        processingTimeStudy: rule.processingTimeStudy,
        processingTimeWork: rule.processingTimeWork,
        processingTimeMigration: rule.processingTimeMigration,
        keyDocuments: rule.keyDocuments,
        commonRefusalReasons: rule.commonRefusalReasons,
        notes: rule.notes,
        assessment: {
          bestRoute: assessment?.best?.route ?? null,
          bestScore: assessment?.best?.score ?? 0,
          bestEligible: assessment?.best?.eligible ?? false,
          bestReasons: assessment?.best?.reasons ?? [],
          secondRoute: assessment?.second?.route ?? null,
        },
      };
    });

const isPremium = dbUser.isPremium;

const prompt = `
You are PlanMyAbroad AI, a migration decision advisor.

STRICT RULES:
- Use ONLY provided data
- No generic advice
- No fluff
- No visa guarantees
- Be direct and realistic

USER PLAN:
${isPremium ? "premium" : "free"}

BEHAVIOR:

IF FREE USER:
- Keep response SHORT (max 150 words)
- Give:
  1. Best country OR route (only one)
  2. 1–2 key blockers
  3. 2 simple next actions
- DO NOT give full strategy
- DO NOT explain multiple countries
- DO NOT give roadmap

IF PREMIUM USER:
- Give FULL advisor response:
  1. Best country + route
  2. Why it fits (based on profile)
  3. Weaknesses (real risks)
  4. Alternative countries (ranked briefly)
  5. Step-by-step action plan
  6. What to fix first (priority order)
- Be specific and actionable

USER PROFILE:
${JSON.stringify(profileSummary, null, 2)}

COUNTRY DATA:
${JSON.stringify(rulesSummary, null, 2)}

QUESTION:
${question}

IMPORTANT:
Free answer should feel LIMITED.
Premium answer should feel like a CONSULTATION.
`;

    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: prompt,
    });

    return NextResponse.json<AiAssistantSuccessResponse>(
      {
        ok: true,
        data: {
          answer: response.output_text || "No answer returned.",
          premium: dbUser.isPremium,
          profileComplete: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI assistant error:", error);

    return NextResponse.json<AiAssistantErrorResponse>(
      {
        ok: false,
        error: {
          code: "AI_ASSISTANT_FAILED",
          message: error?.message || "Failed to generate AI response.",
        },
      },
      { status: 500 }
    );
  }
}