import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const saved = await db.savedPathway.create({
      data: {
        userId: session.user.id,
        country: body.country,
        pathway: body.pathway,
        score: body.score,
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}