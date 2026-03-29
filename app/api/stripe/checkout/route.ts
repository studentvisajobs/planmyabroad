import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const priceId = process.env.STRIPE_PRICE_ID;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is missing" },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is missing" },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/premium/cancel`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}