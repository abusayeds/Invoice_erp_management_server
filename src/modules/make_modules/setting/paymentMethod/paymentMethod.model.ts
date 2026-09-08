import { Schema, model } from "mongoose";
import { TPaymentMethod } from "./paymentMethod.interface";

const paymentMethodSchema = new Schema<TPaymentMethod>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const PaymentMethodModel = model<TPaymentMethod>("PaymentMethod", paymentMethodSchema);
