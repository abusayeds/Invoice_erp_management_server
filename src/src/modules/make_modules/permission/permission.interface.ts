import { Document, Types } from "mongoose";
import { TRole } from "../../../utils/role";
import { TPermissions } from "../../basic_modules/user/user.interface";

export type TPermission = {
  companyId?: Types.ObjectId | null;
  role: TRole;
  permissions: TPermissions;
} & Document;
