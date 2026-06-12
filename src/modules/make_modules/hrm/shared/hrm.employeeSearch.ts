import { Model } from "mongoose";
import { SearchNestedOptions } from "../../../../builder/queryBuilder";
import { UserModel } from "../../../basic_modules/user/user.model";
import {
  HrmBranchModel,
  HrmDepartmentModel,
  HrmDesignationModel,
} from "../models";
import { companyObjectId, companyScope, EMPLOYEE_USER_ROLES } from "./hrm.utils";

/** Shared `searchNested` config for HrmEmployee list endpoints. */
export const employeeListSearchNested = (
  companyId: string,
  localFields?: string[]
): SearchNestedOptions<unknown> => {
  const scope = companyScope(companyId);
  return {
    localFields: localFields ?? [
      "employee_id",
      "address_line_1",
      "address_line_2",
      "city",
      "state",
      "country",
      "emergency_contact_name",
      "emergency_contact_number",
      "account_holder_name",
    ],
    refs: [
      {
        foreignField: "employee_user_id",
        model: UserModel,
        fields: ["name", "email", "phone"],
        dotFields: ["businessProfile.companyName"],
        refFilter: {
          companyId: companyObjectId(companyId),
          role: { $in: EMPLOYEE_USER_ROLES },
          isDeleted: false,
        },
      },
      {
        foreignField: "branch_id",
        model: HrmBranchModel as Model<unknown>,
        fields: ["branch_name"],
        refFilter: scope,
      },
      {
        foreignField: "department_id",
        model: HrmDepartmentModel as Model<unknown>,
        fields: ["department_name"],
        refFilter: scope,
      },
      {
        foreignField: "designation_id",
        model: HrmDesignationModel as Model<unknown>,
        fields: ["designation_name"],
        refFilter: scope,
      },
    ],
  };
};
