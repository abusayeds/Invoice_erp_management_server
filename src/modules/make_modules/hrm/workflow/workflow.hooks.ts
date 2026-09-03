import { HrmEmployeeModel } from "../models";
import { companyObjectId, companyScope } from "../shared/hrm.utils";
import type { WorkflowResourceKey } from "./workflow.validation";

const positionPrefix = (resource: WorkflowResourceKey) =>
  resource === "promotions" ? "previous_" : "from_";

/** Laravel: previous/from branch-dept-designation come from employee profile when not sent. */
export const fillPositionFromEmployeeProfile = async (
  companyId: string,
  body: Record<string, unknown>,
  prefix: string,
) => {
  const employeeUserId = body.employee_id ? String(body.employee_id) : "";
  if (!employeeUserId) return;

  const profile = await HrmEmployeeModel.findOne({
    ...companyScope(companyId),
    employee_user_id: companyObjectId(employeeUserId),
    isDeleted: false,
  })
    .select("branch_id department_id designation_id")
    .lean();

  if (!profile) return;

  if (!body[`${prefix}branch_id`] && profile.branch_id) body[`${prefix}branch_id`] = profile.branch_id;
  if (!body[`${prefix}department_id`] && profile.department_id) {
    body[`${prefix}department_id`] = profile.department_id;
  }
  if (!body[`${prefix}designation_id`] && profile.designation_id) {
    body[`${prefix}designation_id`] = profile.designation_id;
  }
};

/** Laravel PromotionController: updates employee row with current_* on create/update. */
export const syncEmployeePromotionPosition = async (
  companyId: string,
  body: Record<string, unknown>,
) => {
  const employeeUserId = body.employee_id ? String(body.employee_id) : "";
  if (!employeeUserId) return;

  const profile = await HrmEmployeeModel.findOne({
    ...companyScope(companyId),
    employee_user_id: companyObjectId(employeeUserId),
    isDeleted: false,
  });
  if (!profile) return;

  if (body.current_branch_id) profile.branch_id = body.current_branch_id as never;
  if (body.current_department_id) profile.department_id = body.current_department_id as never;
  if (body.current_designation_id) profile.designation_id = body.current_designation_id as never;
  await profile.save();
};

/** Laravel EmployeeTransferController: apply to_* to employee when status becomes approved. */
export const syncEmployeeTransferPosition = async (
  companyId: string,
  transfer: {
    employee_id?: unknown;
    to_branch_id?: unknown;
    to_department_id?: unknown;
    to_designation_id?: unknown;
  },
) => {
  const employeeUserId = transfer.employee_id ? String(transfer.employee_id) : "";
  if (!employeeUserId) return;

  const profile = await HrmEmployeeModel.findOne({
    ...companyScope(companyId),
    employee_user_id: companyObjectId(employeeUserId),
    isDeleted: false,
  });
  if (!profile) return;

  if (transfer.to_branch_id) profile.branch_id = transfer.to_branch_id as never;
  if (transfer.to_department_id) profile.department_id = transfer.to_department_id as never;
  if (transfer.to_designation_id) profile.designation_id = transfer.to_designation_id as never;
  await profile.save();
};

export const applyWorkflowCreateHooks = async (
  companyId: string,
  resource: WorkflowResourceKey,
  body: Record<string, unknown>,
) => {
  if (resource === "promotions" || resource === "employee-transfers") {
    await fillPositionFromEmployeeProfile(companyId, body, positionPrefix(resource));
  }
  if (resource === "promotions") {
    await syncEmployeePromotionPosition(companyId, body);
  }
};

export const applyWorkflowUpdateHooks = async (
  companyId: string,
  resource: WorkflowResourceKey,
  body: Record<string, unknown>,
) => {
  if (resource === "promotions") {
    if (body.employee_id) {
      await fillPositionFromEmployeeProfile(companyId, body, "previous_");
    }
    if (body.current_branch_id || body.current_department_id || body.current_designation_id) {
      await syncEmployeePromotionPosition(companyId, body);
    }
  }
};
