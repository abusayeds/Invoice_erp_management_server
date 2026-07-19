import { Schema, model } from "mongoose";
import { TWarehouse } from "./warehouse.interface";

const warehouseSchema = new Schema<TWarehouse>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: String, required: true },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    is_active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WarehouseModel = model<TWarehouse>("Warehouse", warehouseSchema);
