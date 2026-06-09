import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import { TPermission } from "./permission.interface";
import { PermissionModel } from "./permission.model";
import { role } from "../../../utils/role";
import { parseValidPermissions } from "../../../utils/permissionCatalog";
import { UserModel } from "../../basic_modules/user/user.model";

const ROLES_BLOCKED_FOR_USER_PERMISSION_UPDATE = new Set<string>([
  role.superadmin,
  role.company,

]);

const updatePermissionDB = async (companyId: string, payload: Partial<TPermission>) => {
  const { role: prevRole, permissions: rawPermissions } = payload;
  if (!prevRole) {
    throw new AppError(httpStatus.BAD_REQUEST, "Role is required");
  }
  if (!Object.values(role).includes(prevRole as (typeof role)[keyof typeof role])) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
  }
  if (rawPermissions === undefined || rawPermissions === null) {
    throw new AppError(httpStatus.BAD_REQUEST, "permissions is required");
  }
  const permissions = parseValidPermissions(rawPermissions);
  const result = await PermissionModel.findOneAndUpdate(
    { companyId, role: prevRole },
    { permissions },
    { new: true, upsert: true, runValidators: true },

  );
  return result;
};



const updateUserPermissionsDB = async (
  companyId: string,
  payload: { userId?: string; permissions?: unknown; resetToRole?: boolean },
) => {
  const { userId, permissions: rawPermissions, resetToRole } = payload;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Valid userId is required");
  }
  const user = await UserModel.findOne({
    _id: userId,
    companyId,
    isDeleted: false,
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found under this company");
  }
  if (ROLES_BLOCKED_FOR_USER_PERMISSION_UPDATE.has(user.role)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update permissions for superadmin or company users",
    );
  }

  if (resetToRole) {
    // Drop the override so this user follows live role permissions again (hybrid).
    const rolePermissions = await PermissionModel.findOne({ companyId, role: user.role });
    user.permissions = rolePermissions?.permissions ?? [];
    user.permissionsOverridden = false;
  } else {
    if (rawPermissions === undefined || rawPermissions === null) {
      throw new AppError(httpStatus.BAD_REQUEST, "permissions is required");
    }
    // Explicit per-user override: these win over the role until reset.
    user.permissions = parseValidPermissions(rawPermissions);
    user.permissionsOverridden = true;
  }

  await user.save();
  const result = user.toObject();
  delete result.password;
  delete result.permissionsOverridden;
  return result;
};



const getPermissionsByCompanyDB = async (companyId: string) => {
  const result = await PermissionModel.find({ companyId });
  return result;
};


const getPermissionByRoleDB = async (companyId: string, roleName: string) => {
  const result = await PermissionModel.findOne({ companyId, role: roleName });
  return result;
};



export const permissionService = {
  updatePermissionDB,
  updateUserPermissionsDB,
  getPermissionsByCompanyDB,
  getPermissionByRoleDB,

};

