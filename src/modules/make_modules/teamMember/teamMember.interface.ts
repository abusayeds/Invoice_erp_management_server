import { Document, Types } from "mongoose";
// permission.constants.ts

export const SHARING_TYPES = [
  "All Data",
  "Created by me",
] as const;

export const ACCESS_LEVELS = [
  "No Access",
  "View",
  "Add, Edit",
  "Add, Edit, Delete",
] as const;

export const MODULE_NAMES = [
  "Invoice",
  "Sales_Receipt",
  "Proforma_Invoice",
  "Estimate",
  "Purchase_Order",
  "Bill",
  "Expenses",
  "Time Logs",
  "Company",
  "Contacts",
  "Products",
  "Services",
  "Projects & Tasks",
  "My Documents",
] as const;

// 🔥 Types auto generate
export type TSharingType = (typeof SHARING_TYPES)[number];
export type TAccessLevel = (typeof ACCESS_LEVELS)[number];
export type TModuleName = (typeof MODULE_NAMES)[number];

export interface IPermission {
  module: TModuleName;
  sharing: TSharingType;
  access: TAccessLevel;
}

export interface ITeamMember extends Document {
  name: string;
  email: string;
  owner_id: Types.ObjectId; 
  user_id?: Types.ObjectId; 
  status: "pending" | "accepted";
  permissions: IPermission[];
  dashboard: boolean;
  reports: boolean;
  import: boolean;
  export: boolean;
  titles: boolean;
  settings: boolean;
  eInvoicing: boolean;
  eWayBill: boolean;
}