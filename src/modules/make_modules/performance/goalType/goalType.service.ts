import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { PerformanceGoalTypeModel } from "./goalType.model";
import { TPerformanceGoalType } from "./goalType.interface";

const P = permission.performance.goal_type;

export const goalTypeService = createPerformanceCrudService<TPerformanceGoalType>({
  model: PerformanceGoalTypeModel,
  label: "Goal type",
  perms: {
    manageAny: P.manage_any_goal_types,
    manageOwn: P.manage_own_goal_types,
  },
  searchFields: ["name", "description"],
  nameField: "name",
});
