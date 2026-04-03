import { model, Schema } from "mongoose";
import {  SubscriptionPlan, TSubscription } from "./subscription.interface";

const subscriptionSchema = new Schema<TSubscription>(
  {
    price: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      required: true,
    },
    businesses: {
      type: Number,
      required: true,
    },
    contacts: {
      type: Number,
      required: true,
    },
    invoices: {
      type: Schema.Types.Mixed, // number | "unlimited"
      required: true,
    },
    estimates: {
      type: Schema.Types.Mixed, // number | "unlimited"
      required: true,
    },
    proformaInvoices: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = model<TSubscription>(
  "Subscription",
  subscriptionSchema
);