import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { UserModel } from "../../../basic_modules/user/user.model";
import {
  HrmEmployeeModel,
  HrmEventTypeModel,
  HrmShiftModel,
  HrmWarningTypeModel,
} from "../models";
import { companyObjectId, companyScope, EMPLOYEE_USER_ROLES, resolveCompanyId } from "../shared/hrm.utils";
import { AuthRequest } from "../../../../middlewares/auth";

export const hrmLookupsService = {
  async warningBies(req: AuthRequest, employeeUserId: string) {
    const companyId = resolveCompanyId(req);
    const users = await UserModel.find({
      companyId: companyObjectId(companyId),
      role: { $in: EMPLOYEE_USER_ROLES },
      isDeleted: false,
      _id: { $ne: employeeUserId },
    })
      .select("_id name email image role")
      .lean();
    return users.map((u) => ({ _id: String(u._id), name: u.name, email: u.email }));
  },

  async warningTypes(req: AuthRequest, _warningById: string) {
    const companyId = resolveCompanyId(req);
    return HrmWarningTypeModel.find(companyScope(companyId))
      .select("warning_type_name description")
      .lean();
  },

  async approvedBies(req: AuthRequest, eventTypeId: string) {
    const companyId = resolveCompanyId(req);
    const exists = await HrmEventTypeModel.exists({ _id: eventTypeId, ...companyScope(companyId) });
    if (!exists) throw new AppError(httpStatus.NOT_FOUND, "Event type not found");
    const users = await UserModel.find({
      companyId: companyObjectId(companyId),
      role: { $in: EMPLOYEE_USER_ROLES },
      isDeleted: false,
    })
      .select("_id name email")
      .lean();
    return users.map((u) => ({ _id: String(u._id), name: u.name }));
  },

  async shiftsByEmployee(req: AuthRequest, employeeProfileId: string) {
    const companyId = resolveCompanyId(req);
    const emp = await HrmEmployeeModel.findOne({ _id: employeeProfileId, ...companyScope(companyId) })
      .populate("shift_id")
      .lean();
    if (!emp) throw new AppError(httpStatus.NOT_FOUND, "Employee not found");
    const allShifts = await HrmShiftModel.find(companyScope(companyId)).select("shift_name start_time end_time").lean();
    return { employee_shift: emp.shift_id, shifts: allShifts };
  },
};
