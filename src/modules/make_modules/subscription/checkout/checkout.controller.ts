/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { STRIPE_WEBHOOK_SECRET } from "../../../../config";
import { UserModel } from "../../../basic_modules/user/user.model";
import { PlanModel } from "../plan/plan.model";
import { assignPlan } from "../companySubscription/assignment.service";
import { getActiveSubscription, resolveCompanyId } from "../subscription.helpers";
import { TBillingCycle } from "../subscription.constants";
import { stripe, createPlanCheckoutSession } from "./checkout.service";

/** POST /subscription/checkout — company starts a paid subscription (monthly | yearly). */
const createCheckout = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const { planId, billing_cycle, successUrl, cancelUrl } = req.body as {
    planId: string;
    billing_cycle: TBillingCycle;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (billing_cycle !== "monthly" && billing_cycle !== "yearly") {
    throw new AppError(httpStatus.BAD_REQUEST, "billing_cycle must be 'monthly' or 'yearly'");
  }

  const plan = await PlanModel.findOne({ _id: planId, isDeleted: false, status: true });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");

  const price = billing_cycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  if (!price || price <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is a free plan — use the assign-free endpoint.");
  }

  const result = await createPlanCheckoutSession({
    planId: String(plan._id),
    planName: plan.name,
    billingCycle: billing_cycle,
    price,
    userId: companyId,
    successUrl,
    cancelUrl,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

/** POST /subscription/assign-free — activate a free plan without payment. */
const assignFree = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const { planId, billing_cycle } = req.body as { planId: string; billing_cycle?: TBillingCycle };

  const plan = await PlanModel.findOne({ _id: planId, isDeleted: false, status: true });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
  if (!plan.free_plan) throw new AppError(httpStatus.BAD_REQUEST, "This is not a free plan.");

  const sub = await assignPlan(companyId, planId, billing_cycle === "yearly" ? "yearly" : "monthly");
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Free plan activated successfully",
    data: sub,
  });
});

/** POST /subscription/start-trial — activate a plan's trial (once per company, ever). */
const startTrial = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const { planId } = req.body as { planId: string };

  // Permanent one-time guard: even after switching to a paid/free plan, no second trial.
  const company = await UserModel.findById(companyId).select("is_trial_done");
  if (company?.is_trial_done) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already used your trial plan.");
  }

  const sub = await assignPlan(companyId, planId, "trial");
  await UserModel.findByIdAndUpdate(companyId, { is_trial_done: true });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Trial started successfully",
    data: sub,
  });
});

/** GET /subscription/my-subscription — the company's current entitlement. */
const mySubscription = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const sub = await getActiveSubscription(companyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieved successfully",
    data: sub.exists
      ? { ...sub.raw, expired: sub.expired }
      : { exists: false, message: "No active subscription" },
  });
});

/** POST /stripe/webhook (raw body, mounted in app.ts). Activates the plan on successful payment. */
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

    if (event.type === "checkout.session.completed") {
      if (session.payment_status !== "paid") {
        return res.json({ received: true });
      }
      const meta = session.metadata || {};
      if (!meta.planId || !meta.userId) {
        console.error("planId/userId missing in metadata");
        return res.json({ received: true });
      }
      const cycle: TBillingCycle = meta.billing_cycle === "yearly" ? "yearly" : "monthly";
      await assignPlan(String(meta.userId), String(meta.planId), cycle);
    } else {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
    return res.json({ received: true });
  } catch (err: any) {
    console.error(`❌ Webhook error: ${err.message}`);
    if (err.type === "StripeSignatureVerificationError") {
      return res.status(400).send(`Invalid signature: ${err.message}`);
    }
    return res.status(200).json({ received: true, error: "Processing error, will handle manually" });
  }
};

export const checkoutController = { createCheckout, assignFree, startTrial, mySubscription, webhook };
