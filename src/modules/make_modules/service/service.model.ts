import { Schema, model } from "mongoose";
import { TService } from "./service.interface";


const serviceSchema = new Schema<TService>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceName: { type: String, required: true, trim: true },
    unitType: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    rate: { type: Number, required: true },

    taxes: [{ type: String }],

    currency: {
      type: String,
      enum: ["USD", "BDT", "EUR", "INR"],
      default: "BDT",
    },

    description: { type: String },

    serviceStock: { type: Boolean, default: false },
    sac: { type: Boolean, default: false },
    productStock: { type: Boolean, default: false },
    hsn: { type: Boolean, default: false },

    isArchive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel = model<TService>("Service", serviceSchema);