import {
  HrmBranchModel,
  HrmDepartmentModel,
  HrmDesignationModel,
  HrmEmployeeDocumentTypeModel,
  HrmShiftModel,
} from "../models";
import { validateHrmRefs } from "../shared/hrm.refValidation";

export const validateEmployeeProfileRefs = async (
  companyId: string,
  body: Record<string, unknown>,
  opts?: { partial?: boolean },
) => {
  await validateHrmRefs(
    companyId,
    body,
    [
      { field: "branch_id", label: "Branch", model: HrmBranchModel, kind: "companyDoc" },
      { field: "department_id", label: "Department", model: HrmDepartmentModel, kind: "companyDoc" },
      { field: "designation_id", label: "Designation", model: HrmDesignationModel, kind: "companyDoc" },
      { field: "shift_id", label: "Shift", model: HrmShiftModel, kind: "companyDoc" },
      {
        field: "document_type_id",
        label: "Employee document type",
        model: HrmEmployeeDocumentTypeModel,
        kind: "companyDoc",
      },
    ],
    opts,
  );
};
