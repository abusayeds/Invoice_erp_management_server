import { Types } from "mongoose";
import { SubscriptionPlan, TSubscriptionPlan } from "../subscription/subscription.interface";

export type TPurchase = {

  user_id   : Types.ObjectId
  price: number;
  plan: TSubscriptionPlan;
  businesses: number;
  contacts: number;
  invoices: number | "unlimited";
  estimates: number | "unlimited";
  proformaInvoices: boolean;
  endDate  :  Date
  updatedAt ?: Date
  createdAt ?: Date
cancelUrl ?: string
successUrl ?: string
  __v ?: number
};
