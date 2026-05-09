import { z } from "zod";

const PermissionSchema = z.object({
  module: z.enum([
    "Invoices", "Sales Receipt", "Proforma Invoices", "Estimates",
    "Purchase Orders", "Bill", "Expenses", "Time Logs",
    "Company", "Contacts", "Products", "Services",
    "Projects & Tasks", "My Documents"
  ]),
  sharing: z.enum(["All Data", "Created by me"]).default("All Data"),
  access: z.enum(["No Access", "View", "Add, Edit", "Add, Edit, Delete"]).default("No Access"),
});

export const inviteTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    permissions: z.array(PermissionSchema).optional(),
    dashboard: z.boolean().optional(),
    reports: z.boolean().optional(),
    import: z.boolean().optional(),
    export: z.boolean().optional(),
    titles: z.boolean().optional(),
    settings: z.boolean().optional(),
    eInvoicing: z.boolean().optional(),
    eWayBill: z.boolean().optional(),
  }),
});

export const updateTeamMemberSchema = z.object({
  body: z.object({
    permissions: z.array(PermissionSchema).optional(),
    dashboard: z.boolean().optional(),
    reports: z.boolean().optional(),
    import: z.boolean().optional(),
    export: z.boolean().optional(),
    titles: z.boolean().optional(),
    settings: z.boolean().optional(),
    eInvoicing: z.boolean().optional(),
    eWayBill: z.boolean().optional(),
  }),
});
