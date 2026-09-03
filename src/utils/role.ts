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

/** A party (User) that is BOTH a customer and a vendor — shows in both lists. */
export const PARTY_BOTH_ROLE = "both";

/** Role values a Customer list/edit query must match (customer, client, or both). */
export const CUSTOMER_ROLE_SET = [
  ...CUSTOMER_ROLE_VALUES,
  PARTY_BOTH_ROLE,
] as const;

/** Role values a Vendor list/edit query must match (vendor or both). */
export const VENDOR_ROLE_SET = [role.vendor, PARTY_BOTH_ROLE] as const;

export const isCustomerRole = (value: string) =>
  (CUSTOMER_ROLE_VALUES as readonly string[]).includes(value);