import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration data" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}