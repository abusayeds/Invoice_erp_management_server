import { Schema, model } from "mongoose";
import { TProduct } from "./product.interface";

const pricingSchema = new Schema<TProduct["pricing"]>(
  {
    buyPrice: { type: Number, default: 0 },
    buyPriceTax: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    sellPriceTax: { type: Number, default: 0 },
    currency: { type: String, default: "USD", required: true },
  },
  { _id: false }
);

const stockSchema = new Schema<TProduct["stock"]>(
  {
    onHandStock: { type: Number, default: 0 },
    committedStock: { type: Number, default: 0 },
    availableForSale: { type: Number, default: 0 },
    toBeInvoiced: { type: Number, default: 0 },
    toBeBilled: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<TProduct>(

  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    unitType: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String },

    pricing: { type: pricingSchema, required: true },
    stock: { type: stockSchema, required: true },

    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<TProduct>("Product", productSchema);