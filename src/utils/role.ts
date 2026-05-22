export const role = {
  superadmin: "superadmin",
  company: "company",
  /** Customer / client — একই party type (আলাদা role নেই) */
  customer: "customer",
  staff: "staff",
  vendor: "vendor",
  hr: "hr",
} as const;

export type TRole = keyof typeof role;

/** DB-তে আগে থাকা `client` role সহ query */
export const CUSTOMER_ROLE_VALUES = [role.customer, "client"] as const;

export const isCustomerRole = (value: string) =>
  (CUSTOMER_ROLE_VALUES as readonly string[]).includes(value);