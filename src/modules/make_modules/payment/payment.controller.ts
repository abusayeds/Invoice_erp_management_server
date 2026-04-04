/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { TPurchase } from "../purchasePlan/purchase.interface";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../../../config";
import { purchaseService } from "../purchasePlan/purchase.service";
export const stripe = new Stripe(STRIPE_SECRET_KEY as string);
const paymentCheckoutSession = async (payload: TPurchase) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: payload.price * 100,
                    product_data: {
                        name: "Purchase subscription",
                    }
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: payload?.successUrl,
        cancel_url: payload?.cancelUrl,
        metadata: {
            planData: JSON.stringify(payload) || null,
        },
    });
    return { url: session.url, sessionId: session.id };
};

const webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    try {
        const webhookSecret = STRIPE_WEBHOOK_SECRET as string;
        if (!webhookSecret) {
            console.error("Webhook Secret Key Missing!");
            return res.status(500).send("Server configuration error");
        }
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        const session: any = event.data.object;
        const planData = session.metadata?.planData
        if (event.type === "checkout.session.completed") {
            if (session.payment_status !== 'paid') {
                console.log('Payment not completed, status:', session.payment_status);
                return res.json({ received: true });
            }
            if (!planData) {
                console.error('planData not found in metadata');
                return res.json({ received: true });
            }
            if (session.payment_status === 'paid') {
                 await purchaseService.purchaseSubscriptionDB(JSON.parse(planData));
                console.log("in webhook", planData);
            }
        }
        else if (event.type === "checkout.session.async_payment_failed") {
            const sessionId = session.id;
            console.log(`Payment failed for session: ${sessionId}`);
        } else if (event.type === "transfer.created") {
            console.log("transfer.created", session.metadata);
            return res.json({ received: true });
        }else {
            console.log(`⚠️ Unhandled event type: ${event.type}`);
        }
        return res.json({ received: true });
    } catch (err: any) {
        console.error(`❌ Webhook error: ${err.message}`);
        if (err.type === 'StripeSignatureVerificationError') {
            return res.status(400).send(`Invalid signature: ${err.message}`);
        }
        return res.status(200).json({
            received: true,
            error: 'Processing error, will handle manually'
        });
    }
}
export const paymentController = {
    webhook,
    paymentCheckoutSession,
};
