
export const MODULE_CATALOG: { key: string; label: string }[] = [
  { key: "hrm", label: "HRM" },
  { key: "account", label: "Account" },
  { key: "double-entry", label: "Double Entry" },
  { key: "budget-planner", label: "Budget Planner" },
  { key: "goal", label: "Goal" },
  { key: "performance", label: "Performance" },
  { key: "quotation", label: "Quotation" },
  { key: "proposal", label: "Proposal" },
  { key: "project", label: "Project" },
  { key: "warehouse", label: "Warehouse" },
  { key: "training", label: "Training" },
];

export const MODULE_KEYS = MODULE_CATALOG.map((m) => m.key);

export const GATED_ROUTE_MODULES: Record<string, string> = {
  hrm: "hrm",
  account: "account",
  "double-entry": "double-entry",
  "budget-planner": "budget-planner",
  goal: "goal",
  performance: "performance",
  quotation: "quotation",
  proposal: "proposal",
  project: "project",
  training: "training",
};

export const LIMIT_RESOURCES: { key: string; label: string }[] = [];

export const LIMIT_KEYS = LIMIT_RESOURCES.map((r) => r.key);

export const UNLIMITED = -1;

export const BILLING_CYCLES = ["monthly", "yearly", "trial"] as const;
export type TBillingCycle = (typeof BILLING_CYCLES)[number];
