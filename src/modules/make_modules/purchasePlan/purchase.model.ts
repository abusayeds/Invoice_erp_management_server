
import { model, Schema } from "mongoose";
import { TPurchase } from "./purchase.interface";
import { SubscriptionPlan } from "../subscription/subscription.interface";

const purchaseSchema = new Schema<TPurchase>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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
    endDate: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const PurchaseModel = model<TPurchase>(
  "Purchase",
  purchaseSchema
);