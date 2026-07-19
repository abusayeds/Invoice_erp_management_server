import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../../../../config";
import { TBillingCycle } from "../subscription.constants";

export const stripe = new Stripe(STRIPE_SECRET_KEY as string);

/**
 * Create a Stripe checkout session for a plan.
 * Only planId + billing_cycle + userId travel in metadata (well under Stripe's 500-char
 * limit); the webhook re-reads the Plan server-side to build the entitlement snapshot.
 */
export const createPlanCheckoutSession = async (opts: {
  planId: string;
  planName: string;
  billingCycle: TBillingCycle;
  price: number;
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(opts.price * 100),
          product_data: { name: opts.planName },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      planId: opts.planId,
      billing_cycle: opts.billingCycle,
      userId: opts.userId,
    },
  });
  return { url: session.url, sessionId: session.id };
};
