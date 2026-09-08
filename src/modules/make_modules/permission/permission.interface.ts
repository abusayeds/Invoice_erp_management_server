import { Document, Types } from "mongoose";
import { TPermissions } from "../../basic_modules/user/user.interface";

export type TPermission = {
  companyId?: Types.ObjectId | null;
  role: string; // base enum role OR a company-defined custom role name
  permissions: TPermissions;
} & Document;
