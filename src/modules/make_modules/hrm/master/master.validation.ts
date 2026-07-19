import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import { HrmBranchModel, HrmDepartmentModel } from "../models";
import { companyObjectId, companyScope } from "../shared/hrm.utils";
import { validateHrmRefs } from "../shared/hrm.refValidation";
export type MasterResourceKey =
  | "branches"
  | "departments"
  | "designations"
  | "shifts"
  | "employee-document-types"
  | "award-types"
  | "termination-types"
  | "warning-types"
  | "complaint-types"
  | "holiday-types"
  | "document-categories"
  | "announcement-categories"
  | "event-types"
  | "allowance-types"
  | "deduction-types"
  | "loan-types"
  | "leave-types"
  | "ip-restricts";

export const validateMasterPayload = async (
  companyId: string,
  resource: MasterResourceKey,
  body: Record<string, unknown>,
  opts?: { partial?: boolean },
) => {
  if (resource === "departments") {
    await validateHrmRefs(
      companyId,
      body,
      [{ field: "branch_id", label: "Branch", model: HrmBranchModel, kind: "companyDoc" }],
      opts,
    );
    return;
  }

  if (resource === "designations") {
    await validateHrmRefs(
      companyId,
      body,
      [
        { field: "branch_id", label: "Branch", model: HrmBranchModel, kind: "companyDoc" },
        { field: "department_id", label: "Department", model: HrmDepartmentModel, kind: "companyDoc" },
      ],
      opts,
    );

    const deptId = body.department_id ? String(body.department_id) : "";
    const branchId = body.branch_id ? String(body.branch_id) : "";
    if (deptId && branchId) {
      const dept = await HrmDepartmentModel.findOne({
        _id: companyObjectId(deptId),
        ...companyScope(companyId),
      })
        .select("branch_id")
        .lean();
      if (dept?.branch_id && String(dept.branch_id) !== branchId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Department does not belong to the selected branch",
        );
      }
    }
  }
};
