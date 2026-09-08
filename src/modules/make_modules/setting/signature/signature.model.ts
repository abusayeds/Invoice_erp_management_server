import { Schema, model } from "mongoose";
import { TSignature } from "./signature.interface";

const signatureSchema = new Schema<TSignature>(
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
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SignatureModel = model<TSignature>("Signature", signatureSchema);
