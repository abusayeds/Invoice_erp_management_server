import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { assertEmployeeUser, companyScope, resolveCompanyId } from "../performance.utils";
import { PerformanceGoalTypeModel } from "../goalType/goalType.model";
import { PerformanceEmployeeGoalModel } from "./employeeGoal.model";
import { TPerformanceEmployeeGoal } from "./employeeGoal.interface";

const P = permission.performance.employee_goal;

const prepare = async (body: Record<string, unknown>, req: AuthRequest) => {
  const companyId = resolveCompanyId(req);

  if (body.employee_id !== undefined) {
    await assertEmployeeUser(body.employee_id, companyId, "Employee");
  }

  const goalTypeId = body.goal_type_id;
  if (goalTypeId !== undefined && goalTypeId !== null && goalTypeId !== "") {
    if (!Types.ObjectId.isValid(String(goalTypeId))) {
      throw new AppError(httpStatus.BAD_REQUEST, "Valid goal type is required");
    }
    const goalType = await PerformanceGoalTypeModel.findOne({
      _id: goalTypeId,
      ...companyScope(companyId),
    });
    if (!goalType) {
      throw new AppError(httpStatus.BAD_REQUEST, "Goal type not found in your company");
    }
  }

  return body;
};

export const employeeGoalService = createPerformanceCrudService<TPerformanceEmployeeGoal>({
  model: PerformanceEmployeeGoalModel,
  label: "Employee goal",
  perms: {
    manageAny: P.manage_any_employee_goals,
    manageOwn: P.manage_own_employee_goals,
  },
  searchFields: ["title", "description"],
  populate: [
    { path: "employee_id", select: "name email image" },
    { path: "goal_type_id", select: "name status" },
  ],
  employeeField: true,
  beforeCreate: prepare,
  beforeUpdate: prepare,
});
