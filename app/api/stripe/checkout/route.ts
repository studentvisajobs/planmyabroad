import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const priceId = process.env.STRIPE_PRICE_ID?.trim();

    if (!appUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is missing" },
        { status: 500 }
      );
    }

    if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: `Invalid NEXT_PUBLIC_APP_URL: ${appUrl}` },
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
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
      success_url: `${appUrl}/premium?success=true`,
      cancel_url: `${appUrl}/premium`,
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