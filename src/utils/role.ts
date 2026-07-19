export const role = {
  superadmin: "superadmin",
  company: "company",
  customer: "customer",
  staff: "staff",
  vendor: "vendor",
  hr: "hr",
} as const;

export type TRole = keyof typeof role;

export const CUSTOMER_ROLE_VALUES = [role.customer, "client"] as const;

export const isCustomerRole = (value: string) =>
  (CUSTOMER_ROLE_VALUES as readonly string[]).includes(value);