import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  return !!email && adminEmails.includes(email);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const rule = await db.countryRule.findUnique({
      where: { id },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Country rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load country rule" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await db.countryRule.update({
      where: { id },
      data: {
        country: body.country,
        studyAvailable: body.studyAvailable,
        workAvailable: body.workAvailable,
        migrationAvailable: body.migrationAvailable,

        minAge: body.minAge === "" ? null : body.minAge,
        maxAge: body.maxAge === "" ? null : body.maxAge,

        requiresDegree: body.requiresDegree,
        requiresWorkExperience: body.requiresWorkExperience,
        requiresJobOffer: body.requiresJobOffer,
        requiresEnglishTest: body.requiresEnglishTest,
        requiresFundsProof: body.requiresFundsProof,

        acceptedEnglishTests: Array.isArray(body.acceptedEnglishTests)
          ? body.acceptedEnglishTests
          : [],
        minEnglishScore:
          body.minEnglishScore === "" ? null : body.minEnglishScore,

        estimatedStudyCost: body.estimatedStudyCost || null,
        estimatedWorkVisaCost: body.estimatedWorkVisaCost || null,
        estimatedMigrationCost: body.estimatedMigrationCost || null,

        fundsProofAmount: body.fundsProofAmount || null,
        processingTimeStudy: body.processingTimeStudy || null,
        processingTimeWork: body.processingTimeWork || null,
        processingTimeMigration: body.processingTimeMigration || null,

        keyDocuments: Array.isArray(body.keyDocuments) ? body.keyDocuments : [],
        commonRefusalReasons: Array.isArray(body.commonRefusalReasons)
          ? body.commonRefusalReasons
          : [],
        notes: body.notes || null,
        officialSourceUrl: body.officialSourceUrl || null,
        lastReviewedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update country rule" },
      { status: 500 }
    );
  }
}