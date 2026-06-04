import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { PerformanceReviewCycleModel } from "./reviewCycle.model";
import { TPerformanceReviewCycle } from "./reviewCycle.interface";

const P = permission.performance.review_cycle;

export const reviewCycleService = createPerformanceCrudService<TPerformanceReviewCycle>({
  model: PerformanceReviewCycleModel,
  label: "Review cycle",
  perms: {
    manageAny: P.manage_any_review_cycles,
    manageOwn: P.manage_own_review_cycles,
  },
  searchFields: ["name", "description", "frequency"],
  nameField: "name",
});
