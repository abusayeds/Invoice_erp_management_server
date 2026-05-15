import { Schema, model } from "mongoose";
import { TWarehouse } from "./warehouse.interface";

const warehouseSchema = new Schema<TWarehouse>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const WarehouseModel = model<TWarehouse>("Warehouse", warehouseSchema);
