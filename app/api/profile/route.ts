import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const profile = await db.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        nationality: body.nationality,
        currentCountry: body.currentCountry,
        age: body.age,
        educationLevel: body.educationLevel,
        fieldOfStudy: body.fieldOfStudy,
        gpa: body.gpa,
        workExperience: body.workExperience,
        occupation: body.occupation,
        englishTestType: body.englishTestType,
        englishScore: body.englishScore,
        budget: body.budget,
        savingsAmount: body.savingsAmount,
        preferredCountries: body.preferredCountries ?? [],
        maritalStatus: body.maritalStatus,
        hasPassport: body.hasPassport ?? false,
        hasDegreeCertificate: body.hasDegreeCertificate ?? false,
        hasTranscript: body.hasTranscript ?? false,
        hasCv: body.hasCv ?? false,
        hasSop: body.hasSop ?? false,
        hasRecommendationLetter: body.hasRecommendationLetter ?? false,
        hasEnglishTestResult: body.hasEnglishTestResult ?? false,
        studyIntent: body.studyIntent,
        preferredIntake: body.preferredIntake,
        hasScholarshipInterest: body.hasScholarshipInterest ?? false,
        hasJobOffer: body.hasJobOffer ?? false,
        jobOfferCountry: body.jobOfferCountry,
        annualSalary: body.annualSalary,
        spouseHasEnglish: body.spouseHasEnglish ?? false,
        spouseEnglishScore: body.spouseEnglishScore,
        previousVisaRefusal: body.previousVisaRefusal ?? false,
        criminalRecord: body.criminalRecord ?? false,
        relocationTimelineMonths: body.relocationTimelineMonths,
      },
      create: {
        userId: session.user.id,
        nationality: body.nationality,
        currentCountry: body.currentCountry,
        age: body.age,
        educationLevel: body.educationLevel,
        fieldOfStudy: body.fieldOfStudy,
        gpa: body.gpa,
        workExperience: body.workExperience,
        occupation: body.occupation,
        englishTestType: body.englishTestType,
        englishScore: body.englishScore,
        budget: body.budget,
        savingsAmount: body.savingsAmount,
        preferredCountries: body.preferredCountries ?? [],
        maritalStatus: body.maritalStatus,
        hasPassport: body.hasPassport ?? false,
        hasDegreeCertificate: body.hasDegreeCertificate ?? false,
        hasTranscript: body.hasTranscript ?? false,
        hasCv: body.hasCv ?? false,
        hasSop: body.hasSop ?? false,
        hasRecommendationLetter: body.hasRecommendationLetter ?? false,
        hasEnglishTestResult: body.hasEnglishTestResult ?? false,
        studyIntent: body.studyIntent,
        preferredIntake: body.preferredIntake,
        hasScholarshipInterest: body.hasScholarshipInterest ?? false,
        hasJobOffer: body.hasJobOffer ?? false,
        jobOfferCountry: body.jobOfferCountry,
        annualSalary: body.annualSalary,
        spouseHasEnglish: body.spouseHasEnglish ?? false,
        spouseEnglishScore: body.spouseEnglishScore,
        previousVisaRefusal: body.previousVisaRefusal ?? false,
        criminalRecord: body.criminalRecord ?? false,
        relocationTimelineMonths: body.relocationTimelineMonths,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}