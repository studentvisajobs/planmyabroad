import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { profileSchema } from "@/validators/profile";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.userProfile.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const profile = existing
      ? await db.userProfile.update({
          where: { id: existing.id },
          data: {
            ...parsed.data,
            userId: session.user.id,
          },
        })
      : await db.userProfile.create({
          data: {
            ...parsed.data,
            userId: session.user.id,
          },
        });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await db.userProfile.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}