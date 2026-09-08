export const SubscriptionPlan = {
  FREE: "free",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;
export type TSubscriptionPlan =(typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
export type TSubscription = {
  price: number;
  plan: TSubscriptionPlan;
  businesses: number;
  contacts: number;
  invoices: number | "unlimited";
  estimates: number | "unlimited";
  proformaInvoices: boolean;
};
