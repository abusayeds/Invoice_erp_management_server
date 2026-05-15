import { Schema, model } from "mongoose";
import { TTax } from "./tax.interface";

const taxSchema = new Schema<TTax>(
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
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const TaxModel = model<TTax>("Tax", taxSchema);
