import { Types } from "mongoose";

export type TProduct = {
  _id : Types.ObjectId;
    user_id : Types.ObjectId,
  productName: string;
  category?: string;
  sku?: string;
  unitType?: string;
  quantity: number;
  image?: string | null;

  pricing: {
    buyPrice?: number;
    buyPriceTax?: number;
    sellPrice?: number;
    sellPriceTax?: number;
    currency: "USD" | "BDT" | "EUR" | string;
  };

  stock: {
    onHandStock?: number;
    committedStock?: number;
    availableForSale?: number;
    toBeInvoiced?: number;
    toBeBilled?: number;
  };

  description?: string;
  isArchive?: boolean;
  isDeleted?: boolean;
}