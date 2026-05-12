import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TPermission } from "./permission.interface";
import { PermissionModel } from "./permission.model";
import { role } from "../../../utils/role";

const updatePermissionDB = async (companyId: string, payload: Partial<TPermission>) => {
  const { role : prevRole, permissions } = payload;
  
  if (!prevRole) {
    throw new AppError(httpStatus.BAD_REQUEST, "Role is required");
  }
  if (!Object.values(role).includes(prevRole as any)) {
  throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
}
  const result = await PermissionModel.findOneAndUpdate(
    { companyId, role: prevRole },
    { permissions },
    { new: true, upsert: true , runValidators: true, }
  );
  
  return result;
};

const getPermissionsByCompanyDB = async (companyId: string) => {
  const result = await PermissionModel.find({ companyId });
  return result;
};

const getPermissionByRoleDB = async (companyId: string, role: string) => {
  const result = await PermissionModel.findOne({ companyId, role });
  return result;
};

export const permissionService = {
  updatePermissionDB,
  getPermissionsByCompanyDB,
  getPermissionByRoleDB,
};
